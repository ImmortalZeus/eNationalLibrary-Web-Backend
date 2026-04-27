import { Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Book } from '../book/book.entity';

@Entity({ name: 'publishers' })
export class Publisher {
    @PrimaryGeneratedColumn('uuid')
    publisherId: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: false })
    description: string;

    @ManyToMany(() => Book, book => book.publishers, { eager: false })
    books: Book[];
}