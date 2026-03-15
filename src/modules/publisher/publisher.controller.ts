import { Body, Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PublisherService } from './publisher.service';
import { Publisher } from './publisher.entity'
import { PublisherPublicDto } from './dto/publisher-public.dto';

@Controller('publishers')
export class PublisherController {
    constructor(private readonly publisherService: PublisherService) {}

    // CREATE
    @Post()
    async create(@Body() createPublisherDto: CreatePublisherDto): Promise<PublisherPublicDto> {
        return this.publisherService.create(createPublisherDto);
    }

    // READ ALL
    @Get()
    async findAll(): Promise<PublisherPublicDto[]> {
        return this.publisherService.findAll();
    }

    // READ ONE
    @Get(':id')
    async findOneById(@Param('id') id: string): Promise<PublisherPublicDto | null> {
        return this.publisherService.findOneById(id);
    }

    // UPDATE
    @Put(':id')
    async updateOneById(@Param('id') id: string, @Body() updatePublisherDto: UpdatePublisherDto): Promise<PublisherPublicDto | null> {
        return this.publisherService.updateOneById(id, updatePublisherDto);
    }

    // DELETE
    @Delete(':id')
    async removeOneById(@Param('id') id: string): Promise<PublisherPublicDto | null> {
        return this.publisherService.removeOneById(id);
    }
}
