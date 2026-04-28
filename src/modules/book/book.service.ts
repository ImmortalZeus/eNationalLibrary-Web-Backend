import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookMapper } from './book.mapper';
import { AuthorService } from '../author/author.service';
import { PublisherService } from '../publisher/publisher.service';
import { GenreService } from '../genre/genre.service';

@Injectable()
export class BookService {
    constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,

    @Inject(forwardRef(() => AuthorService))
    private readonly authorService: AuthorService,

    @Inject(forwardRef(() => PublisherService))
    private readonly publisherService: PublisherService,

    @Inject(forwardRef(() => GenreService))
    private readonly genreService: GenreService,
) {}

    async create(dto: CreateBookDto): Promise<Book> {
        const book = BookMapper.createFromDto(dto);

        book.authors = [];

        if(dto.authorIds) {
            for(const authorId of dto.authorIds) {
                const author = await this.authorService.findOneById(authorId, []);
                if(author) {
                    book.authors.push(author)
                }
            }
        }
        if(dto.newAuthors) {
            for(const newAuthor of dto.newAuthors) {
                const author = await this.authorService.create(newAuthor);
                book.authors.push(author);
            }
        }

        book.publishers = [];

        if(dto.publisherIds) {
            for(const publisherId of dto.publisherIds) {
                const publisher = await this.publisherService.findOneById(publisherId, []);
                if(publisher) {
                    book.publishers.push(publisher)
                }
            }
        }
        if(dto.newPublishers) {
            for(const newPublisher of dto.newPublishers) {
                const publisher = await this.publisherService.create(newPublisher);
                book.publishers.push(publisher)
            }
        }

        book.genres = [];

        if(dto.genreIds) {
            for(const genreId of dto.genreIds) {
                const genre = await this.genreService.findOneById(genreId, []);
                if(genre) {
                    book.genres.push(genre)
                }
            }
        }
        if(dto.newGenres) {
            for(const newGenre of dto.newGenres) {
                const genre = await this.genreService.create(newGenre);
                book.genres.push(genre)
            }
        }

        const saved = await this.save(book);

        return saved;
    }

    async findOneById(bookId: string | { bookId: string }, relations: string[]): Promise<Book | null> {
        const options = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };
        return this.findOneByOptions(options, relations);
    }

    async findOneByOptions(options: FindOptionsWhere<Book>, relations: string[]): Promise<Book | null> {
        const book = await this.bookRepo.findOne({ where: options, relations: relations });
        if(!book) return null;
        return book;
    }

    async findManyByOptions(options: FindOptionsWhere<Book>, relations: string[]): Promise<Book[]> {
        const books = await this.bookRepo.find({ where: options, relations: relations });
        return books;
    }

    async findAll(relations: string[]): Promise<Book[]> {
        return this.findManyByOptions({}, relations);
    }

    async updateOneById(bookId: string | { bookId: string }, dto: UpdateBookDto): Promise<boolean> {
        const options = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<Book>, dto: UpdateBookDto): Promise<boolean> {
        // const relations: string[] = [];
        // if(dto.authorIds || dto.newAuthors) {
        //     relations.push('authors')
        // }

        // if(dto.publisherIds || dto.newPublishers) {
        //     relations.push('publishers')
        // }

        // if(dto.genreIds || dto.newGenres) {
        //     relations.push('genres')
        // }

        // const book = await this.findOneByOptions(options, relations);
        const book = await this.findOneByOptions(options, []);
        if(!book) return false;

        BookMapper.updateFromDto(book, dto);

        if(dto.authorIds || dto.newAuthors) {
            book.authors = [];
        }

        if(dto.authorIds) {
            for(const authorId of dto.authorIds) {
                const author = await this.authorService.findOneById(authorId, []);
                if(author) {
                    book.authors.push(author)
                }
            }
        }
        if(dto.newAuthors) {
            for(const newAuthor of dto.newAuthors) {
                const author = await this.authorService.create(newAuthor);
                book.authors.push(author);
            }
        }

        if(dto.publisherIds || dto.newPublishers) {
            book.publishers = [];
        }

        if(dto.publisherIds) {
            for(const publisherId of dto.publisherIds) {
                const publisher = await this.publisherService.findOneById(publisherId, []);
                if(publisher) {
                    book.publishers.push(publisher)
                }
            }
        }
        if(dto.newPublishers) {
            for(const newPublisher of dto.newPublishers) {
                const publisher = await this.publisherService.create(newPublisher);
                book.publishers.push(publisher)
            }
        }

        if(dto.genreIds || dto.newGenres) {
            book.genres = [];
        }

        if(dto.genreIds) {
            for(const genreId of dto.genreIds) {
                const genre = await this.genreService.findOneById(genreId, []);
                if(genre) {
                    book.genres.push(genre)
                }
            }
        }
        if(dto.newGenres) {
            for(const newGenre of dto.newGenres) {
                const genre = await this.genreService.create(newGenre);
                book.genres.push(genre)
            }
        }

        const saved = await this.save(book);

        return true;
    }

    async updateManyByOptions(options: FindOptionsWhere<Book>, dto: UpdateBookDto): Promise<boolean> {
        const books = await this.findManyByOptions(options, []);

        for (const book of books) {
            BookMapper.updateFromDto(book, dto);

            if(dto.authorIds || dto.newAuthors) {
                book.authors = [];
            }

            if(dto.authorIds) {
                for(const authorId of dto.authorIds) {
                    const author = await this.authorService.findOneById(authorId, []);
                    if(author) {
                        book.authors.push(author)
                    }
                }
            }
            if(dto.newAuthors) {
                for(const newAuthor of dto.newAuthors) {
                    const author = await this.authorService.create(newAuthor);
                    book.authors.push(author);
                }
            }

            if(dto.publisherIds || dto.newPublishers) {
                book.publishers = [];
            }

            if(dto.publisherIds) {
                for(const publisherId of dto.publisherIds) {
                    const publisher = await this.publisherService.findOneById(publisherId, []);
                    if(publisher) {
                        book.publishers.push(publisher)
                    }
                }
            }
            if(dto.newPublishers) {
                for(const newPublisher of dto.newPublishers) {
                    const publisher = await this.publisherService.create(newPublisher);
                    book.publishers.push(publisher)
                }
            }

            if(dto.genreIds || dto.newGenres) {
                book.genres = [];
            }

            if(dto.genreIds) {
                for(const genreId of dto.genreIds) {
                    const genre = await this.genreService.findOneById(genreId, []);
                    if(genre) {
                        book.genres.push(genre)
                    }
                }
            }
            if(dto.newGenres) {
                for(const newGenre of dto.newGenres) {
                    const genre = await this.genreService.create(newGenre);
                    book.genres.push(genre)
                }
            }

            await this.save(book);
        }

        return true;
    }

    async removeOneById(bookId: string | { bookId: string }): Promise<boolean> {
        const options = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<Book>): Promise<boolean> {
        const book = await this.findOneByOptions(options, []);
        if (!book) return false;
        await this.remove(book);
        return true;
    }

    async removeManyByOptions(options: FindOptionsWhere<Book>): Promise<boolean> {
        const books = await this.findManyByOptions(options, []);
        await this.removeMany(books);
        return true;
    }

    async save(book: Book): Promise<Book> {
        return await this.bookRepo.save(book);
    }

    async remove(book: Book): Promise<Book> {
        return await this.bookRepo.remove(book);
    }

    async removeMany(books: Book[]): Promise<Book[]> {
        return await this.bookRepo.remove(books);
    }

    async addAuthor(bookId: string | { bookId: string }, authorId: string | { authorId: string }): Promise<boolean> {
        const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };
        const authorOptions = typeof authorId === "string" ? { authorId: authorId } : { authorId: authorId.authorId };

        const book = await this.findOneByOptions(bookOptions, ['authors']);
        if (!book) return false;

        const author = await this.authorService.findOneByOptions(authorOptions, []);
        if(!author) return false;

        if(!(book.authors.find(a => a.authorId === author.authorId)))
        {
            book.authors.push(author);
            const saved = await this.save(book);
        }

        return true;
    }

    async removeAuthor(bookId: string | { bookId: string }, authorId: string | { authorId: string }): Promise<boolean> {
        const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };
        const authorOptions = typeof authorId === "string" ? { authorId: authorId } : { authorId: authorId.authorId };

        const book = await this.findOneByOptions(bookOptions, ['authors']);
        if (!book) return false;

        const indexToRemove = book.authors.findIndex(item => item.authorId === authorOptions.authorId);
        if (indexToRemove !== -1) {
            book.authors.splice(indexToRemove, 1);
        }

        const saved = await this.save(book);

        return true;
    }

    async clearAuthors(bookId: string | { bookId: string }): Promise<boolean> {
        const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };

        const book = await this.findOneByOptions(bookOptions, ['authors']);
        if (!book) return false;

        book.authors = [];

        const saved = await this.save(book);

        return true;
    }

    async addPublisher(bookId: string | { bookId: string }, publisherId: string | { publisherId: string }): Promise<boolean> {
        const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };
        const publisherOptions = typeof publisherId === "string" ? { publisherId: publisherId } : { publisherId: publisherId.publisherId };

        const book = await this.findOneByOptions(bookOptions, ['publishers']);
        if (!book) return false;

        const publisher = await this.publisherService.findOneByOptions(publisherOptions, []);
        if(!publisher) return false;

        if(!(book.publishers.find(a => a.publisherId === publisher.publisherId)))
        {
            book.publishers.push(publisher);
            const saved = await this.save(book);
        }

        return true;
    }

    async removePublisher(bookId: string | { bookId: string }, publisherId: string | { publisherId: string }): Promise<boolean> {
        const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };
        const publisherOptions = typeof publisherId === "string" ? { publisherId: publisherId } : { publisherId: publisherId.publisherId };

        const book = await this.findOneByOptions(bookOptions, ['publishers']);
        if (!book) return false;

        const indexToRemove = book.publishers.findIndex(item => item.publisherId === publisherOptions.publisherId);
        if (indexToRemove !== -1) {
            book.publishers.splice(indexToRemove, 1);
        }

        const saved = await this.save(book);

        return true;
    }

    async clearPublishers(bookId: string | { bookId: string }): Promise<boolean> {
        const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };

        const book = await this.findOneByOptions(bookOptions, ['publishers']);
        if (!book) return false;

        book.publishers = [];

        const saved = await this.save(book);

        return true;
    }

    async addGenre(bookId: string | { bookId: string }, genreId: string | { genreId: string }): Promise<boolean> {
        const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };
        const genreOptions = typeof genreId === "string" ? { genreId: genreId } : { genreId: genreId.genreId };

        const book = await this.findOneByOptions(bookOptions, ['genres']);
        if (!book) return false;

        const genre = await this.genreService.findOneByOptions(genreOptions, []);
        if(!genre) return false;

        if(!(book.genres.find(a => a.genreId === genre.genreId)))
        {
            book.genres.push(genre);
            const saved = await this.save(book);
        }

        return true;
    }

    async removeGenre(bookId: string | { bookId: string }, genreId: string | { genreId: string }): Promise<boolean> {
        const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };
        const genreOptions = typeof genreId === "string" ? { genreId: genreId } : { genreId: genreId.genreId };

        const book = await this.findOneByOptions(bookOptions, ['genres']);
        if (!book) return false;

        const indexToRemove = book.genres.findIndex(item => item.genreId === genreOptions.genreId);
        if (indexToRemove !== -1) {
            book.genres.splice(indexToRemove, 1);
        }

        const saved = await this.save(book);

        return true;
    }

    async clearGenres(bookId: string | { bookId: string }): Promise<boolean> {
        const bookOptions = typeof bookId === "string" ? { bookId: bookId } : { bookId: bookId.bookId };

        const book = await this.findOneByOptions(bookOptions, ['genres']);
        if (!book) return false;

        book.genres = [];

        const saved = await this.save(book);

        return true;
    }
}