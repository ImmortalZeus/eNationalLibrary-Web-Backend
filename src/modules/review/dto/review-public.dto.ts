import { Expose } from 'class-transformer';
import { BookPublicDto } from 'src/modules/book/dto/book-public.dto';
import { ReaderPublicDto } from 'src/modules/reader/dto/reader-public.dto';

export class ReviewPublicDto {
    @Expose()
    reviewId: string;

    @Expose()
    rating: number;

    @Expose()
    comment: string;

    @Expose()
    reviewDate: Date;

    @Expose()
    book?: BookPublicDto;

    @Expose()
    reader?: ReaderPublicDto;
}