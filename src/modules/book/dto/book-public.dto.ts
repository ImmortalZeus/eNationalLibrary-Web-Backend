import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';

export class BookPublicDto {
    @Expose()
    bookId: string;

    @Expose()
    title: string;

    @Expose()
    authorIds: string[];

    @Expose()
    description: string;

    @Expose()
    publisherId: string;

    @Expose()
    genreIds: string[];

    @Expose()
    previewUrl: string;
}