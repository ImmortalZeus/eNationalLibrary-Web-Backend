import { Book } from './book.entity';
import { BookPublicDto } from './dto/book-public.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { plainToInstance } from 'class-transformer';

export class BookMapper {
    static createFromDto(dto: CreateBookDto): Book {
        const book = new Book();

        book.bookId = dto.bookId;
        book.title = dto.title;
        book.authorIds = dto.authorIds;
        book.description = dto.description;
        book.publisherId = dto.publisherId;
        book.genreIds = dto.genreIds;
        book.previewUrl = dto.previewUrl;

        return book;
    }

    static updateFromDto(book: Book, dto: UpdateBookDto): Book {
        book.title = dto.title === undefined ? book.title : dto.title;
        book.authorIds = dto.authorIds === undefined ? book.authorIds : dto.authorIds;
        book.description = dto.description === undefined ? book.description : dto.description;
        book.publisherId = dto.publisherId === undefined ? book.publisherId : dto.publisherId;
        book.genreIds = dto.genreIds === undefined ? book.genreIds : dto.genreIds;
        book.previewUrl = dto.previewUrl === undefined ? book.previewUrl : dto.previewUrl;

        return book;
    }

    static toBookPublicDto(book: Book): BookPublicDto {
        return plainToInstance(BookPublicDto, { ...book }, {
            excludeExtraneousValues: true,
        });
    }
}