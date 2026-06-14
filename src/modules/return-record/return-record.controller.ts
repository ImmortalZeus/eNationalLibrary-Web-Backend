import { Body, Controller, Param, Get, Post, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { CreateReturnRecordDto } from './dto/create-return-record.dto';
import { UpdateReturnRecordDto } from './dto/update-return-record.dto';
import { ReturnRecordService } from './return-record.service';
import { ReturnRecord } from './return-record.entity'
import { ReturnRecordPublicDto } from './dto/return-record-public.dto';
import { ReturnRecordMapper } from './return-record.mapper';
import { ParseRelationsPipe } from 'src/common/queryPipes/parseRelations.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('return-records')
export class ReturnRecordController {
    constructor(private readonly returnRecordService: ReturnRecordService) {}

    // CREATE
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body() createReturnRecordDto: CreateReturnRecordDto
    ): Promise<string> {
        const returnRecord = await this.returnRecordService.create(createReturnRecordDto);
        return returnRecord.returnRecordId;
    }

    // READ ALL
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<ReturnRecordPublicDto[]> {
        const returnRecords = await this.returnRecordService.findAll(relations);
        return returnRecords.map(returnRecord => ReturnRecordMapper.toReturnRecordPublicDto(returnRecord));
    }

    // READ ONE
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOneById(
        @Param('id') id: string,
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<ReturnRecordPublicDto | null> {
        const returnRecord = await this.returnRecordService.findOneById(id, relations);
        return returnRecord ? ReturnRecordMapper.toReturnRecordPublicDto(returnRecord) : null;
    }

    // UPDATE
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[],
        @Body() updateReturnRecordDto: UpdateReturnRecordDto
    ): Promise<boolean> {
        const res = await this.returnRecordService.updateOneById(id, updateReturnRecordDto);
        return res;
    }

    // DELETE
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async removeOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<boolean> {
        const res = await this.returnRecordService.removeOneById(id);
        return res;
    }
}
