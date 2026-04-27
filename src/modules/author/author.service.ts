import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Author } from './author.entity';
import { AuthorPublicDto } from './dto/author-public.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorMapper } from './author.mapper';
import { BookService } from '../book/book.service';

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(Author)
        private readonly authorRepo: Repository<Author>,
        private readonly bookService: BookService,
    ) {}

    async create(dto: CreateAuthorDto): Promise<Author> {
        const author = await AuthorMapper.createFromDto(dto);

        const saved = await this.save(author);

        // return AuthorMapper.toAuthorPublicDto(saved);
        return saved;
    }

    async findOneById(authorId: string | { authorId: string }, relations: string[]): Promise<Author | null> {
        const options = typeof authorId === "string" ? { authorId: authorId } : { authorId: authorId.authorId };
        return this.findOneByOptions(options, relations);
    }

    async findOneByOptions(options: FindOptionsWhere<Author>, relations: string[]): Promise<Author | null> {
        const author = await this.authorRepo.findOne({ where: options, relations: relations });
        if(!author) return null;
        // return AuthorMapper.toAuthorPublicDto(author);
        return author;
    }

    async findManyByOptions(options: FindOptionsWhere<Author>, relations: string[]): Promise<Author[]> {
        const authors = await this.authorRepo.find({ where: options, relations: relations });
        // return authors.map(author => AuthorMapper.toAuthorPublicDto(author));
        return authors;
    }

    async findAll(relations: string[]): Promise<Author[]> {
        return this.findManyByOptions({}, relations);
    }

    async updateOneById(authorId: string | { authorId: string }, dto: UpdateAuthorDto): Promise<boolean> {
        const options = typeof authorId === "string" ? { authorId: authorId } : { authorId: authorId.authorId };
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<Author>, dto: UpdateAuthorDto): Promise<boolean> {
        const author = await this.findOneByOptions(options, []);
        if(!author) return false;

        await AuthorMapper.updateFromDto(author, dto);

        const saved = await this.save(author);

        // return AuthorMapper.toAuthorPublicDto(saved);

        return true;
    }

    async updateManyByOptions(options: FindOptionsWhere<Author>, dto: UpdateAuthorDto): Promise<boolean> {
        const authors = await this.findManyByOptions(options, []);

        for (const author of authors) {
            await AuthorMapper.updateFromDto(author, dto);
            await this.save(author);
        }

        // return authors.map(author => AuthorMapper.toAuthorPublicDto(author));

        return true;
    }

    async removeOneById(authorId: string | { authorId: string }): Promise<boolean> {
        const options = typeof authorId === "string" ? { authorId: authorId } : { authorId: authorId.authorId };
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<Author>): Promise<boolean> {
        const author = await this.findOneByOptions(options, []);
        if (!author) return false;
        await this.remove(author);
        // return AuthorMapper.toAuthorPublicDto(author);
        return true;
    }

    async removeManyByOptions(options: FindOptionsWhere<Author>): Promise<boolean> {
        const authors = await this.findManyByOptions(options, []);
        await this.removeMany(authors);
        // return authors.map(author => AuthorMapper.toAuthorPublicDto(author));
        return true;
    }

    async save(author: Author): Promise<Author> {
        return await this.authorRepo.save(author);
    }

    async remove(author: Author): Promise<Author> {
        return await this.authorRepo.remove(author);
    }

    async removeMany(authors: Author[]): Promise<Author[]> {
        return await this.authorRepo.remove(authors);
    }

    async addBook(authorId: string | { authorId: string }, bookId: string | { bookId: string }): Promise<boolean> {
        const authorOptions = typeof authorId === "string" ? { authorId: authorId } : { authorId: authorId.authorId };
        const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };

        const author = await this.findOneByOptions(authorOptions, ['books']);
        if (!author) return false;

        const book = await this.bookService.findOneByOptions(bookOptions, []);
        if(!book) return false;

        if(!(author.books.find(b => b.bookId === book.bookId)))
        {
            author.books.push(book);
            const saved = await this.save(author);
        }

        return true;
    }

    async removeBook(authorId: string | { authorId: string }, bookId: string | { bookId: string }): Promise<boolean> {
        const authorOptions = typeof authorId === "string" ? { authorId: authorId } : { authorId: authorId.authorId };
        const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };

        const author = await this.findOneByOptions(authorOptions, ['books']);
        if(!author) return false;

        const indexToRemove = author.books.findIndex(item => item.bookId === bookOptions.bookId);
        if (indexToRemove !== -1) {
            author.books.splice(indexToRemove, 1);
        }

        const saved = await this.save(author);

        return true;
    }

    async clearBooks(authorId: string | { authorId: string }): Promise<boolean> {
        const authorOptions = typeof authorId === "string" ? { authorId: authorId } : { authorId: authorId.authorId };

        const author = await this.findOneByOptions(authorOptions, ['books']);
        if (!author) return false;

        author.books = [];

        const saved = await this.save(author);

        return true;
    }
}