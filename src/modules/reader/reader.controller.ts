import { Body, Controller, Param, Get, Post, Put, Delete, Query } from '@nestjs/common';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { ReaderService } from './reader.service';
import { Reader } from './reader.entity';
import { ReaderPublicDto } from './dto/reader-public.dto';
import { ReaderMapper } from './reader.mapper';
import { ParseRelationsPipe } from 'src/common/queryPipes/parseRelations.pipe';

@Controller('readers')
export class ReaderController {
    constructor(private readonly readerService: ReaderService) {}

    // CREATE
    @Post()
    async create(
        @Body() createReaderDto: CreateReaderDto
    ): Promise<string> {
        const reader = await this.readerService.create(createReaderDto);
        return reader.userId;
    }

    // READ ALL
    @Get()
    async findAll(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<ReaderPublicDto[]> {
        const readers = await this.readerService.findAll(relations);
        return readers.map(reader => ReaderMapper.toReaderPublicDto(reader));
    }

    // READ ONE
    @Get(':id')
    async findOneById(
        @Param('id') id: string,
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<ReaderPublicDto | null> {
        const reader = await this.readerService.findOneById(id, relations);
        return reader ? ReaderMapper.toReaderPublicDto(reader) : null;
    }

    // UPDATE
    @Put(':id')
    async updateOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[],
        @Body() updateReaderDto: UpdateReaderDto
    ): Promise<boolean> {
        const res = await this.readerService.updateOneById(id, updateReaderDto);
        return res;
    }
    
    // DELETE
    @Delete(':id')
    async removeOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<boolean> {
        const res = await this.readerService.removeOneById(id);
        return res;
    }
}
