import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { ReadingCard } from '../reading-card/reading-card.entity';
import { BorrowRecord } from '../borrow-record/borrow-record.entity';
import { Book } from '../book/book.entity';

@Entity({ name: 'readers' })
export class Reader {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    address: string | null;

    @OneToOne(() => User, { eager: false, nullable: true })
    @JoinColumn()
    user: User | null;

    @OneToMany(() => ReadingCard, readingCard => readingCard.reader, { eager: false })
    readingCards: ReadingCard[];

    @OneToMany(() => BorrowRecord, borrowRecord => borrowRecord.reader, { eager: false })
    borrowRecords: BorrowRecord[];

    @ManyToMany(() => Book, book => book.waitingReaders, { eager: false })
    waitingBooks: Book[];
}