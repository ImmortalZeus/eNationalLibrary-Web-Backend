import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingCard } from './reading-card.entity';
import { ReadingCardService } from './reading-card.service';
import { ReadingCardController } from './reading-card.controller';
import { ReaderModule } from '../reader/reader.module';
import { PromotionModule } from '../promotion/promotion.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ReadingCard]),
        forwardRef(() => ReaderModule),
        forwardRef(() => PromotionModule),
    ],
    controllers: [ReadingCardController],
    providers: [ReadingCardService],
    exports: [ReadingCardService],
})
export class ReadingCardModule {}