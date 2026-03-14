import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingCard } from './reading-card.entity';
import { ReadingCardService } from './reading-card.service';
import { ReadingCardController } from './reading-card.controller'; 

@Module({
    imports: [TypeOrmModule.forFeature([ReadingCard])],
    controllers: [ReadingCardController],
    providers: [ReadingCardService],
    exports: [ReadingCardService]
})
export class ReadingCardModule {}
