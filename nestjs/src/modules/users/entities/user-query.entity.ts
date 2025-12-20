
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('user_queries')
export class UserQuery {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', nullable: true })
    userId: number;

    @Column({ name: 'action_type' })
    actionType: string; // REGISTER, LOGIN, GET_USERS, etc.

    @Column()
    endpoint: string;

    @Column()
    method: string;

    @Column({ name: 'ip_address', nullable: true })
    ipAddress: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
