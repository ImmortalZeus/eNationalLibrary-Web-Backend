import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Genre } from './genre.entity';
import { GenrePublicDto } from './dto/genre-public.dto';
import { CreateGenreDto } from './dto/create-genre.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreMapper } from './genre.mapper';

@Injectable()
export class GenreService {
    constructor(
        @InjectRepository(Genre)
        private readonly genreRepo: Repository<Genre>,
    ) {}

    async create(dto: CreateGenreDto): Promise<GenrePublicDto> {
        const existing = await this.genreRepo.findOneBy({ genreId: dto.genreId });
        if (existing) {
            throw new ConflictException('genreId already exists');
        }

        const genre = GenreMapper.createFromDto(dto);

        const saved = await this.genreRepo.save(genre);

        return GenreMapper.toGenrePublicDto(saved);
    }

    async findOneById(genreId: string | { genreId: string }): Promise<GenrePublicDto | null> {
        const options = typeof genreId === "string" ? { genreId: genreId } : genreId;
        return this.findOneByOptions(options);
    }

    async findOneByOptions(options: FindOptionsWhere<Genre>): Promise<GenrePublicDto | null> {
        const genre = await this.genreRepo.findOne({ where: options });
        if(!genre) return null;
        return GenreMapper.toGenrePublicDto(genre);
    }

    async findManyByOptions(options: FindOptionsWhere<Genre>): Promise<GenrePublicDto[]> {
        const genres = await this.genreRepo.find({ where: options });
        return genres.map(genre => GenreMapper.toGenrePublicDto(genre));
    }

    async findAll(): Promise<GenrePublicDto[]> {
        return this.findManyByOptions({});
    }

    async updateOneById(genreId: string | { genreId: string }, dto: UpdateGenreDto): Promise<GenrePublicDto | null> {
        const options = typeof genreId === "string" ? { genreId: genreId } : genreId;
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<Genre>, dto: UpdateGenreDto): Promise<GenrePublicDto | null> {
        const genre = await this.genreRepo.findOne({ where: options });
        if(!genre) return null;

        GenreMapper.updateFromDto(genre, dto);

        const saved = await this.genreRepo.save(genre);

        return GenreMapper.toGenrePublicDto(saved);
    }

    async updateManyByOptions(options: FindOptionsWhere<Genre>, dto: UpdateGenreDto): Promise<GenrePublicDto[]> {
        const genres = await this.genreRepo.find({ where: options });

        for (const genre of genres) {
            GenreMapper.updateFromDto(genre, dto);
            await this.genreRepo.save(genre);
        }

        return genres.map(genre => GenreMapper.toGenrePublicDto(genre));
    }

    async removeOneById(genreId: string | { genreId: string }): Promise<GenrePublicDto | null> {
        const options = typeof genreId === "string" ? { genreId: genreId } : genreId;
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<Genre>): Promise<GenrePublicDto | null> {
        const genre = await this.genreRepo.findOne({ where: options });
        if (!genre) return null;
        await this.genreRepo.remove(genre);
        return GenreMapper.toGenrePublicDto(genre);
    }

    async removeManyByOptions(options: FindOptionsWhere<Genre>): Promise<GenrePublicDto[]> {
        const genres = await this.genreRepo.find({ where: options });
        await this.genreRepo.remove(genres);
        return genres.map(genre => GenreMapper.toGenrePublicDto(genre));
    }
}