import { Body, Controller, Param, Get, Post, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreService } from './genre.service';
import { Genre } from './genre.entity'
import { GenrePublicDto } from './dto/genre-public.dto';
import { GenreMapper } from './genre.mapper';
import { ParseRelationsPipe } from 'src/common/queryPipes/parseRelations.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { Roles } from '../auth/roles.decorator';

@Controller('genres')
export class GenreController {
    constructor(private readonly genreService: GenreService) {}

    // CREATE
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Post()
    async create(
        @Body() createGenreDto: CreateGenreDto
    ): Promise<string> {
        const genre = await this.genreService.create(createGenreDto);
        return genre.genreId;
    }

    // READ ALL
    @Get()
    async findAll(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<GenrePublicDto[]> {
        const genres = await this.genreService.findAll(relations);
        return genres.map(genre => GenreMapper.toGenrePublicDto(genre));
    }

    // READ ONE
    @Get(':id')
    async findOneById(
        @Param('id') id: string,
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<GenrePublicDto | null> {
        const genre = await this.genreService.findOneById(id, relations);
        return genre ? GenreMapper.toGenrePublicDto(genre) : null;
    }

    // UPDATE
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Put(':id')
    async updateOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[],
        @Body() updateGenreDto: UpdateGenreDto
    ): Promise<boolean> {
        const res = await this.genreService.updateOneById(id, updateGenreDto);
        return res;
    }

    // DELETE
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Delete(':id')
    async removeOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<boolean> {
        const res = await this.genreService.removeOneById(id);
        return res;
    }
}
