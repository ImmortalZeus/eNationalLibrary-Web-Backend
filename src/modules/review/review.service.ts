import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewMapper } from './review.mapper';
import { BookService } from '../book/book.service';
import { ReaderService } from '../reader/reader.service';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepo: Repository<Review>,

        @Inject(forwardRef(() => BookService))
        private readonly bookService: BookService,

        @Inject(forwardRef(() => ReaderService))
        private readonly readerService: ReaderService,
    ) {}

    async create(dto: CreateReviewDto): Promise<Review> {
        const review = ReviewMapper.createFromDto(dto);

        if (dto.bookId) {
            const book = await this.bookService.findOneById(dto.bookId, []);
            review.book = book ?? null;
        }

        if (dto.readerId) {
            const reader = await this.readerService.findOneById(dto.readerId, []);
            review.reader = reader ?? null;
        }

        return await this.save(review);
    }

    async findOneById(reviewId: string | { reviewId: string }, relations: string[]): Promise<Review | null> {
        const options = typeof reviewId === "string" ? { reviewId } : { reviewId: reviewId.reviewId };
        return this.findOneByOptions(options, relations);
    }

    async findOneByOptions(options: FindOptionsWhere<Review>, relations: string[]): Promise<Review | null> {
        const review = await this.reviewRepo.findOne({ where: options, relations });
        return review ?? null;
    }

    async findManyByOptions(options: FindOptionsWhere<Review>, relations: string[]): Promise<Review[]> {
        return await this.reviewRepo.find({ where: options, relations });
    }

    async findAll(relations: string[]): Promise<Review[]> {
        return this.findManyByOptions({}, relations);
    }

    async updateOneById(reviewId: string | { reviewId: string }, dto: UpdateReviewDto): Promise<boolean> {
        const options = typeof reviewId === "string" ? { reviewId } : { reviewId: reviewId.reviewId };
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<Review>, dto: UpdateReviewDto): Promise<boolean> {
        const review = await this.findOneByOptions(options, []);
        if (!review) return false;
        ReviewMapper.updateFromDto(review, dto);
        await this.save(review);
        return true;
    }

    async removeOneById(reviewId: string | { reviewId: string }): Promise<boolean> {
        const options = typeof reviewId === "string" ? { reviewId } : { reviewId: reviewId.reviewId };
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<Review>): Promise<boolean> {
        const review = await this.findOneByOptions(options, []);
        if (!review) return false;
        await this.remove(review);
        return true;
    }

    async save(review: Review): Promise<Review> {
        return await this.reviewRepo.save(review);
    }

    async remove(review: Review): Promise<Review> {
        return await this.reviewRepo.remove(review);
    }

    async removeMany(reviews: Review[]): Promise<Review[]> {
        return await this.reviewRepo.remove(reviews);
    }
}