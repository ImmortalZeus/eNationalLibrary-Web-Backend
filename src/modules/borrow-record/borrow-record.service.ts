import { ConflictException, Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BorrowRecord } from './borrow-record.entity';
import { BorrowRecordPublicDto } from './dto/borrow-record-public.dto';
import { CreateBorrowRecordDto } from './dto/create-borrow-record.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateBorrowRecordDto } from './dto/update-borrow-record.dto';
import { BorrowRecordMapper } from './borrow-record.mapper';
import { ReaderService } from '../reader/reader.service';
import { BookService } from '../book/book.service';

@Injectable()
export class BorrowRecordService {
    constructor(
    @InjectRepository(BorrowRecord)
    private readonly borrowRecordRepo: Repository<BorrowRecord>,

    @Inject(forwardRef(() => ReaderService))
    private readonly readerService: ReaderService,

    @Inject(forwardRef(() => BookService))
    private readonly bookService: BookService,
    ) {}

    async create(dto: CreateBorrowRecordDto): Promise<BorrowRecord> {
        const borrowRecord = await BorrowRecordMapper.createFromDto(dto);
        
        if(dto.readerId) {
            const reader = await this.readerService.findOneById(dto.readerId, []);
            if(reader) {
                borrowRecord.reader = reader;
            } else {
                throw new NotFoundException(`Reader with id ${dto.readerId} not found`);
            }
        }

        if(dto.bookId) {
            const book = await this.bookService.findOneById(dto.bookId, []);
            if(book) {
                borrowRecord.book = book;
            } else {
                throw new NotFoundException(`Book with id ${dto.bookId} not found`);
            }
        }

        const saved = await this.save(borrowRecord);
        
        return saved;
    }

    async findOneById(borrowRecordId: string | { borrowRecordId: string }, relations: string[]): Promise<BorrowRecord | null> {
        const options = typeof borrowRecordId === "string" ? { borrowRecordId: borrowRecordId } : { borrowRecordId: borrowRecordId.borrowRecordId };
        return this.findOneByOptions(options, relations);
    }

    async findOneByOptions(options: FindOptionsWhere<BorrowRecord>, relations: string[]): Promise<BorrowRecord | null> {
        const borrowRecord = await this.borrowRecordRepo.findOne({ where: options, relations: relations });
        if(!borrowRecord) return null;
        return borrowRecord;
    }

    async findManyByOptions(options: FindOptionsWhere<BorrowRecord>, relations: string[]): Promise<BorrowRecord[]> {
        const borrowRecords = await this.borrowRecordRepo.find({ where: options, relations: relations });
        return borrowRecords;
    }

    async findAll(relations: string[]): Promise<BorrowRecord[]> {
        return this.findManyByOptions({}, relations);
    }

    async updateOneById(borrowRecordId: string | { borrowRecordId: string }, dto: UpdateBorrowRecordDto): Promise<boolean> {
        const options = typeof borrowRecordId === "string" ? { borrowRecordId: borrowRecordId } : { borrowRecordId: borrowRecordId.borrowRecordId };
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<BorrowRecord>, dto: UpdateBorrowRecordDto): Promise<boolean> {
        const borrowRecord = await this.findOneByOptions(options, []);
        if(!borrowRecord) return false;

        await BorrowRecordMapper.updateFromDto(borrowRecord, dto);
        
        const saved = await this.save(borrowRecord);

        return true
    }

    async updateManyByOptions(options: FindOptionsWhere<BorrowRecord>, dto: UpdateBorrowRecordDto): Promise<boolean> {
        const borrowRecords = await this.findManyByOptions(options, []);
        
        for (const borrowRecord of borrowRecords) {
            await BorrowRecordMapper.updateFromDto(borrowRecord, dto);
            await this.save(borrowRecord);
        }

        return true
    }

    async removeOneById(borrowRecordId: string | { borrowRecordId: string }): Promise<boolean> {
        const options = typeof borrowRecordId === "string" ? { borrowRecordId: borrowRecordId } : { borrowRecordId: borrowRecordId.borrowRecordId };
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<BorrowRecord>): Promise<boolean> {
        const borrowRecord = await this.findOneByOptions(options, []);
        if (!borrowRecord) return false;
        await this.remove(borrowRecord);
        return true;
    }

    async removeManyByOptions(options: FindOptionsWhere<BorrowRecord>): Promise<boolean> {
        const borrowRecords = await this.findManyByOptions(options, []);
        await this.removeMany(borrowRecords);
        return true;
    }

    async save(borrowRecord: BorrowRecord): Promise<BorrowRecord> {
        return await this.borrowRecordRepo.save(borrowRecord);
    }

    async remove(borrowRecord: BorrowRecord): Promise<BorrowRecord> {
        return await this.borrowRecordRepo.remove(borrowRecord);
    }

    async removeMany(borrowRecords: BorrowRecord[]): Promise<BorrowRecord[]> {
        return await this.borrowRecordRepo.remove(borrowRecords);
    }

    // async addBorrowRecordReader(borrowRecordId: string | { borrowRecordId: string }, userId: string | { userId: string }): Promise<BorrowRecord | null> {
    //     const borrowRecordOptions = typeof borrowRecordId === "string" ? { borrowRecordId: borrowRecordId } : { borrowRecordId: borrowRecordId.borrowRecordId };
    //     const readerOptions = typeof userId === "string" ? { userId: userId } : { userId: userId.userId };

    //     const borrowRecord = await this.findOneByOptions(borrowRecordOptions, ['readers']);
    //     if (!borrowRecord) return null;

    //     const reader = await this.readerService.findOneByOptions(readerOptions, []);
    //     if(!reader) return null;

    //     // if(borrowRecord.reader && borrowRecord.reader.userId !== reader.userId) return null;

    //     // gán từ phía owning side
    //     borrowRecord.reader = reader;
    //     const saved = await this.save(borrowRecord);

    //     return await this.findOneByOptions(borrowRecordOptions, ['readers']);
    // }

    // async removeBorrowRecordReader(borrowRecordId: string | { borrowRecordId: string }, userId: string | { userId: string }): Promise<BorrowRecord | null> {
    //     const borrowRecordOptions = typeof borrowRecordId === "string" ? { borrowRecordId: borrowRecordId } : { borrowRecordId: borrowRecordId.borrowRecordId };
    //     const readerOptions = typeof userId === "string" ? { userId: userId } : { userId: userId.userId };

    //     const borrowRecord = await this.findOneByOptions(borrowRecordOptions, ['readers']);
    //     if (!borrowRecord) return null;
        
    //     if(borrowRecord.reader && borrowRecord.reader.userId !== readerOptions.userId) return null;

    //     // xoá quan hệ bằng cách set null hoặc xoá record
    //     borrowRecord.reader = null;
    //     const saved = await this.save(borrowRecord);

    //     return await this.findOneByOptions(borrowRecordOptions, ['readers']);
    // }

    // async addBorrowRecordBook(borrowRecordId: string | { borrowRecordId: string }, bookId: string | { bookId: string }): Promise<BorrowRecord | null> {
    //     const borrowRecordOptions = typeof borrowRecordId === "string" ? { borrowRecordId: borrowRecordId } : { borrowRecordId: borrowRecordId.borrowRecordId };
    //     const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };

    //     const borrowRecord = await this.findOneByOptions(borrowRecordOptions, ['books']);
    //     if (!borrowRecord) return null;

    //     const book = await this.bookService.findOneByOptions(bookOptions, []);
    //     if(!book) return null;

    //     // if(borrowRecord.book && borrowRecord.book.bookId !== bookOptions.bookId) return null;

    //     // gán từ phía owning side
    //     borrowRecord.book = book;
    //     const saved = await this.save(borrowRecord);

    //     return await this.findOneByOptions(borrowRecordOptions, ['books']);
    // }

    // async removeBorrowRecordBook(borrowRecordId: string | { borrowRecordId: string }, bookId: string | { bookId: string }): Promise<BorrowRecord | null> {
    //     const borrowRecordOptions = typeof borrowRecordId === "string" ? { borrowRecordId: borrowRecordId } : { borrowRecordId: borrowRecordId.borrowRecordId };
    //     const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };

    //     const borrowRecord = await this.findOneByOptions(borrowRecordOptions, ['books']);
    //     if (!borrowRecord) return null;
        
    //     if(borrowRecord.book && borrowRecord.book.bookId !== bookOptions.bookId) return null;

    //     // xoá quan hệ bằng cách set null hoặc xoá record
    //     borrowRecord.book = null;
    //     const saved = await this.save(borrowRecord);

    //     return await this.findOneByOptions(borrowRecordOptions, ['books']);
    // }
}