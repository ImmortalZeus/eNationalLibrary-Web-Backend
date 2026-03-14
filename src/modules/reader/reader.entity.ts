import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'readers' })
export class Reader {
    @PrimaryColumn({ type: 'varchar', nullable: false, unique: true })
    userId: string;

    @OneToOne(() => User, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'varchar', nullable: true, default: null })
    address: string | null;

    @Column({ type: 'varchar', array: true, nullable: false, default: [] })
    readingCardIds: string[];

    @Column({ type: 'varchar', array: true, nullable: false, default: [] })
    borrowRecordIds: string[];
}