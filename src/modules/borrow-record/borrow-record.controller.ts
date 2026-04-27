import { Body, Controller, Param, Get, Post, Put, Delete, Query } from '@nestjs/common';
import { CreateBorrowRecordDto } from './dto/create-borrow-record.dto';
import { UpdateBorrowRecordDto } from './dto/update-borrow-record.dto';
import { BorrowRecordService } from './borrow-record.service';
import { BorrowRecord } from './borrow-record.entity'
import { BorrowRecordPublicDto } from './dto/borrow-record-public.dto';
import { BorrowRecordMapper } from './borrow-record.mapper';
import { ParseRelationsPipe } from 'src/common/queryPipes/parseRelations.pipe';

@Controller('borrow-records')
export class BorrowRecordController {
    constructor(private readonly borrowRecordService: BorrowRecordService) {}

    // CREATE
    @Post()
    async create(
        @Body() createBorrowRecordDto: CreateBorrowRecordDto
    ): Promise<string> {
        const borrowRecord = await this.borrowRecordService.create(createBorrowRecordDto);
        return borrowRecord.borrowRecordId;
    }

    // READ ALL
    @Get()
    async findAll(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<BorrowRecordPublicDto[]> {
        const borrowRecords = await this.borrowRecordService.findAll(relations);
        return borrowRecords.map(borrowRecord => BorrowRecordMapper.toBorrowRecordPublicDto(borrowRecord));
    }

    // READ ONE
    @Get(':id')
    async findOneById(
        @Param('id') id: string,
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<BorrowRecordPublicDto | null> {
        const borrowRecord = await this.borrowRecordService.findOneById(id, relations);
        return borrowRecord ? BorrowRecordMapper.toBorrowRecordPublicDto(borrowRecord) : null;
    }

    // UPDATE
    @Put(':id')
    async updateOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[],
        @Body() updateBorrowRecordDto: UpdateBorrowRecordDto
    ): Promise<boolean> {
        const res = await this.borrowRecordService.updateOneById(id, updateBorrowRecordDto);
        return res;
    }

    // DELETE
    @Delete(':id')
    async removeOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<boolean> {
        const res = await this.borrowRecordService.removeOneById(id);
        return res;
    }
}
