import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';
import { Book } from 'src/modules/book/book.entity';
import { BookPublicDto } from 'src/modules/book/dto/book-public.dto';

export class AuthorPublicDto {
    @Expose()
    authorId: string;

    @Expose()
    name: string;

    @Expose()
    dateOfBirth: Date;

    @Expose()
    dateOfDeath: Date | null;

    @Expose()
    description: string;

    @Expose()
    books?: BookPublicDto[];
}