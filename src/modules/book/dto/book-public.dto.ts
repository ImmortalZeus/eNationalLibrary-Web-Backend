import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';
import { Author } from 'src/modules/author/author.entity';
import { AuthorPublicDto } from 'src/modules/author/dto/author-public.dto';
import { BorrowRecordPublicDto } from 'src/modules/borrow-record/dto/borrow-record-public.dto';
import { GenrePublicDto } from 'src/modules/genre/dto/genre-public.dto';
import { Genre } from 'src/modules/genre/genre.entity';
import { PublisherPublicDto } from 'src/modules/publisher/dto/publisher-public.dto';
import { Publisher } from 'src/modules/publisher/publisher.entity';
import { ReaderPublicDto } from 'src/modules/reader/dto/reader-public.dto';
import { ReviewPublicDto } from 'src/modules/review/dto/review-public.dto';
export class BookPublicDto {
    @Expose()
    bookId: string;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    previewUrl: string;

    @Expose()
    authors?: AuthorPublicDto[];

    @Expose()
    reviews?: ReviewPublicDto[];
    
    @Expose()
    publishers?: PublisherPublicDto[];

    @Expose()
    genres?: GenrePublicDto[];
}