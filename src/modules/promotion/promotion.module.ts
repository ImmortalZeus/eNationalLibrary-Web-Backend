import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './promotion.entity';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { ReadingCardModule } from '../reading-card/reading-card.module';
import { ReaderModule } from '../reader/reader.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Promotion]),
        forwardRef(() => ReadingCardModule),
        forwardRef(() => ReaderModule),
    ],
    controllers: [PromotionController],
    providers: [PromotionService],
    exports: [PromotionService]
})
export class PromotionModule {}
