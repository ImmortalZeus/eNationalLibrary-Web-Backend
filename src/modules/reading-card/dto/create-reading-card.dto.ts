import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsDate, IsDefined, IsDateString } from 'class-validator';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';
import { IsDateStringOrNull } from 'src/common/validators/isDateStringOrNull.validator';
import { IsPresent } from 'src/common/validators/isPresent.validator';

export class CreateReadingCardDto {
    @IsPresent()
    @IsString()
    label: string;

    @IsPresent()
    @IsEnum(ReadingCardType)
    type: ReadingCardType;

    @IsPresent()
    @IsDateString()
    activationDate: string;
    
    @IsOptional()
    @IsDateStringOrNull()
    expiryDate?: string | null;

    @IsOptional()
    @IsString()
    readerId: string;
}