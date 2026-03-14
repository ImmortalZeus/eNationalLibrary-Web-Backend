import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';

@Entity({ name: 'reading-cards' })
export class ReadingCard {
    @PrimaryColumn({ type: 'varchar', nullable: false, unique: true })
    readingCardId: string;

    @Column({ type: 'varchar', nullable: false })
    label: string;

    @Column({ type: 'varchar', nullable: false })
    type: ReadingCardType;

    @Column({ type: 'date', nullable: false })
    activationDate: Date;
    
    @Column({ type: 'date', nullable: false })
    expiryDate: Date;
}