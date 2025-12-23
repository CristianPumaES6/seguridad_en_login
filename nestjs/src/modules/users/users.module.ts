
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserQuery } from './entities/user-query.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserQuery])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService, TypeOrmModule], // Export TypeOrmModule so other modules can use Repository<User> if needed
})
export class UsersModule { }
