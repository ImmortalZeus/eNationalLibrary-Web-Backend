import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray } from 'class-validator';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';
import { ReaderPublicDto } from 'src/modules/reader/dto/reader-public.dto';
import { Reader } from 'src/modules/reader/reader.entity';
import { PromotionPublicDto } from 'src/modules/promotion/dto/promotion-public.dto';

export class ReadingCardPublicDto {
    @Expose()
    readingCardId: string;

    @Expose()
    label: string;

    @Expose()
    type: ReadingCardType;

    @Expose()
    activationDate: Date;
    
    @Expose()
    expiryDate: Date | null;

    @Expose()
    reader?: ReaderPublicDto;

    @Expose()
    appliedPromotion?: PromotionPublicDto | null;

    @Expose()
    originalPrice: number;

    @Expose()
    discountedPrice: number;

    @Expose()
    effectiveMaxBorrowedBooks: number;

    @Expose()
    effectiveMaxBorrowDurationDays: number;
}