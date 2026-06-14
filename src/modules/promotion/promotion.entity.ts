import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DiscountType } from 'src/common/enums/promotion/discountType.enum';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';

@Entity({ name: 'promotions' })
export class Promotion {
    @PrimaryGeneratedColumn('uuid')
    promotionId: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true, default: null })
    description: string | null;

    @Column({ type: 'varchar', nullable: false })
    discountType: DiscountType;

    @Column({ type: 'int', nullable: false })
    discountValue: number;

    @Column({ type: 'int', nullable: true, default: null })
    maxBorrowedBooksOverride: number | null;

    @Column({ type: 'int', nullable: true, default: null })
    maxBorrowDurationOverride: number | null;

    @Column({ type: 'varchar', array: true, nullable: false, default: '{Normal,VIP}' })
    applicableCardTypes: ReadingCardType[];

    @Column({ type: 'int', nullable: false })
    applicableAgeMin: number;

    @Column({ type: 'int', nullable: false })
    applicableAgeMax: number;

    @Column({ type: 'date', nullable: false })
    startDate: Date;

    @Column({ type: 'date', nullable: false })
    endDate: Date;

    @Column({ type: 'boolean', nullable: false, default: false })
    isActive: boolean;

    @Column({ type: 'int', nullable: false, default: 0 })
    priority: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
