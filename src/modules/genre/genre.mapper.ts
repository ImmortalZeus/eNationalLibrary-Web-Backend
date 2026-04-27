import { Genre } from './genre.entity';
import { GenrePublicDto } from './dto/genre-public.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { CreateGenreDto } from './dto/create-genre.dto';
import { plainToInstance } from 'class-transformer';
import { BookMapper } from '../book/book.mapper';

export class GenreMapper {
    // eslint-disable-next-line @typescript-eslint/require-await
    static async createFromDto(dto: CreateGenreDto): Promise<Genre> {
        const genre = new Genre();

        genre.label = dto.label;
        genre.description = dto.description;

        return genre;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    static async updateFromDto(genre: Genre, dto: UpdateGenreDto): Promise<Genre> {
        genre.label = dto.label ? dto.label : genre.label;
        genre.description = dto.description ? dto.description : genre.description;

        return genre;
    }

    static toGenrePublicDto(genre: Genre): GenrePublicDto {
        return plainToInstance(GenrePublicDto, {
                ...genre,
                books: genre.books ? genre.books.map(b => BookMapper.toBookPublicDto(b)) : undefined
            }, {
            excludeExtraneousValues: true,
        });
    }
}