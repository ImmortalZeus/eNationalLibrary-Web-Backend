import { Injectable } from '@nestjs/common';
import { CreateReadingCardDto } from './dto/create-reading-card.dto';
import { UpdateReadingCardDto } from './dto/update-reading-card.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReadingCard, ReadingCardDocument } from './reading-card.schema';
import { BaseService } from 'src/common/base.service';
import { ReadingCardPublicDto } from './dto/reading-card-public.dto';

@Injectable()
export class ReadingCardService extends BaseService<ReadingCard, ReadingCardPublicDto> {
    constructor(@InjectModel(ReadingCard.name) readingCardModel: Model<ReadingCard>) {
        super(readingCardModel, ReadingCardPublicDto);
    }
}