import { DiscountType } from 'src/common/enums/promotion/discountType.enum';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';

export class PromotionPublicDto {
    promotionId: string;
    name: string;
    description: string | null;
    discountType: DiscountType;
    discountValue: number;
    maxBorrowedBooksOverride: number | null;
    maxBorrowDurationOverride: number | null;
    applicableCardTypes: ReadingCardType[];
    applicableAgeMin: number;
    applicableAgeMax: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
}
