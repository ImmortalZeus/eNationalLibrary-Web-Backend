import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Reader } from './reader.entity';
import { ReaderPublicDto } from './dto/reader-public.dto';
import { CreateReaderDto } from './dto/create-reader.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { ReaderMapper } from './reader.mapper';
import { UserService } from '../user/user.service';

@Injectable()
export class ReaderService {
    constructor(
        @InjectRepository(Reader)
        private readonly readerRepo: Repository<Reader>,
        private readonly userService: UserService,
    ) {}

    async create(dto: CreateReaderDto): Promise<ReaderPublicDto> {
        const existing = await this.readerRepo.findOneBy({ userId: dto.userId });
        if (existing) {
            throw new ConflictException('userId already exists');
        }

        const reader = ReaderMapper.createFromDto(dto);

        if(reader.user) {
            const userPublicDto = await this.userService.create(reader.user);
        }

        const saved = await this.readerRepo.save(reader);

        return ReaderMapper.toReaderPublicDto(saved);
    }

    async findOneById(userId: string | { userId: string }): Promise<ReaderPublicDto | null> {
        const options = typeof userId === "string" ? { userId: userId } : userId;
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

    async updateOneById(userId: string | { userId: string }, dto: UpdateReaderDto): Promise<ReaderPublicDto | null> {
        const options = typeof userId === "string" ? { userId: userId } : userId;
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<Reader>, dto: UpdateReaderDto): Promise<ReaderPublicDto | null> {
        const reader = await this.readerRepo.findOne({ where: options });
        if(!reader) return null;

        ReaderMapper.updateFromDto(reader, dto);
        
        if(reader.user) {
            const userPublicDto = await this.userService.updateOneByOptions({ userId: reader.user.userId }, reader.user);
        }

        const saved = await this.readerRepo.save(reader);

        return ReaderMapper.toReaderPublicDto(saved);
    }

    async updateManyByOptions(options: FindOptionsWhere<Reader>, dto: UpdateReaderDto): Promise<ReaderPublicDto[]> {
        const readers = await this.readerRepo.find({ where: options });

        for (const reader of readers) {
            ReaderMapper.updateFromDto(reader, dto);

            if (reader.user) {
                const userPublicDto = await this.userService.updateOneByOptions({ userId: reader.user.userId }, reader.user);
            }

            await this.readerRepo.save(reader);
        }

        return readers.map(reader => ReaderMapper.toReaderPublicDto(reader));
    }

    async removeOneById(userId: string | { userId: string }): Promise<ReaderPublicDto | null> {
        const options = typeof userId === "string" ? { userId: userId } : userId;
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<Reader>): Promise<ReaderPublicDto | null> {
        const reader = await this.readerRepo.findOne({ where: options });
        if (!reader) return null;
        await this.readerRepo.remove(reader);
        if (reader.user) {
            const userPublicDto = await this.userService.removeOneByOptions({ userId: reader.user.userId });
        }
        return ReaderMapper.toReaderPublicDto(reader);
    }

    async removeManyByOptions(options: FindOptionsWhere<Reader>): Promise<ReaderPublicDto[]> {
        const readers = await this.readerRepo.find({ where: options });
        await this.readerRepo.remove(readers);
        for (const reader of readers) {
            if (reader.user) {
                const userPublicDto = await this.userService.removeOneByOptions({ userId: reader.user.userId });
            }
        }
        return readers.map(reader => ReaderMapper.toReaderPublicDto(reader));
    }

    async addReadingCardId(userId: string | { userId: string }, readingCardId: string): Promise<ReaderPublicDto | null> {
        const options = typeof userId === "string" ? { userId: userId } : userId;

        const reader = await this.readerRepo.findOne({ where: options });
        if (!reader) return null;

        reader.readingCardIds = [...reader.readingCardIds, readingCardId];
        const saved = await this.readerRepo.save(reader);

        return ReaderMapper.toReaderPublicDto(saved);
    }

    async removeReadingCardId(userId: string | { userId: string }, readingCardId: string): Promise<ReaderPublicDto | null> {
        const options = typeof userId === "string" ? { userId: userId } : userId;

        const reader = await this.readerRepo.findOne({ where: options });
        if (!reader) return null;

        reader.readingCardIds = reader.readingCardIds.filter(id => id !== readingCardId);
        const saved = await this.readerRepo.save(reader);

        return ReaderMapper.toReaderPublicDto(saved);
    }

    async clearReadingCardIds(userId: string | { userId: string }): Promise<ReaderPublicDto | null> {
        const options = typeof userId === "string" ? { userId: userId } : userId;

        return this.updateOneByOptions(options, { readingCardIds: [] });
    }

    async addBorrowRecordId(userId: string | { userId: string }, borrowRecordId: string): Promise<ReaderPublicDto | null> {
        const options = typeof userId === "string" ? { userId: userId } : userId;

        const reader = await this.readerRepo.findOne({ where: options });
        if (!reader) return null;

        reader.borrowRecordIds = [...reader.borrowRecordIds, borrowRecordId];
        const saved = await this.readerRepo.save(reader);

        return ReaderMapper.toReaderPublicDto(saved);
    }

    async removeBorrowRecordId(userId: string | { userId: string }, borrowRecordId: string): Promise<ReaderPublicDto | null> {
        const options = typeof userId === "string" ? { userId: userId } : userId;
        
        const reader = await this.readerRepo.findOne({ where: options });
        if (!reader) return null;

        reader.borrowRecordIds = reader.borrowRecordIds.filter(id => id !== borrowRecordId);
        const saved = await this.readerRepo.save(reader);

        return ReaderMapper.toReaderPublicDto(saved);
    }

    async clearBorrowRecordIds(userId: string | { userId: string }): Promise<ReaderPublicDto | null> {
        const options = typeof userId === "string" ? { userId: userId } : userId;

        return this.updateOneByOptions(options, { borrowRecordIds: [] });
    }

    
}