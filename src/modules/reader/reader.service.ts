import { Injectable } from '@nestjs/common';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reader, ReaderDocument } from './reader.schema';
import { BaseService } from 'src/common/base.service';
import { ReaderPublicDto } from './dto/reader-public.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ReaderService extends BaseService<Reader, ReaderPublicDto> {
    constructor(@InjectModel(Reader.name) readerModel: Model<Reader>) {
        super(readerModel, ReaderPublicDto);
    }

    async addReadingCardId(userId: string, readingCardId: string): Promise<ReaderPublicDto | null> {
        // const reader = await this.model.findOne({_id: userId}).exec();
        // if(reader) {
        //     // reader.readingCardIds = reader.readingCardIds ?? [];
        //     reader.readingCardIds.push(readingCardId);
        //     const saved = await reader.save();
        //     return plainToInstance(ReaderPublicDto, saved.toObject(), {
        //         excludeExtraneousValues: true
        //     });
        // }
        // return null;
        const doc = await this.model.findOneAndUpdate(
            {_id: userId},
            { $push: { readingCardIds: readingCardId } },
            { new: true, runValidators: true }
        ).lean().exec();

        return doc
            ? plainToInstance(ReaderPublicDto, doc, { excludeExtraneousValues: true })
            : null;
    }

    async removeReadingCardId(userId: string, readingCardId: string): Promise<ReaderPublicDto | null> {
        // const reader = await this.model.findOne({_id: userId}).exec();
        // if(reader) {
        //     // reader.readingCardIds = reader.readingCardIds ?? [];
        //     reader.readingCardIds = reader.readingCardIds.filter(id => id !== readingCardId);
        //     const saved = await reader.save();
        //     return plainToInstance(ReaderPublicDto, saved.toObject(), {
        //         excludeExtraneousValues: true
        //     });
        // }
        // return null;

        const doc = await this.model.findOneAndUpdate(
            {_id: userId},
            { $pull: { readingCardIds: readingCardId } },
            { new: true, runValidators: true }
        ).lean().exec();

        return doc
            ? plainToInstance(ReaderPublicDto, doc, { excludeExtraneousValues: true })
            : null;
    }

    async addBorrowRecordId(userId: string, borrowRecordId: string): Promise<ReaderPublicDto | null> {
        // const reader = await this.model.findOne({_id: userId}).exec();
        // if(reader) {
        //     // reader.borrowRecordIds = reader.borrowRecordIds ?? [];
        //     reader.borrowRecordIds.push(borrowRecordId);
        //     const saved = await reader.save();
        //     return plainToInstance(ReaderPublicDto, saved.toObject(), {
        //         excludeExtraneousValues: true
        //     });
        // }
        // return null;
        const doc = await this.model.findOneAndUpdate(
            {_id: userId},
            { $push: { borrowRecordIds: borrowRecordId } },
            { new: true, runValidators: true }
        ).lean().exec();

        return doc
            ? plainToInstance(ReaderPublicDto, doc, { excludeExtraneousValues: true })
            : null;
    }

    async removeBorrowRecordId(userId: string, borrowRecordId: string): Promise<ReaderPublicDto | null> {
        // const reader = await this.model.findOne({_id: userId}).exec();
        // if(reader) {
        //     // reader.borrowRecordIds = reader.borrowRecordIds ?? [];
        //     reader.borrowRecordIds = reader.borrowRecordIds.filter(id => id !== borrowRecordId);
        //     const saved = await reader.save();
        //     return plainToInstance(ReaderPublicDto, saved.toObject(), {
        //         excludeExtraneousValues: true
        //     });
        // }
        // return null;
        const doc = await this.model.findOneAndUpdate(
            {_id: userId},
            { $pull: { borrowRecordIds: borrowRecordId } },
            { new: true, runValidators: true }
        ).lean().exec();

        return doc
            ? plainToInstance(ReaderPublicDto, doc, { excludeExtraneousValues: true })
            : null;
    }
}