import { User } from '../user/user.entity';
import { Reader } from './reader.entity';
import { ReaderPublicDto } from './dto/reader-public.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UserPublicDto } from '../user/dto/user-public.dto';
import { plainToInstance } from 'class-transformer';
import { UserMapper } from '../user/user.mapper';
import { ReadingCardMapper } from '../reading-card/reading-card.mapper';
import { BorrowRecordMapper } from '../borrow-record/borrow-record.mapper';
import { BookMapper } from '../book/book.mapper';

export class ReaderMapper {
    // eslint-disable-next-line @typescript-eslint/require-await
    static async createFromDto(dto: CreateReaderDto): Promise<Reader> {
        const reader = new Reader();

        reader.address = dto.address ? dto.address : null;
        reader.readingCards = [];
        reader.borrowRecords = [];
        reader.waitingBooks = [];

        return reader;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    static async updateFromDto(reader: Reader, dto: UpdateReaderDto): Promise<Reader> {
        reader.address = dto.address === null ? null : (!dto.address ? reader.address : dto.address);

        return reader;
    }

    static toReaderPublicDto(reader: Reader): ReaderPublicDto {
        return plainToInstance(ReaderPublicDto, {
                ...reader,
                user: reader.user ? UserMapper.toUserPublicDto(reader.user) : undefined,
                readingCards: reader.readingCards ? reader.readingCards.map(rc => ReadingCardMapper.toReadingCardPublicDto(rc)) : undefined,
                borrowRecords: reader.borrowRecords ? reader.borrowRecords.map(br => BorrowRecordMapper.toBorrowRecordPublicDto(br)) : undefined,
                waitingBooks: reader.waitingBooks ? reader.waitingBooks.map(b => BookMapper.toBookPublicDto(b)) : undefined,
            }, {
            excludeExtraneousValues: true,
        });
    }
}
