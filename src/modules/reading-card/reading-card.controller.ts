import { Body, Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { CreateReadingCardDto } from './dto/create-reading-card.dto';
import { UpdateReadingCardDto } from './dto/update-reading-card.dto';
import { ReadingCardService } from './reading-card.service';
import { ReadingCard } from './reading-card.schema'
import { ReadingCardPublicDto } from './dto/reading-card-public.dto';

@Controller('reading-cards')
export class ReadingCardController {
    constructor(private readonly readingCardService: ReadingCardService) {}

    // CREATE
    @Post()
    async create(@Body() createReadingCardDto: CreateReadingCardDto): Promise<ReadingCardPublicDto> {
        return this.readingCardService.create(createReadingCardDto);
    }

    // READ ALL
    @Get()
    async findAll(): Promise<ReadingCardPublicDto[]> {
        return this.readingCardService.findAll();
    }

    // READ ONE
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ReadingCardPublicDto | null> {
        return this.readingCardService.findOne(id);
    }

    // UPDATE
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateReadingCardDto: UpdateReadingCardDto): Promise<ReadingCardPublicDto | null> {
        return this.readingCardService.update(id, updateReadingCardDto);
    }

    // DELETE
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<ReadingCardPublicDto | null> {
        return this.readingCardService.remove(id);
    }
}
