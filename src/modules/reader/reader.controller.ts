import { Body, Controller, Param, Get, Post, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { ReaderService } from './reader.service';
import { Reader } from './reader.entity';
import { ReaderPublicDto } from './dto/reader-public.dto';
import { ReaderMapper } from './reader.mapper';
import { ParseRelationsPipe } from 'src/common/queryPipes/parseRelations.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('readers')
export class ReaderController {
    constructor(private readonly readerService: ReaderService) {}

    // CREATE
    @Post()
    async create(@Body() createReaderDto: CreateReaderDto): Promise<string> {
    console.log("Creating reader with dto:", JSON.stringify(createReaderDto));
    const reader = await this.readerService.create(createReaderDto);
    console.log("Created reader with userId:", reader.userId);
    return reader.userId;
    }

    // READ ALL
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Get()
    async findAll(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<ReaderPublicDto[]> {
        const readers = await this.readerService.findAll(relations);
        return readers.map(reader => ReaderMapper.toReaderPublicDto(reader));
    }

    // READ ONE
    @UseGuards(JwtAuthGuard)
    @Get(':id')
async findOneById(@Param('id') id: string, @Query('relations', ParseRelationsPipe) relations: string[]): Promise<ReaderPublicDto | null> {
    const reader = await this.readerService.findOneById(id, relations);
    return reader ? ReaderMapper.toReaderPublicDto(reader) : null;
}

    // UPDATE
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async removeOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<boolean> {
        const res = await this.readerService.removeOneById(id);
        return res;
    }
}
