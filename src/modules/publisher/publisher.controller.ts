import { Body, Controller, Param, Get, Post, Put, Delete, Query } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PublisherService } from './publisher.service';
import { Publisher } from './publisher.entity'
import { PublisherPublicDto } from './dto/publisher-public.dto';
import { PublisherMapper } from './publisher.mapper';
import { ParseRelationsPipe } from 'src/common/queryPipes/parseRelations.pipe';

@Controller('publishers')
export class PublisherController {
    constructor(private readonly publisherService: PublisherService) {}

    // CREATE
    @Post()
    async create(
        @Body() createPublisherDto: CreatePublisherDto
    ): Promise<string> {
        const publisher = await this.publisherService.create(createPublisherDto);
        return publisher.publisherId
    }

    // READ ALL
    @Get()
    async findAll(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<PublisherPublicDto[]> {
        const publishers = await this.publisherService.findAll(relations);
        return publishers.map(publisher => PublisherMapper.toPublisherPublicDto(publisher));
    }

    // READ ONE
    @Get(':id')
    async findOneById(
        @Param('id') id: string,
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<PublisherPublicDto | null> {
        const publisher = await this.publisherService.findOneById(id, relations);
        return publisher ? PublisherMapper.toPublisherPublicDto(publisher) : null;
    }

    // UPDATE
    @Put(':id')
    async updateOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[],
        @Body() updatePublisherDto: UpdatePublisherDto
    ): Promise<boolean> {
        const res = await this.publisherService.updateOneById(id, updatePublisherDto);
        return res;
    }

    // DELETE
    @Delete(':id')
    async removeOneById(
        @Param('id') id: string,
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<boolean> {
        const res = await this.publisherService.removeOneById(id);
        return res;
    }
}
