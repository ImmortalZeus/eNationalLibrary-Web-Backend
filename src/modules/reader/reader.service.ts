import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Reader } from './reader.entity';
import { ReaderPublicDto } from './dto/reader-public.dto';
import { CreateReaderDto } from './dto/create-reader.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { ReaderMapper } from './reader.mapper';
import { User } from '../user/user.entity';

@Injectable()
export class ReaderService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Reader)
        private readonly readerRepo: Repository<Reader>,
    ) {}

    async create(dto: CreateReaderDto): Promise<ReaderPublicDto> {
        const existing = await this.readerRepo.findOneBy({ userId: dto.userId });
        if (existing) {
            throw new ConflictException('userId already exists');
        }

        const reader = ReaderMapper.createFromDto(dto);
       
        if(reader.user) {
            await this.userRepo.save(reader.user);
        }

        const saved = await this.readerRepo.save(reader);

        return ReaderMapper.toReaderPublicDto(saved);
    }

    async findOneById(id: string | { userId: string }): Promise<ReaderPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;
        return this.findOneByOptions(options);
    }

    async findOneByOptions(options: FindOptionsWhere<Reader>): Promise<ReaderPublicDto | null> {
        const reader = await this.readerRepo.findOne({ where: options });
        if(!reader) return null;
        return ReaderMapper.toReaderPublicDto(reader);
    }

    async findManyByOptions(options: FindOptionsWhere<Reader>): Promise<ReaderPublicDto[]> {
        const readers = await this.readerRepo.find({ where: options });
        return readers.map(reader => ReaderMapper.toReaderPublicDto(reader));
    }

    async findAll(): Promise<ReaderPublicDto[]> {
        return this.findManyByOptions({});
    }

    async updateOneById(id: string | { userId: string }, dto: UpdateReaderDto): Promise<ReaderPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<Reader>, dto: UpdateReaderDto): Promise<ReaderPublicDto | null> {
        const reader = await this.readerRepo.findOne({ where: options });
        if(!reader) return null;

        ReaderMapper.updateFromDto(reader, dto);
        
        if(reader.user) {
            await this.userRepo.save(reader.user);
        }

        const saved = await this.readerRepo.save(reader);

        return ReaderMapper.toReaderPublicDto(saved);
    }

    async updateManyByOptions(options: FindOptionsWhere<Reader>, dto: UpdateReaderDto): Promise<ReaderPublicDto[]> {
        const readers = await this.readerRepo.find({ where: options });

        for (const reader of readers) {
            ReaderMapper.updateFromDto(reader, dto);

            if (reader.user) {
                await this.userRepo.save(reader.user);
            }
            await this.readerRepo.save(reader);
        }

        return readers.map(reader => ReaderMapper.toReaderPublicDto(reader));
    }

    async removeOneById(id: string | { userId: string }): Promise<ReaderPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<Reader>): Promise<ReaderPublicDto | null> {
        const reader = await this.readerRepo.findOne({ where: options });
        if (!reader) return null;
        await this.readerRepo.remove(reader);
        return ReaderMapper.toReaderPublicDto(reader);
    }

    async removeManyByOptions(options: FindOptionsWhere<Reader>): Promise<ReaderPublicDto[]> {
        const readers = await this.readerRepo.find({ where: options });
        await this.readerRepo.remove(readers);
        return readers.map(reader => ReaderMapper.toReaderPublicDto(reader));
    }

    async addReadingCardId(id: string | { userId: string }, readingCardId: string): Promise<ReaderPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;

        const reader = await this.readerRepo.findOne({ where: options });
        if (!reader) return null;

        reader.readingCardIds = [...reader.readingCardIds, readingCardId];
        const saved = await this.readerRepo.save(reader);

        return ReaderMapper.toReaderPublicDto(saved);
    }

    async removeReadingCardId(id: string | { userId: string }, readingCardId: string): Promise<ReaderPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;

        const reader = await this.readerRepo.findOne({ where: options });
        if (!reader) return null;

        reader.readingCardIds = reader.readingCardIds.filter(id => id !== readingCardId);
        const saved = await this.readerRepo.save(reader);

        return ReaderMapper.toReaderPublicDto(saved);
    }

    async addBorrowRecordId(id: string | { userId: string }, borrowRecordId: string): Promise<ReaderPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;

        const reader = await this.readerRepo.findOne({ where: options });
        if (!reader) return null;

        reader.borrowRecordIds = [...reader.borrowRecordIds, borrowRecordId];
        const saved = await this.readerRepo.save(reader);

        return ReaderMapper.toReaderPublicDto(saved);
    }

    async removeBorrowRecordId(id: string | { userId: string }, borrowRecordId: string): Promise<ReaderPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;
        
        const reader = await this.readerRepo.findOne({ where: options });
        if (!reader) return null;

        reader.borrowRecordIds = reader.borrowRecordIds.filter(id => id !== borrowRecordId);
        const saved = await this.readerRepo.save(reader);

        return ReaderMapper.toReaderPublicDto(saved);
    }
}