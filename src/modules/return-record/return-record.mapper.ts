import { ReturnRecord } from './return-record.entity';
import { ReturnRecordPublicDto } from './dto/return-record-public.dto';
import { UpdateReturnRecordDto } from './dto/update-return-record.dto';
import { CreateReturnRecordDto } from './dto/create-return-record.dto';
import { plainToInstance } from 'class-transformer';
import { BookMapper } from '../book/book.mapper';
import { ReaderMapper } from '../reader/reader.mapper';

export class ReturnRecordMapper {
    // eslint-disable-next-line @typescript-eslint/require-await
    static async createFromDto(dto: CreateReturnRecordDto): Promise<ReturnRecord> {
        const returnRecord = new ReturnRecord();

        returnRecord.quantity = dto.quantity;
        returnRecord.borrowDate = new Date(dto.borrowDate);
        returnRecord.dueDate = new Date(dto.dueDate);
        returnRecord.actualReturnDate = new Date(dto.actualReturnDate);

        return returnRecord;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    static async updateFromDto(returnRecord: ReturnRecord, dto: UpdateReturnRecordDto): Promise<ReturnRecord> {
        returnRecord.quantity = dto.quantity ? dto.quantity : returnRecord.quantity;
        returnRecord.borrowDate = dto.borrowDate ? new Date(dto.borrowDate) : returnRecord.borrowDate;
        returnRecord.dueDate = dto.dueDate ? new Date(dto.dueDate) : returnRecord.dueDate;
        returnRecord.actualReturnDate = dto.actualReturnDate ? new Date(dto.actualReturnDate) : returnRecord.actualReturnDate;

        return returnRecord;
    }

    static toReturnRecordPublicDto(returnRecord: ReturnRecord): ReturnRecordPublicDto {
        return plainToInstance(ReturnRecordPublicDto, {
                ...returnRecord,
                reader: returnRecord.reader ? ReaderMapper.toReaderPublicDto(returnRecord.reader) : undefined,
                book: returnRecord.book ? BookMapper.toBookPublicDto(returnRecord.book) : undefined,
            }, {
            excludeExtraneousValues: true,
        });
    }
}