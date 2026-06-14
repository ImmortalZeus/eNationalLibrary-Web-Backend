import { Body, Controller, Param, Get, Post, Put, Delete, Query } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookService } from './book.service';
import { Book } from './book.entity'
import { BookPublicDto } from './dto/book-public.dto';
import { BookMapper } from './book.mapper';
import { ParseRelationsPipe } from 'src/common/queryPipes/parseRelations.pipe';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { Roles } from '../auth/roles.decorator';

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    // CREATE
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Post()
    async create(
        @Body() createBookDto: CreateBookDto
    ): Promise<string> {
        const book = await this.bookService.create(createBookDto);
        return book.bookId;
    }

    // READ ALL
    @Get()
    async findAll(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<BookPublicDto[]> {
        const books = await this.bookService.findAll(relations);
        return books.map(book => BookMapper.toBookPublicDto(book));
    }

    // READ ONE
    @Get(':id')
    async findOneById(
        @Param('id') id: string,
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<BookPublicDto | null> {
        const book = await this.bookService.findOneById(id, relations);
        return book ? BookMapper.toBookPublicDto(book) : null;
    }

    // UPDATE
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Put(':id')
    async updateOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[],
        @Body() updateBookDto: UpdateBookDto
    ): Promise<boolean> {
        const res = await this.bookService.updateOneById(id, updateBookDto);
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
        const res = await this.bookService.removeOneById(id);
        return res;
    }
}
