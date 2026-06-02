import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Reader } from '../reader/reader.entity';
import { Book } from '../book/book.entity';

@Entity({ name: 'return-records' })
export class ReturnRecord {
    @PrimaryGeneratedColumn('uuid')
    returnRecordId: string;

    @Column({ type: 'integer', nullable: false })
    quantity: number;

    @Column({type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
    lateFee: number;

    @Column({ type: 'date', nullable: false })
    borrowDate: Date;
    
    @Column({ type: 'date', nullable: false })
    dueDate: Date;

    @Column({ type: 'date', nullable: false, default: () => 'CURRENT_DATE' })
    actualReturnDate: Date;

    @ManyToOne(() => Reader, reader => reader.returnRecords, { eager: false, nullable: true })
    @JoinColumn()
    reader: Reader | null;

    @ManyToOne(() => Book, book => book.returnRecords, { eager: false, nullable: true })
    @JoinColumn()
    book: Book | null;
}