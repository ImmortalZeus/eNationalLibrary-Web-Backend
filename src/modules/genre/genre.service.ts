import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Genre } from './genre.entity';
import { GenrePublicDto } from './dto/genre-public.dto';
import { CreateGenreDto } from './dto/create-genre.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreMapper } from './genre.mapper';
import { BookService } from '../book/book.service';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genre)
        private readonly genreRepo: Repository<Genre>,
        private readonly bookService: BookService,
    ) {}

    async create(dto: CreateGenreDto): Promise<Genre> {
        const genre = await GenreMapper.createFromDto(dto);

        const saved = await this.save(genre);

        return saved;
    }

    async findOneById(genreId: string | { genreId: string }, relations: string[]): Promise<Genre | null> {
        const options = typeof genreId === "string" ? { genreId: genreId } : { genreId: genreId.genreId };
        return this.findOneByOptions(options, relations);
    }

    async findOneByOptions(options: FindOptionsWhere<Genre>, relations: string[]): Promise<Genre | null> {
        const genre = await this.genreRepo.findOne({ where: options, relations: relations });
        if(!genre) return null;
        return genre;
    }

    async findManyByOptions(options: FindOptionsWhere<Genre>, relations: string[]): Promise<Genre[]> {
        const genres = await this.genreRepo.find({ where: options, relations: relations });
        return genres;
    }

    async findAll(relations: string[]): Promise<Genre[]> {
        return this.findManyByOptions({}, relations);
    }

    async updateOneById(genreId: string | { genreId: string }, dto: UpdateGenreDto): Promise<boolean> {
        const options = typeof genreId === "string" ? { genreId: genreId } : { genreId: genreId.genreId };
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<Genre>, dto: UpdateGenreDto): Promise<boolean> {
        const genre = await this.findOneByOptions(options, []);
        if(!genre) return false;

        await GenreMapper.updateFromDto(genre, dto);

        const saved = await this.save(genre);

        return true
    }

    async updateManyByOptions(options: FindOptionsWhere<Genre>, dto: UpdateGenreDto): Promise<boolean> {
        const genres = await this.findManyByOptions(options, []);

        for (const genre of genres) {
            await GenreMapper.updateFromDto(genre, dto);
            await this.save(genre);
        }

        return true
    }

    async removeOneById(genreId: string | { genreId: string }): Promise<boolean> {
        const options = typeof genreId === "string" ? { genreId: genreId } : { genreId: genreId.genreId };
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<Genre>): Promise<boolean> {
        const genre = await this.findOneByOptions(options, []);
        if (!genre) return false;
        await this.remove(genre);
        return true;
    }

    async removeManyByOptions(options: FindOptionsWhere<Genre>): Promise<boolean> {
        const genres = await this.findManyByOptions(options, []);
        await this.removeMany(genres);
        return true;
    }

    async save(genre: Genre): Promise<Genre> {
        return await this.genreRepo.save(genre);
    }

    async remove(genre: Genre): Promise<Genre> {
        return await this.genreRepo.remove(genre);
    }

    async removeMany(genres: Genre[]): Promise<Genre[]> {
        return await this.genreRepo.remove(genres);
    }

    async addBook(genreId: string | { genreId: string }, bookId: string | { bookId: string }): Promise<boolean> {
        const genreOptions = typeof genreId === "string" ? { genreId: genreId } : { genreId: genreId.genreId };
        const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };

        const genre = await this.findOneByOptions(genreOptions, ['books']);
        if (!genre) return false;

        const book = await this.bookService.findOneByOptions(bookOptions, []);
        if(!book) return false;

        if(!(genre.books.find(b => b.bookId === book.bookId)))
        {
            genre.books.push(book);
            const saved = await this.save(genre);
        }

        return true;
    }

    async removeBook(genreId: string | { genreId: string }, bookId: string | { bookId: string }): Promise<boolean> {
        const genreOptions = typeof genreId === "string" ? { genreId: genreId } : { genreId: genreId.genreId };
        const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };

        const genre = await this.findOneByOptions(genreOptions, ['books']);
        if(!genre) return false;

        const indexToRemove = genre.books.findIndex(item => item.bookId === bookOptions.bookId);
        if (indexToRemove !== -1) {
            genre.books.splice(indexToRemove, 1);
        }

        const saved = await this.save(genre);

        return true;
    }

    async clearBooks(genreId: string | { genreId: string }): Promise<boolean> {
        const genreOptions = typeof genreId === "string" ? { genreId: genreId } : { genreId: genreId.genreId };

        const genre = await this.findOneByOptions(genreOptions, ['books']);
        if (!genre) return false;

        genre.books = [];

        const saved = await this.save(genre);

        return true;
    }
}