import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { ReadingCard } from './reading-card.entity';
import { ReadingCardPublicDto } from './dto/reading-card-public.dto';
import { CreateReadingCardDto } from './dto/create-reading-card.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateReadingCardDto } from './dto/update-reading-card.dto';

@Injectable()
export class ReadingCardService {
    constructor(
        @InjectRepository(ReadingCard)
        private readonly readingCardRepo: Repository<ReadingCard>,
    ) {}

    async create(dto: CreateReadingCardDto): Promise<ReadingCardPublicDto> {
        const entity = this.readingCardRepo.create(dto);
        const saved = await this.readingCardRepo.save(entity);
        return plainToInstance(ReadingCardPublicDto, saved, {
            excludeExtraneousValues: true,
        });
    }

    async findOneById(id: string | { readingCardId: string }): Promise<ReadingCardPublicDto | null> {
        const options = typeof id === "string" ? { readingCardId: id } : id;
        return this.findOneByOptions(options);
    }

    async findOneByOptions(options: FindOptionsWhere<ReadingCard>): Promise<ReadingCardPublicDto | null> {
        const entity = await this.readingCardRepo.findOne({ where: options });
        return entity
            ? plainToInstance(ReadingCardPublicDto, entity, { excludeExtraneousValues: true })
            : null;
    }

    async findManyByOptions(options: FindOptionsWhere<ReadingCard>): Promise<ReadingCardPublicDto[]> {
        const entities = await this.readingCardRepo.find({ where: options });
        return plainToInstance(ReadingCardPublicDto, entities, {
            excludeExtraneousValues: true,
        });
    }

    async findAll(): Promise<ReadingCardPublicDto[]> {
        return this.findManyByOptions({});
    }

    async updateOneById(id: string | { readingCardId: string }, dto: UpdateReadingCardDto): Promise<ReadingCardPublicDto | null> {
        const options = typeof id === "string" ? { readingCardId: id } : id;
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<ReadingCard>, dto: UpdateReadingCardDto): Promise<ReadingCardPublicDto | null> {
        await this.readingCardRepo.update(options, dto);
        const updatedEntity = await this.readingCardRepo.findOne({ where: options });
        return updatedEntity
            ? plainToInstance(ReadingCardPublicDto, updatedEntity, { excludeExtraneousValues: true })
            : null;
    }

    async updateManyByOptions(options: FindOptionsWhere<ReadingCard>, dto: UpdateReadingCardDto): Promise<ReadingCardPublicDto[]> {
        await this.readingCardRepo.update(options, dto);
        const updatedEntities = await this.readingCardRepo.find({ where: options });
        return plainToInstance(ReadingCardPublicDto, updatedEntities, { excludeExtraneousValues: true });
    }

    async removeOneById(id: string | { readingCardId: string }): Promise<ReadingCardPublicDto | null> {
        const options = typeof id === "string" ? { readingCardId: id } : id;
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<ReadingCard>): Promise<ReadingCardPublicDto | null> {
        const entity = await this.readingCardRepo.findOne({ where: options });
        if (!entity) return null;
        await this.readingCardRepo.remove(entity);
        return plainToInstance(ReadingCardPublicDto, entity, { excludeExtraneousValues: true });
    }

    async removeManyByOptions(options: FindOptionsWhere<ReadingCard>): Promise<ReadingCardPublicDto[]> {
        const entities = await this.readingCardRepo.find({ where: options });
        await this.readingCardRepo.remove(entities);
        return plainToInstance(ReadingCardPublicDto, entities, { excludeExtraneousValues: true });
    }
}