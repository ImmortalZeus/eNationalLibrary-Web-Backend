import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Book } from './book.entity';
import { BookPublicDto } from './dto/book-public.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookMapper } from './book.mapper';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepo: Repository<Book>,
    ) {}

    async create(dto: CreateBookDto): Promise<BookPublicDto> {
        const existing = await this.bookRepo.findOneBy({ bookId: dto.bookId });
        if (existing) {
            throw new ConflictException('bookId already exists');
        }

        const book = BookMapper.createFromDto(dto);

        const saved = await this.bookRepo.save(book);

        return BookMapper.toBookPublicDto(saved);
    }

    async findOneById(bookId: string | { bookId: string }): Promise<BookPublicDto | null> {
        const options = typeof bookId === "string" ? { bookId: bookId } : bookId;
        return this.findOneByOptions(options);
    }

    async findOneByOptions(options: FindOptionsWhere<Book>): Promise<BookPublicDto | null> {
        const book = await this.bookRepo.findOne({ where: options });
        if(!book) return null;
        return BookMapper.toBookPublicDto(book);
    }

    async findManyByOptions(options: FindOptionsWhere<Book>): Promise<BookPublicDto[]> {
        const books = await this.bookRepo.find({ where: options });
        return books.map(book => BookMapper.toBookPublicDto(book));
    }

    async findAll(): Promise<BookPublicDto[]> {
        return this.findManyByOptions({});
    }

    async updateOneById(bookId: string | { bookId: string }, dto: UpdateBookDto): Promise<BookPublicDto | null> {
        const options = typeof bookId === "string" ? { bookId: bookId } : bookId;
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<Book>, dto: UpdateBookDto): Promise<BookPublicDto | null> {
        const book = await this.bookRepo.findOne({ where: options });
        if(!book) return null;

        BookMapper.updateFromDto(book, dto);

        const saved = await this.bookRepo.save(book);

        return BookMapper.toBookPublicDto(saved);
    }

    async updateManyByOptions(options: FindOptionsWhere<Book>, dto: UpdateBookDto): Promise<BookPublicDto[]> {
        const books = await this.bookRepo.find({ where: options });

        for (const book of books) {
            BookMapper.updateFromDto(book, dto);
            await this.bookRepo.save(book);
        }

        return books.map(book => BookMapper.toBookPublicDto(book));
    }

    async removeOneById(bookId: string | { bookId: string }): Promise<BookPublicDto | null> {
        const options = typeof bookId === "string" ? { bookId: bookId } : bookId;
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<Book>): Promise<BookPublicDto | null> {
        const book = await this.bookRepo.findOne({ where: options });
        if (!book) return null;
        await this.bookRepo.remove(book);
        return BookMapper.toBookPublicDto(book);
    }

    async removeManyByOptions(options: FindOptionsWhere<Book>): Promise<BookPublicDto[]> {
        const books = await this.bookRepo.find({ where: options });
        await this.bookRepo.remove(books);
        return books.map(book => BookMapper.toBookPublicDto(book));
    }

    async addAuthorId(bookId: string | { bookId: string }, authorId: string): Promise<BookPublicDto | null> {
        const options = typeof bookId === "string" ? { bookId: bookId } : bookId;

        const book = await this.bookRepo.findOne({ where: options });
        if (!book) return null;

        book.authorIds = [...book.authorIds, authorId];
        const saved = await this.bookRepo.save(book);

        return BookMapper.toBookPublicDto(saved);
    }

    async removeAuthorId(bookId: string | { bookId: string }, authorId: string): Promise<BookPublicDto | null> {
        const options = typeof bookId === "string" ? { bookId: bookId } : bookId;

        const book = await this.bookRepo.findOne({ where: options });
        if (!book) return null;

        book.authorIds = book.authorIds.filter(id => id !== authorId);
        const saved = await this.bookRepo.save(book);

        return BookMapper.toBookPublicDto(saved);
    }

    async clearAuthorIds(bookId: string | { bookId: string }): Promise<BookPublicDto | null> {
        const options = typeof bookId === "string" ? { bookId: bookId } : bookId;

        return this.updateOneByOptions(options, { authorIds: [] });
    }

    async addCategoryId(bookId: string | { bookId: string }, categoryId: string): Promise<BookPublicDto | null> {
        const options = typeof bookId === "string" ? { bookId: bookId } : bookId;

        const book = await this.bookRepo.findOne({ where: options });
        if (!book) return null;

        book.categoryIds = [...book.categoryIds, categoryId];
        const saved = await this.bookRepo.save(book);

        return BookMapper.toBookPublicDto(saved);
    }

    async removeCategoryId(bookId: string | { bookId: string }, categoryId: string): Promise<BookPublicDto | null> {
        const options = typeof bookId === "string" ? { bookId: bookId } : bookId;

        const book = await this.bookRepo.findOne({ where: options });
        if (!book) return null;

        book.categoryIds = book.categoryIds.filter(id => id !== categoryId);
        const saved = await this.bookRepo.save(book);

        return BookMapper.toBookPublicDto(saved);
    }

    async clearCategoryIds(bookId: string | { bookId: string }): Promise<BookPublicDto | null> {
        const options = typeof bookId === "string" ? { bookId: bookId } : bookId;

        return this.updateOneByOptions(options, { categoryIds: [] });
    }
}