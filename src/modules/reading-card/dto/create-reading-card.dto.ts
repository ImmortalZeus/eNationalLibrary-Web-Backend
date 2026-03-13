import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsDate } from 'class-validator';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';

export class CreateReadingCardDto {
    @IsString()
    readingCardId: string;

    @IsString()
    label: string;

    @IsEnum(ReadingCardType)
    type: ReadingCardType;

    @IsDate()
    activationDate: Date;
    
    @IsDate()
    expiryDate: Date;
}