
import { CreateDateColumn, UpdateDateColumn, Column, BaseEntity } from 'typeorm';

export abstract class AuditEntity extends BaseEntity {
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'created_by_user_id', type: 'integer', nullable: true })
    createdByUserId: number | null;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'updated_by_user_id', type: 'integer', nullable: true })
    updatedByUserId: number | null;
}
