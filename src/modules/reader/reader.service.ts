import { Injectable } from '@nestjs/common';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reader, ReaderDocument } from './reader.schema';
import { BaseService } from 'src/common/base.service';

@Injectable()
export class ReaderService extends BaseService<Reader> {
    constructor(@InjectModel(Reader.name) readerModel: Model<Reader>) {
        super(readerModel);
    }
}