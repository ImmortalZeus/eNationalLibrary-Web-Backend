import { ReadingCardService } from './reading-card.service';
import { ReadingCardController } from './reading-card.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReadingCard, ReadingCardSchema } from './reading-card.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: ReadingCard.name, schema: ReadingCardSchema }])],
    controllers: [ReadingCardController,],
    providers: [ReadingCardService,],
    exports: [ReadingCardService]
})
export class ReadingCardModule { }
