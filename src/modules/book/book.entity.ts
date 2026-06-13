import { Entity, Column, PrimaryColumn, ManyToMany, OneToOne, ManyToOne, JoinTable, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reader } from '../reader/reader.entity';
import { Author } from '../author/author.entity';
import { Publisher } from '../publisher/publisher.entity';
import { Genre } from '../genre/genre.entity';
import { BorrowRecord } from '../borrow-record/borrow-record.entity';
import { ReturnRecord } from '../return-record/return-record.entity';
import { Review } from '../review/review.entity';
@Entity({ name: 'books' })
export class Book {
    @PrimaryGeneratedColumn('uuid')
    bookId: string;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'varchar', nullable: false })
    description: string;
    
    @Column({ type: 'varchar', nullable: false })
    previewUrl: string;

    @ManyToMany(() => Author, author => author.books, { eager: false })
    @JoinTable()
    authors: Author[];

    @ManyToMany(() => Publisher, publisher => publisher.books, { eager: false })
    @JoinTable()
    publishers: Publisher[];

    @ManyToMany(() => Genre, genre => genre.books, { eager: false })
    @JoinTable()
    genres: Genre[];

    @ManyToMany(() => Reader, reader => reader.waitingBooks, { eager: false })
    @JoinTable()
    waitingReaders: Reader[];

    @OneToMany(() => Review, review => review.book, { eager: false })
    reviews: Review[];

    @OneToMany(() => BorrowRecord, borrowRecord => borrowRecord.book, { eager: false })
    borrowRecords: BorrowRecord[];

    @OneToMany(() => ReturnRecord, returnRecord => returnRecord.book, { eager: false })
    returnRecords: ReturnRecord[];
}