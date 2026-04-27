import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Reader } from '../reader/reader.entity';
import { Book } from '../book/book.entity';

@Entity({ name: 'borrow-records' })
export class BorrowRecord {
    @PrimaryGeneratedColumn('uuid')
    borrowRecordId: string;

    @Column({ type: 'integer', nullable: false })
    quantity: number;

    @Column({ type: 'date', nullable: false })
    borrowDate: Date;
    
    @Column({ type: 'date', nullable: false })
    dueDate: Date;

    @Column({ type: 'date', nullable: true, default: null })
    actualReturnDate: Date | null;

    @ManyToOne(() => Reader, reader => reader.borrowRecords, { eager: false, nullable: true })
    @JoinColumn()
    reader: Reader | null;

    @ManyToOne(() => Book, book => book.borrowRecords, { eager: false, nullable: true })
    @JoinColumn()
    book: Book | null;
}