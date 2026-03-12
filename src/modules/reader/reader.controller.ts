import { Body, Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { ReaderService } from './reader.service';
import { Reader } from './reader.schema';

@Controller('readers')
export class ReaderController {
  constructor(private readonly readerService: ReaderService) {}

    // CREATE
    @Post()
    async create(@Body() createReaderDto: CreateReaderDto): Promise<Reader> {
        return this.readerService.create(createReaderDto);
    }

    // READ ALL
    @Get()
    async findAll(): Promise<Reader[]> {
        return this.readerService.findAll();
    }

    // READ ONE
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Reader | null> {
        return this.readerService.findOne(id);
    }

    // UPDATE
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateReaderDto: UpdateReaderDto): Promise<Reader | null> {
        return this.readerService.update(id, updateReaderDto);
    }
    
    // DELETE
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Reader | null> {
        return this.readerService.remove(id);
    }
}
