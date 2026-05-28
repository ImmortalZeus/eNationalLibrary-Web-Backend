import { Body, Controller, Param, Get, Post, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './review.service';
import { ReviewPublicDto } from './dto/review-public.dto';
import { ReviewMapper } from './review.mapper';
import { ParseRelationsPipe } from 'src/common/queryPipes/parseRelations.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post()
    async create(@Body() createReviewDto: CreateReviewDto): Promise<string> {
        const review = await this.reviewService.create(createReviewDto);
        return review.reviewId;
    }

    @Get()
    async findAll(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<ReviewPublicDto[]> {
        const reviews = await this.reviewService.findAll(relations);
        return reviews.map(r => ReviewMapper.toReviewPublicDto(r));
    }

    @Get(':id')
    async findOneById(
        @Param('id') id: string,
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<ReviewPublicDto | null> {
        const review = await this.reviewService.findOneById(id, relations);
        return review ? ReviewMapper.toReviewPublicDto(review) : null;
    }

    @Put(':id')
    async updateOneById(
        @Param('id') id: string,
        @Body() updateReviewDto: UpdateReviewDto
    ): Promise<boolean> {
        return await this.reviewService.updateOneById(id, updateReviewDto);
    }

    @Delete(':id')
    async removeOneById(@Param('id') id: string): Promise<boolean> {
        return await this.reviewService.removeOneById(id);
    }
}