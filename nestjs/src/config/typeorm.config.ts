
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { UserQuery } from '../modules/users/entities/user-query.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: process.env.NODE_ENV === 'test' ? ':memory:' : 'database.sqlite',
    entities: [User, UserQuery],
    synchronize: true, // Auto-create tables (Dev only)
    logging: false,
    dropSchema: process.env.NODE_ENV === 'test',
};
