import { Body, Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreService } from './genre.service';
import { Genre } from './genre.entity'
import { GenrePublicDto } from './dto/genre-public.dto';

@Controller('genres')
export class GenreController {
    constructor(private readonly genreService: GenreService) {}

    // CREATE
    @Post()
    async create(@Body() createGenreDto: CreateGenreDto): Promise<GenrePublicDto> {
        return this.genreService.create(createGenreDto);
    }

    // READ ALL
    @Get()
    async findAll(): Promise<GenrePublicDto[]> {
        return this.genreService.findAll();
    }

    // READ ONE
    @Get(':id')
    async findOneById(@Param('id') id: string): Promise<GenrePublicDto | null> {
        return this.genreService.findOneById(id);
    }

    // UPDATE
    @Put(':id')
    async updateOneById(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto): Promise<GenrePublicDto | null> {
        return this.genreService.updateOneById(id, updateGenreDto);
    }

    // DELETE
    @Delete(':id')
    async removeOneById(@Param('id') id: string): Promise<GenrePublicDto | null> {
        return this.genreService.removeOneById(id);
    }
}
