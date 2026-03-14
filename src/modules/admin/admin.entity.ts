import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'admins' })
export class Admin {
    @PrimaryColumn({ type: 'varchar', nullable: false, unique: true })
    userId: string;

    @OneToOne(() => User, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;
}