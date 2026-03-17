import { Genre } from './genre.entity';
import { GenrePublicDto } from './dto/genre-public.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { CreateGenreDto } from './dto/create-genre.dto';
import { plainToInstance } from 'class-transformer';

export class GenreMapper {
    static createFromDto(dto: CreateGenreDto): Genre {
        const genre = new Genre();

        genre.genreId = dto.genreId;
        genre.label = dto.label;
        genre.description = dto.description;

        return genre;
    }

    static updateFromDto(genre: Genre, dto: UpdateGenreDto): Genre {
        genre.label = dto.label === undefined ? genre.label : dto.label;
        genre.description = dto.description === undefined ? genre.description : dto.description;

        return genre;
    }

    static toGenrePublicDto(genre: Genre): GenrePublicDto {
        return plainToInstance(GenrePublicDto, { ...genre }, {
            excludeExtraneousValues: true,
        });
    }
}