import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray } from 'class-validator';
import { Book } from 'src/modules/book/book.entity';
import { BookPublicDto } from 'src/modules/book/dto/book-public.dto';
import { BorrowRecord } from 'src/modules/borrow-record/borrow-record.entity';
import { BorrowRecordPublicDto } from 'src/modules/borrow-record/dto/borrow-record-public.dto';
import { ReadingCardPublicDto } from 'src/modules/reading-card/dto/reading-card-public.dto';
import { ReadingCard } from 'src/modules/reading-card/reading-card.entity';
import { UserPublicDto } from 'src/modules/user/dto/user-public.dto';

export class ReaderPublicDto {
    @Expose()
    userId: string;

    @Expose()
    address: string | null;

    @Expose()
    user?: UserPublicDto;

    @Expose()
    readingCards?: ReadingCardPublicDto[];

    @Expose()
    borrowRecords?: BorrowRecordPublicDto[];

    @Expose()
    waitingBooks?: BookPublicDto[];
}