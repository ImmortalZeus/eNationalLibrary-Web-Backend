import { Expose } from 'class-transformer';
import { DiscountType } from 'src/common/enums/promotion/discountType.enum';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';

export class PromotionPublicDto {
    @Expose()
    promotionId: string;

    @Expose()
    name: string;

    @Expose()
    description: string | null;

    @Expose()
    discountType: DiscountType;

    @Expose()
    discountValue: number;

    @Expose()
    maxBorrowedBooksOverride: number | null;

    @Expose()
    maxBorrowDurationOverride: number | null;

    @Expose()
    applicableCardTypes: ReadingCardType[];

    @Expose()
    applicableAgeMin: number;

    @Expose()
    applicableAgeMax: number;

    @Expose()
    startDate: Date;

    @Expose()
    endDate: Date;

    @Expose()
    isActive: boolean;

    @Expose()
    priority: number;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
