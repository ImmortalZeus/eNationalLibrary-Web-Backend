import { ConflictException, Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ReturnRecord } from './return-record.entity';
import { ReturnRecordPublicDto } from './dto/return-record-public.dto';
import { CreateReturnRecordDto } from './dto/create-return-record.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateReturnRecordDto } from './dto/update-return-record.dto';
import { ReturnRecordMapper } from './return-record.mapper';
import { ReaderService } from '../reader/reader.service';
import { BookService } from '../book/book.service';

@Injectable()
export class ReturnRecordService {
    constructor(
    @InjectRepository(ReturnRecord)
    private readonly returnRecordRepo: Repository<ReturnRecord>,

    @Inject(forwardRef(() => ReaderService))
    private readonly readerService: ReaderService,

    @Inject(forwardRef(() => BookService))
    private readonly bookService: BookService,
    ) {}

    async create(dto: CreateReturnRecordDto): Promise<ReturnRecord> {
        const returnRecord = await ReturnRecordMapper.createFromDto(dto);

        if(dto.readerId) {
            const reader = await this.readerService.findOneById(dto.readerId, []);
            if(reader) {
                returnRecord.reader = reader;
            } else {
                throw new NotFoundException(`Reader with id ${dto.readerId} not found`);
            }
        }

        if(dto.bookId) {
            const book = await this.bookService.findOneById(dto.bookId, []);
            if(book) {
                returnRecord.book = book;
            } else {
                throw new NotFoundException(`Book with id ${dto.bookId} not found`);
            }
        }

        const saved = await this.save(returnRecord);
        
        return saved;
    }

    async findOneById(returnRecordId: string | { returnRecordId: string }, relations: string[]): Promise<ReturnRecord | null> {
        const options = typeof returnRecordId === "string" ? { returnRecordId: returnRecordId } : { returnRecordId: returnRecordId.returnRecordId };
        return this.findOneByOptions(options, relations);
    }

    async findOneByOptions(options: FindOptionsWhere<ReturnRecord>, relations: string[]): Promise<ReturnRecord | null> {
        const returnRecord = await this.returnRecordRepo.findOne({ where: options, relations: relations });
        if(!returnRecord) return null;
        return returnRecord;
    }
    
    async findManyByOptions(options: FindOptionsWhere<ReturnRecord>, relations: string[]): Promise<ReturnRecord[]> {
        const returnRecords = await this.returnRecordRepo.find({ where: options, relations: relations });
        return returnRecords;
    }

    async findAll(relations: string[]): Promise<ReturnRecord[]> {
        return this.findManyByOptions({}, relations);
    }

    async updateOneById(returnRecordId: string | { returnRecordId: string }, dto: UpdateReturnRecordDto): Promise<boolean> {
        const options = typeof returnRecordId === "string" ? { returnRecordId: returnRecordId } : { returnRecordId: returnRecordId.returnRecordId };
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<ReturnRecord>, dto: UpdateReturnRecordDto): Promise<boolean> {
        const returnRecord = await this.findOneByOptions(options, []);
        if(!returnRecord) return false;

        await ReturnRecordMapper.updateFromDto(returnRecord, dto);
        
        const saved = await this.save(returnRecord);

        return true
    }

    async updateManyByOptions(options: FindOptionsWhere<ReturnRecord>, dto: UpdateReturnRecordDto): Promise<boolean> {
        const returnRecords = await this.findManyByOptions(options, []);
        
        for (const returnRecord of returnRecords) {
            await ReturnRecordMapper.updateFromDto(returnRecord, dto);
            await this.save(returnRecord);
        }

        return true
    }

    async removeOneById(returnRecordId: string | { returnRecordId: string }): Promise<boolean> {
        const options = typeof returnRecordId === "string" ? { returnRecordId: returnRecordId } : { returnRecordId: returnRecordId.returnRecordId };
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<ReturnRecord>): Promise<boolean> {
        const returnRecord = await this.findOneByOptions(options, []);
        if (!returnRecord) return false;
        await this.remove(returnRecord);
        return true;
    }

    async removeManyByOptions(options: FindOptionsWhere<ReturnRecord>): Promise<boolean> {
        const returnRecords = await this.findManyByOptions(options, []);
        await this.removeMany(returnRecords);
        return true;
    }

    async save(returnRecord: ReturnRecord): Promise<ReturnRecord> {
        return await this.returnRecordRepo.save(returnRecord);
    }

    async remove(returnRecord: ReturnRecord): Promise<ReturnRecord> {
        return await this.returnRecordRepo.remove(returnRecord);
    }

    async removeMany(returnRecords: ReturnRecord[]): Promise<ReturnRecord[]> {
        return await this.returnRecordRepo.remove(returnRecords);
    }

}