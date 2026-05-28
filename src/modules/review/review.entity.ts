import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from '../book/book.entity';
import { Reader } from '../reader/reader.entity';

@Entity({ name: 'reviews' })

export class Review {
    @PrimaryGeneratedColumn('uuid')
    reviewId: string;

    @Column({ type: 'int', nullable: false })
    rating: number;

    @Column({ type: 'varchar', nullable: false })
    comment: string;

    @Column({ type: 'date', nullable: false })
    reviewDate: Date;

    @ManyToOne(() => Book, book => book.reviews, { eager: false, nullable: true })
    @JoinColumn()
    book: Book | null;

    @ManyToOne(() => Reader, reader => reader.reviews, { eager: false, nullable: true })
    @JoinColumn()
    reader: Reader | null;
}