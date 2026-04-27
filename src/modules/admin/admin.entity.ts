import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'admins' })
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @OneToOne(() => User, { eager: false })
    @JoinColumn()
    user: User;
}