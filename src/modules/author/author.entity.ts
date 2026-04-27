import { Entity, Column, PrimaryColumn, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from '../book/book.entity';

@Entity({ name: 'authors' })
export class Author {
    @PrimaryGeneratedColumn('uuid')
    authorId: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'date', nullable: false })
    dateOfBirth: Date;

    @Column({ type: 'date', nullable: true, default: null })
    dateOfDeath: Date | null;

    @Column({ type: 'varchar', nullable: false })
    description: string;

    @ManyToMany(() => Book, book => book.authors, { eager: false })
    books: Book[];
}