import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray } from 'class-validator';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';

export class ReadingCardPublicDto {
    readingCardId: string;

    label: string;

    type: ReadingCardType;

    activationDate: Date;
    
    expiryDate: Date;
}