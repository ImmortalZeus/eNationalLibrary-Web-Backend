import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { BookModule } from '../book/book.module';
import { ReaderModule } from '../reader/reader.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Review]),
        forwardRef(() => BookModule),
        forwardRef(() => ReaderModule),
    ],
    controllers: [ReviewController],
    providers: [ReviewService],
    exports: [ReviewService],
})
export class ReviewModule {}