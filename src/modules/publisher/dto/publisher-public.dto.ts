import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';
import { Book } from 'src/modules/book/book.entity';
import { BookPublicDto } from 'src/modules/book/dto/book-public.dto';

export class PublisherPublicDto {
    @Expose()
    publisherId: string;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    books?: BookPublicDto[];
}