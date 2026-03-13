import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray } from 'class-validator';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';

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
    expiryDate: Date;
}