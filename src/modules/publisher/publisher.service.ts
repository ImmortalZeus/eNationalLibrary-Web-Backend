import { ConflictException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Publisher } from './publisher.entity';
import { PublisherPublicDto } from './dto/publisher-public.dto';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { plainToInstance } from 'class-transformer';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PublisherMapper } from './publisher.mapper';
import { BookService } from '../book/book.service';

@Injectable()
export class PublisherService {
    constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepo: Repository<Publisher>,

    @Inject(forwardRef(() => BookService))
    private readonly bookService: BookService,
    ) {}

    async create(dto: CreatePublisherDto): Promise<Publisher> {
        const publisher = await PublisherMapper.createFromDto(dto);

        const saved = await this.save(publisher);

        return saved;
    }

    async findOneById(publisherId: string | { publisherId: string }, relations: string[]): Promise<Publisher | null> {
        const options = typeof publisherId === "string" ? { publisherId: publisherId } : { publisherId: publisherId.publisherId };
        return this.findOneByOptions(options, relations);
    }

    async findOneByOptions(options: FindOptionsWhere<Publisher>, relations: string[]): Promise<Publisher | null> {
        const publisher = await this.publisherRepo.findOne({ where: options, relations: relations });
        if(!publisher) return null;
        return publisher;
    }

    async findManyByOptions(options: FindOptionsWhere<Publisher>, relations: string[]): Promise<Publisher[]> {
        const publishers = await this.publisherRepo.find({ where: options, relations: relations });
        return publishers;
    }

    async findAll(relations: string[]): Promise<Publisher[]> {
        return this.findManyByOptions({}, relations);
    }

    async updateOneById(publisherId: string | { publisherId: string }, dto: UpdatePublisherDto): Promise<boolean> {
        const options = typeof publisherId === "string" ? { publisherId: publisherId } : { publisherId: publisherId.publisherId };
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<Publisher>, dto: UpdatePublisherDto): Promise<boolean> {
        const publisher = await this.findOneByOptions(options, []);
        if(!publisher) return false;

        await PublisherMapper.updateFromDto(publisher, dto);

        const saved = await this.save(publisher);

        return true
    }

    async updateManyByOptions(options: FindOptionsWhere<Publisher>, dto: UpdatePublisherDto): Promise<boolean> {
        const publishers = await this.findManyByOptions(options, []);

        for (const publisher of publishers) {
            await PublisherMapper.updateFromDto(publisher, dto);
            await this.save(publisher);
        }

        return true;
    }

    async removeOneById(publisherId: string | { publisherId: string }): Promise<boolean> {
        const options = typeof publisherId === "string" ? { publisherId: publisherId } : { publisherId: publisherId.publisherId };
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<Publisher>): Promise<boolean> {
        const publisher = await this.findOneByOptions(options, []);
        if (!publisher) return false;
        await this.remove(publisher);
        return true;
    }

    async removeManyByOptions(options: FindOptionsWhere<Publisher>): Promise<boolean> {
        const publishers = await this.findManyByOptions(options, []);
        await this.removeMany(publishers);
        return true;
    }

    async save(publisher: Publisher): Promise<Publisher> {
        return await this.publisherRepo.save(publisher);
    }

    async remove(publisher: Publisher): Promise<Publisher> {
        return await this.publisherRepo.remove(publisher);
    }

    async removeMany(publishers: Publisher[]): Promise<Publisher[]> {
        return await this.publisherRepo.remove(publishers);
    }

    async addBook(publisherId: string | { publisherId: string }, bookId: string | { bookId: string }): Promise<boolean> {
        const publisherOptions = typeof publisherId === "string" ? { publisherId: publisherId } : { publisherId: publisherId.publisherId };
        const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };

        const publisher = await this.findOneByOptions(publisherOptions, ['books']);
        if (!publisher) return false;

        const book = await this.bookService.findOneByOptions(bookOptions, []);
        if(!book) return false;

        // if(book.publisher && book.publisher.publisherId !== publisher.publisherId) return null;

        if(!(book.publishers.find(a => a.publisherId === publisher.publisherId)))
        {
            book.publishers.push(publisher);
            const saved = await this.bookService.save(book);
        }

        return true;
    }

    async removeBook(publisherId: string | { publisherId: string }, bookId: string | { bookId: string }): Promise<boolean> {
        const publisherOptions = typeof publisherId === "string" ? { publisherId: publisherId } : { publisherId: publisherId.publisherId };
        const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };

        const book = await this.bookService.findOneByOptions(bookOptions, ['publishers']);
        if(!book) return false;
        
        const indexToRemove = book.publishers.findIndex(item => item.publisherId === publisherOptions.publisherId);
        if (indexToRemove !== -1) {
            book.publishers.splice(indexToRemove, 1);
        }

        const saved = await this.bookService.save(book);

        return true;
    }

    async clearBooks(publisherId: string | { publisherId: string }): Promise<boolean> {
        const publisherOptions = typeof publisherId === "string" ? { publisherId: publisherId } : { publisherId: publisherId.publisherId };

        const publisher = await this.findOneByOptions(publisherOptions, ['books']);
        if (!publisher) return false;

        publisher.books = [];

        const saved = await this.save(publisher);

        return true;
    }
}