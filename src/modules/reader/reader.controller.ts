import { Body, Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { ReaderService } from './reader.service';
import { Reader } from './reader.entity';
import { ReaderPublicDto } from './dto/reader-public.dto';

@Controller('readers')
export class ReaderController {
    constructor(private readonly readerService: ReaderService) {}

    // CREATE
    @Post()
    async create(@Body() createReaderDto: CreateReaderDto): Promise<ReaderPublicDto> {
        return this.readerService.create(createReaderDto);
    }

    // READ ALL
    @Get()
    async findAll(): Promise<ReaderPublicDto[]> {
        return this.readerService.findAll();
    }

    // READ ONE
    @Get(':id')
    async findOneById(@Param('id') id: string): Promise<ReaderPublicDto | null> {
        return this.readerService.findOneById(id);
    }

    // UPDATE
    @Put(':id')
    async updateOneById(@Param('id') id: string, @Body() updateReaderDto: UpdateReaderDto): Promise<ReaderPublicDto | null> {
        return this.readerService.updateOneById(id, updateReaderDto);
    }
    
    // DELETE
    @Delete(':id')
    async removeOneById(@Param('id') id: string): Promise<ReaderPublicDto | null> {
        return this.readerService.removeOneById(id);
    }
}
