import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';
import { Reader } from '../reader/reader.entity';

@Entity({ name: 'reading-cards' })
export class ReadingCard {
    @PrimaryGeneratedColumn('uuid')
    readingCardId: string;

    @Column({ type: 'varchar', nullable: false })
    label: string;

    @Column({ type: 'varchar', nullable: false })
    type: ReadingCardType;

    @Column({ type: 'date', nullable: false })
    activationDate: Date;
    
    @Column({ type: 'date', nullable: false })
    expiryDate: Date;

    @ManyToOne(() => Reader, reader => reader.readingCards, { eager: false, nullable: true })
    @JoinColumn()
    reader: Reader | null;
}