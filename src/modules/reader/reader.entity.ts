import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { ReadingCard } from '../reading-card/reading-card.entity';
import { BorrowRecord } from '../borrow-record/borrow-record.entity';
import { ReturnRecord } from '../return-record/return-record.entity';
import { Book } from '../book/book.entity';
import { Review } from '../review/review.entity';
@Entity({ name: 'readers' })
export class Reader {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    address: string | null;

    @OneToOne(() => User, { eager: true, nullable: true })
    @JoinColumn()
    user: User | null;
    
    @OneToMany(() => Review, review => review.reader, { eager: false })
    reviews: Review[];

    @OneToMany(() => ReadingCard, readingCard => readingCard.reader, { eager: false })
    readingCards: ReadingCard[];

    @OneToMany(() => BorrowRecord, borrowRecord => borrowRecord.reader, { eager: false })
    borrowRecords: BorrowRecord[];

    @OneToMany(() => ReturnRecord, returnRecord => returnRecord.reader, { eager: false })
    returnRecords: ReturnRecord[];

    @ManyToMany(() => Book, book => book.waitingReaders, { eager: false })
    waitingBooks: Book[];
}