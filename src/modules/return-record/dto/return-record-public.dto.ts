import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray } from 'class-validator';
import { Book } from 'src/modules/book/book.entity';
import { BookPublicDto } from 'src/modules/book/dto/book-public.dto';
import { ReaderPublicDto } from 'src/modules/reader/dto/reader-public.dto';
import { Reader } from 'src/modules/reader/reader.entity';

export class ReturnRecordPublicDto {
    @Expose()
    returnRecordId: string;

    @Expose()
    quantity: number;

    @Expose()
    lateFee: number;

    @Expose()
    borrowDate: Date;

    @Expose()
    dueDate: Date;

    @Expose()
    actualReturnDate: Date | null;

    @Expose()
    reader?: ReaderPublicDto;

    @Expose()
    book?: BookPublicDto;
}