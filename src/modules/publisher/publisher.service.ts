import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Publisher } from './publisher.entity';
import { PublisherPublicDto } from './dto/publisher-public.dto';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { plainToInstance } from 'class-transformer';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PublisherMapper } from './publisher.mapper';

@Injectable()
export class PublisherService {
    constructor(
        @InjectRepository(Publisher)
        private readonly publisherRepo: Repository<Publisher>,
    ) {}

    async create(dto: CreatePublisherDto): Promise<PublisherPublicDto> {
        const existing = await this.publisherRepo.findOneBy({ publisherId: dto.publisherId });
        if (existing) {
            throw new ConflictException('publisherId already exists');
        }

        const publisher = PublisherMapper.createFromDto(dto);

        const saved = await this.publisherRepo.save(publisher);

        return PublisherMapper.toPublisherPublicDto(saved);
    }

    async findOneById(publisherId: string | { publisherId: string }): Promise<PublisherPublicDto | null> {
        const options = typeof publisherId === "string" ? { publisherId: publisherId } : publisherId;
        return this.findOneByOptions(options);
    }

    async findOneByOptions(options: FindOptionsWhere<Publisher>): Promise<PublisherPublicDto | null> {
        const publisher = await this.publisherRepo.findOne({ where: options });
        if(!publisher) return null;
        return PublisherMapper.toPublisherPublicDto(publisher);
    }

    async findManyByOptions(options: FindOptionsWhere<Publisher>): Promise<PublisherPublicDto[]> {
        const publishers = await this.publisherRepo.find({ where: options });
        return publishers.map(publisher => PublisherMapper.toPublisherPublicDto(publisher));
    }

    async findAll(): Promise<PublisherPublicDto[]> {
        return this.findManyByOptions({});
    }

    async updateOneById(publisherId: string | { publisherId: string }, dto: UpdatePublisherDto): Promise<PublisherPublicDto | null> {
        const options = typeof publisherId === "string" ? { publisherId: publisherId } : publisherId;
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<Publisher>, dto: UpdatePublisherDto): Promise<PublisherPublicDto | null> {
        const publisher = await this.publisherRepo.findOne({ where: options });
        if(!publisher) return null;

        PublisherMapper.updateFromDto(publisher, dto);

        const saved = await this.publisherRepo.save(publisher);

        return PublisherMapper.toPublisherPublicDto(saved);
    }

    async updateManyByOptions(options: FindOptionsWhere<Publisher>, dto: UpdatePublisherDto): Promise<PublisherPublicDto[]> {
        const publishers = await this.publisherRepo.find({ where: options });

        for (const publisher of publishers) {
            PublisherMapper.updateFromDto(publisher, dto);
            await this.publisherRepo.save(publisher);
        }

        return publishers.map(publisher => PublisherMapper.toPublisherPublicDto(publisher));
    }

    async removeOneById(publisherId: string | { publisherId: string }): Promise<PublisherPublicDto | null> {
        const options = typeof publisherId === "string" ? { publisherId: publisherId } : publisherId;
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<Publisher>): Promise<PublisherPublicDto | null> {
        const publisher = await this.publisherRepo.findOne({ where: options });
        if (!publisher) return null;
        await this.publisherRepo.remove(publisher);
        return PublisherMapper.toPublisherPublicDto(publisher);
    }

    async removeManyByOptions(options: FindOptionsWhere<Publisher>): Promise<PublisherPublicDto[]> {
        const publishers = await this.publisherRepo.find({ where: options });
        await this.publisherRepo.remove(publishers);
        return publishers.map(publisher => PublisherMapper.toPublisherPublicDto(publisher));
    }
}