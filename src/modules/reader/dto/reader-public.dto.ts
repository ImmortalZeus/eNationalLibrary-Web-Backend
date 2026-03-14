import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray } from 'class-validator';
import { UserPublicDto } from 'src/modules/user/dto/user-public.dto';

export class ReaderPublicDto extends UserPublicDto {
    @Expose()
    address: string | null;

    @Expose()
    readingCardIds: string[];

    @Expose()
    borrowRecordIds: string[];
}