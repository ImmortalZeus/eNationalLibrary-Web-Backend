import { plainToInstance } from 'class-transformer';
import { AuthorMapper } from '../author/author.mapper';
import { PublisherMapper } from '../publisher/publisher.mapper';
import { GenreMapper } from '../genre/genre.mapper';
import { Book } from './book.entity';
import { BookPublicDto } from './dto/book-public.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

export class BookMapper {
  static createFromDto(dto: CreateBookDto): Book {
    const book = new Book();

    book.title = dto.title;
    book.description = dto.description;
    book.previewUrl = dto.previewUrl;

    return book;
  }

  static updateFromDto(book: Book, dto: UpdateBookDto): Book {
    book.title = dto.title ?? book.title;
    book.description = dto.description ?? book.description;
    book.previewUrl = dto.previewUrl ?? book.previewUrl;

    return book;
  }

  static toBookPublicDto(book: Book): BookPublicDto {
    return plainToInstance(
      BookPublicDto,
      {
        ...book,
        authors: book.authors?.map((author) =>
          AuthorMapper.toAuthorPublicDto(author),
        ),
        publishers: book.publishers?.map((publisher) =>
          PublisherMapper.toPublisherPublicDto(publisher),
        ),
        genres: book.genres?.map((genre) =>
          GenreMapper.toGenrePublicDto(genre),
        ),
      },
      { excludeExtraneousValues: true },
    );
  }
}