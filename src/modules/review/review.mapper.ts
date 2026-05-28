import { plainToInstance } from 'class-transformer';
import { Review } from './review.entity';
import { ReviewPublicDto } from './dto/review-public.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { BookMapper } from '../book/book.mapper';
import { ReaderMapper } from '../reader/reader.mapper';

export class ReviewMapper {
    static createFromDto(dto: CreateReviewDto): Review {
        const review = new Review();
        review.rating     = dto.rating;
        review.comment    = dto.comment;
        review.reviewDate = new Date(dto.reviewDate);
        return review;
    }

    static updateFromDto(review: Review, dto: UpdateReviewDto): Review {
        review.rating     = dto.rating     ?? review.rating;
        review.comment    = dto.comment    ?? review.comment;
        review.reviewDate = dto.reviewDate ? new Date(dto.reviewDate) : review.reviewDate;
        return review;
    }

    static toReviewPublicDto(review: Review): ReviewPublicDto {
        return plainToInstance(ReviewPublicDto, {
            ...review,
            book:   review.book   ? BookMapper.toBookPublicDto(review.book)     : undefined,
            reader: review.reader ? ReaderMapper.toReaderPublicDto(review.reader) : undefined,
        }, { excludeExtraneousValues: true });
    }
}