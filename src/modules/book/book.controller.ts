import { Body, Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookService } from './book.service';
import { Book } from './book.entity'
import { BookPublicDto } from './dto/book-public.dto';

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    // CREATE
    @Post()
    async create(@Body() createBookDto: CreateBookDto): Promise<BookPublicDto> {
        return this.bookService.create(createBookDto);
    }

    // READ ALL
    @Get()
    async findAll(): Promise<BookPublicDto[]> {
        return this.bookService.findAll();
    }

    // READ ONE
    @Get(':id')
    async findOneById(@Param('id') id: string): Promise<BookPublicDto | null> {
        return this.bookService.findOneById(id);
    }

    // UPDATE
    @Put(':id')
    async updateOneById(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto): Promise<BookPublicDto | null> {
        return this.bookService.updateOneById(id, updateBookDto);
    }

    // DELETE
    @Delete(':id')
    async removeOneById(@Param('id') id: string): Promise<BookPublicDto | null> {
        return this.bookService.removeOneById(id);
    }
}
