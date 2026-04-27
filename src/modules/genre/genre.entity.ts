import { Entity, Column, PrimaryColumn, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from '../book/book.entity';

@Entity({ name: 'genres' })
export class Genre {
    @PrimaryGeneratedColumn('uuid')
    genreId: string;

    @Column({ type: 'varchar', nullable: false })
    label: string;

    @Column({ type: 'varchar', nullable: false })
    description: string;

    @ManyToMany(() => Book, book => book.genres, { eager: false })
    books: Book[];
}