import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ReadingCard } from './reading-card.entity';
import { ReadingCardPublicDto } from './dto/reading-card-public.dto';
import { CreateReadingCardDto } from './dto/create-reading-card.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateReadingCardDto } from './dto/update-reading-card.dto';
import { ReadingCardMapper } from './reading-card.mapper';

@Injectable()
export class ReadingCardService {
    constructor(
        @InjectRepository(ReadingCard)
        private readonly readingCardRepo: Repository<ReadingCard>,
    ) {}

    async create(dto: CreateReadingCardDto): Promise<ReadingCardPublicDto> {
        const existing = await this.readingCardRepo.findOneBy({ readingCardId: dto.readingCardId });
        if (existing) {
            throw new ConflictException('readingCardId already exists');
        }
        
        const readingCard = ReadingCardMapper.createFromDto(dto);
        
        const saved = await this.readingCardRepo.save(readingCard);
        
        return ReadingCardMapper.toReadingCardPublicDto(saved);
    }

    async findOneById(readingCardId: string | { readingCardId: string }): Promise<ReadingCardPublicDto | null> {
        const options = typeof readingCardId === "string" ? { readingCardId: readingCardId } : readingCardId;
        return this.findOneByOptions(options);
    }

    async findOneByOptions(options: FindOptionsWhere<ReadingCard>): Promise<ReadingCardPublicDto | null> {
        const readingCard = await this.readingCardRepo.findOne({ where: options });
        if(!readingCard) return null;
        return ReadingCardMapper.toReadingCardPublicDto(readingCard);
    }

    async findManyByOptions(options: FindOptionsWhere<ReadingCard>): Promise<ReadingCardPublicDto[]> {
        const readingCards = await this.readingCardRepo.find({ where: options });
        return readingCards.map(readingCard => ReadingCardMapper.toReadingCardPublicDto(readingCard));
    }

    async findAll(): Promise<ReadingCardPublicDto[]> {
        return this.findManyByOptions({});
    }

    async updateOneById(readingCardId: string | { readingCardId: string }, dto: UpdateReadingCardDto): Promise<ReadingCardPublicDto | null> {
        const options = typeof readingCardId === "string" ? { readingCardId: readingCardId } : readingCardId;
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<ReadingCard>, dto: UpdateReadingCardDto): Promise<ReadingCardPublicDto | null> {
        const readingCard = await this.readingCardRepo.findOne({ where: options });
        if(!readingCard) return null;

        ReadingCardMapper.updateFromDto(readingCard, dto);
        
        const saved = await this.readingCardRepo.save(readingCard);

        return ReadingCardMapper.toReadingCardPublicDto(saved);
    }

    async updateManyByOptions(options: FindOptionsWhere<ReadingCard>, dto: UpdateReadingCardDto): Promise<ReadingCardPublicDto[]> {
        const readingCards = await this.readingCardRepo.find({ where: options });
        
        for (const readingCard of readingCards) {
            ReadingCardMapper.updateFromDto(readingCard, dto);
            await this.readingCardRepo.save(readingCard);
        }

        return readingCards.map(readingCard => ReadingCardMapper.toReadingCardPublicDto(readingCard));
    }

    async removeOneById(readingCardId: string | { readingCardId: string }): Promise<ReadingCardPublicDto | null> {
        const options = typeof readingCardId === "string" ? { readingCardId: readingCardId } : readingCardId;
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<ReadingCard>): Promise<ReadingCardPublicDto | null> {
        const readingCard = await this.readingCardRepo.findOne({ where: options });
        if (!readingCard) return null;
        await this.readingCardRepo.remove(readingCard);
        return ReadingCardMapper.toReadingCardPublicDto(readingCard);
    }

    async removeManyByOptions(options: FindOptionsWhere<ReadingCard>): Promise<ReadingCardPublicDto[]> {
        const readingCards = await this.readingCardRepo.find({ where: options });
        await this.readingCardRepo.remove(readingCards);
        return readingCards.map(readingCard => ReadingCardMapper.toReadingCardPublicDto(readingCard));
    }
}