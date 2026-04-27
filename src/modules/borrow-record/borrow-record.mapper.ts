import { BorrowRecord } from './borrow-record.entity';
import { BorrowRecordPublicDto } from './dto/borrow-record-public.dto';
import { UpdateBorrowRecordDto } from './dto/update-borrow-record.dto';
import { CreateBorrowRecordDto } from './dto/create-borrow-record.dto';
import { plainToInstance } from 'class-transformer';
import { BookMapper } from '../book/book.mapper';
import { ReaderMapper } from '../reader/reader.mapper';

export class BorrowRecordMapper {
    // eslint-disable-next-line @typescript-eslint/require-await
    static async createFromDto(dto: CreateBorrowRecordDto): Promise<BorrowRecord> {
        const borrowRecord = new BorrowRecord();

        borrowRecord.quantity = dto.quantity;
        borrowRecord.borrowDate = new Date(dto.borrowDate);
        borrowRecord.dueDate = new Date(dto.dueDate);
        borrowRecord.actualReturnDate = dto.actualReturnDate ? new Date(dto.actualReturnDate) : null;

        return borrowRecord;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    static async updateFromDto(borrowRecord: BorrowRecord, dto: UpdateBorrowRecordDto): Promise<BorrowRecord> {
        borrowRecord.quantity = dto.quantity ? dto.quantity : borrowRecord.quantity;
        borrowRecord.borrowDate = dto.borrowDate ? new Date(dto.borrowDate) : borrowRecord.borrowDate;
        borrowRecord.dueDate = dto.dueDate ? new Date(dto.dueDate) : borrowRecord.dueDate;
        borrowRecord.actualReturnDate = dto.actualReturnDate === null ? null : (!dto.actualReturnDate ? borrowRecord.actualReturnDate : new Date(dto.actualReturnDate));

        return borrowRecord;
    }

    static toBorrowRecordPublicDto(borrowRecord: BorrowRecord): BorrowRecordPublicDto {
        return plainToInstance(BorrowRecordPublicDto, {
                ...borrowRecord,
                reader: borrowRecord.reader ? ReaderMapper.toReaderPublicDto(borrowRecord.reader) : undefined,
                book: borrowRecord.book ? BookMapper.toBookPublicDto(borrowRecord.book) : undefined,
            }, {
            excludeExtraneousValues: true,
        });
    }
}