import { Body, Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorService } from './author.service';
import { Author } from './author.entity'
import { AuthorPublicDto } from './dto/author-public.dto';

@Controller('authors')
export class AuthorController {
    constructor(private readonly authorService: AuthorService) {}

    // CREATE
    @Post()
    async create(@Body() createAuthorDto: CreateAuthorDto): Promise<AuthorPublicDto> {
        return this.authorService.create(createAuthorDto);
    }

    // READ ALL
    @Get()
    async findAll(): Promise<AuthorPublicDto[]> {
        return this.authorService.findAll();
    }

    // READ ONE
    @Get(':id')
    async findOneById(@Param('id') id: string): Promise<AuthorPublicDto | null> {
        return this.authorService.findOneById(id);
    }

    // UPDATE
    @Put(':id')
    async updateOneById(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto): Promise<AuthorPublicDto | null> {
        return this.authorService.updateOneById(id, updateAuthorDto);
    }

    // DELETE
    @Delete(':id')
    async removeOneById(@Param('id') id: string): Promise<AuthorPublicDto | null> {
        return this.authorService.removeOneById(id);
    }
}
