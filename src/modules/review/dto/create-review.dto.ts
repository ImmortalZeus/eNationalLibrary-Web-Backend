import { IsString, IsInt, Min, Max, IsOptional, IsDateString } from 'class-validator';
import { IsPresent } from 'src/common/validators/isPresent.validator';

export class CreateReviewDto {
    @IsPresent()
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsPresent()
    @IsString()
    comment: string;

    @IsPresent()
    @IsDateString()
    reviewDate: string;

    @IsOptional()
    @IsString()
    bookId?: string;

    @IsOptional()
    @IsString()
    readerId?: string;
}