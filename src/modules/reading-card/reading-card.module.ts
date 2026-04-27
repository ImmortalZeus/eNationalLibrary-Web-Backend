import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingCard } from './reading-card.entity';
import { ReadingCardService } from './reading-card.service';
import { ReadingCardController } from './reading-card.controller'; 
import { ReaderModule } from '../reader/reader.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ReadingCard]),
        ReaderModule,
    ],
    controllers: [ReadingCardController],
    providers: [ReadingCardService],
    exports: [ReadingCardService]
})
export class ReadingCardModule {}
