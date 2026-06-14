import { IsString, IsEnum, IsInt, IsOptional, IsArray, Min, Max, IsDateString } from 'class-validator';
import { DiscountType } from 'src/common/enums/promotion/discountType.enum';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';

export class CreatePromotionDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(DiscountType)
    discountType: DiscountType;

    @IsInt()
    @Min(0)
    discountValue: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    maxBorrowedBooksOverride?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    maxBorrowDurationOverride?: number;

    @IsArray()
    @IsEnum(ReadingCardType, { each: true })
    applicableCardTypes: ReadingCardType[];

    @IsInt()
    @Min(0)
    applicableAgeMin: number;

    @IsInt()
    @Min(0)
    applicableAgeMax: number;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;
}
