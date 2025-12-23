
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AuditEntity } from '../../../common/audit.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends AuditEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ unique: true, length: 150 })
    email: string;

    @Column({ name: 'password_hash' })
    @Exclude() // Never return password
    passwordHash: string;

    @Column({ name: 'profile_image_path', nullable: true })
    profileImagePath: string;

    @Column({ default: true })
    status: boolean;

    requestCount?: number;
}
