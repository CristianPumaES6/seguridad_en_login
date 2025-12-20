
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserQuery } from '../../modules/users/entities/user-query.entity';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    constructor(
        @InjectRepository(UserQuery)
        private queryRepo: Repository<UserQuery>,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, ip, user } = request;

        // Detect action type based on Method/URL
        // This is a naive implementation, can be improved with metadata
        let action = 'UNKNOWN';
        if (url.includes('/auth/register')) action = 'REGISTER';
        else if (url.includes('/auth/login')) action = 'LOGIN';
        else if (method === 'GET' && url.includes('/users')) action = 'GET_USERS';
        else if (method === 'GET' && url.includes('/profile')) action = 'PROFILE_VIEW';
        else if (method === 'PUT') action = 'UPDATE_USER';
        else if (method === 'DELETE') action = 'DELETE_USER';

        return next.handle().pipe(
            tap(async () => {
                try {
                    const log = this.queryRepo.create({
                        userId: user ? user.userId : null, // user from JWT
                        actionType: action,
                        endpoint: url,
                        method: method,
                        ipAddress: ip,
                    });
                    await this.queryRepo.save(log);
                } catch (e) {
                    this.logger.error('Failed to log user query', e);
                }
            }),
        );
    }
}
