import { Book } from './book.entity';
import { BookPublicDto } from './dto/book-public.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { plainToInstance } from 'class-transformer';
import { AuthorMapper } from '../author/author.mapper';
import { PublisherMapper } from '../publisher/publisher.mapper';
import { GenreMapper } from '../genre/genre.mapper';

export class BookMapper {
    // eslint-disable-next-line @typescript-eslint/require-await
    static async createFromDto(dto: CreateBookDto): Promise<Book> {
        const book = new Book();

        book.title = dto.title;
        book.description = dto.description;
        book.previewUrl = dto.previewUrl;

        return book;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    static async updateFromDto(book: Book, dto: UpdateBookDto): Promise<Book> {
        book.title = dto.title ? dto.title : book.title;
        book.description = dto.description ? dto.description : book.description;
        book.previewUrl = dto.previewUrl ? dto.previewUrl : book.previewUrl;

        return book;
    }

    static toBookPublicDto(book: Book): BookPublicDto {
        return plainToInstance(BookPublicDto, {
                ...book,
                authors: book.authors ? book.authors.map(a => AuthorMapper.toAuthorPublicDto(a)) : undefined,
                publishers: book.publishers ? book.publishers.map(p => PublisherMapper.toPublisherPublicDto(p)) : undefined,
                genres: book.genres ? book.genres.map(g => GenreMapper.toGenrePublicDto(g)) : undefined
            }, {
            excludeExtraneousValues: true,
        });
    }
}