import { Body, Controller, Param, Get, Post, Put, Delete, Query } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorService } from './author.service';
import { Author } from './author.entity'
import { AuthorPublicDto } from './dto/author-public.dto';
import { AuthorMapper } from './author.mapper';
import { ParseRelationsPipe } from 'src/common/queryPipes/parseRelations.pipe';

@Controller('authors')
export class AuthorController {
    constructor(private readonly authorService: AuthorService) {}

    // CREATE
    @Post()
    async create(
        @Body() createAuthorDto: CreateAuthorDto
    ): Promise<string> {
        const author = await this.authorService.create(createAuthorDto);
        return author.authorId;
    }

    // READ ALL
    @Get()
    async findAll(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<AuthorPublicDto[]> {
        const authors = await this.authorService.findAll(relations);
        return authors.map(author => AuthorMapper.toAuthorPublicDto(author));
    }

    // READ ONE
    @Get(':id')
    async findOneById(
        @Param('id') id: string,
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<AuthorPublicDto | null> {
        const author = await this.authorService.findOneById(id, relations);
        return author ? AuthorMapper.toAuthorPublicDto(author) : null;
    }

    // UPDATE
    @Put(':id')
    async updateOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[],
        @Body() updateAuthorDto: UpdateAuthorDto
    ): Promise<boolean> {
        const res = await this.authorService.updateOneById(id, updateAuthorDto);
        return res;
    }

    // DELETE
    @Delete(':id')
    async removeOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<boolean> {
        const res = await this.authorService.removeOneById(id);
        return res;
    }
}
