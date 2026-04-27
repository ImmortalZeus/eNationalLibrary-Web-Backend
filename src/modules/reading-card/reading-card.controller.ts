import { Body, Controller, Param, Get, Post, Put, Delete, Query } from '@nestjs/common';
import { CreateReadingCardDto } from './dto/create-reading-card.dto';
import { UpdateReadingCardDto } from './dto/update-reading-card.dto';
import { ReadingCardService } from './reading-card.service';
import { ReadingCard } from './reading-card.entity'
import { ReadingCardPublicDto } from './dto/reading-card-public.dto';
import { ReadingCardMapper } from './reading-card.mapper';
import { ParseRelationsPipe } from 'src/common/queryPipes/parseRelations.pipe';

@Controller('reading-cards')
export class ReadingCardController {
    constructor(private readonly readingCardService: ReadingCardService) {}

    // CREATE
    @Post()
    async create(
        @Body() createReadingCardDto: CreateReadingCardDto
    ): Promise<string> {
        const readingCard = await this.readingCardService.create(createReadingCardDto);
        // return ReadingCardMapper.toReadingCardPublicDto(readingCard);
        return readingCard.readingCardId;
    }

    // READ ALL
    @Get()
    async findAll(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<ReadingCardPublicDto[]> {
        const readingCards = await this.readingCardService.findAll(relations);
        return readingCards.map(readingCard => ReadingCardMapper.toReadingCardPublicDto(readingCard));
    }

    // READ ONE
    @Get(':id')
    async findOneById(
        @Param('id') id: string,
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<ReadingCardPublicDto | null> {
        const readingCard = await this.readingCardService.findOneById(id, relations);
        return readingCard ? ReadingCardMapper.toReadingCardPublicDto(readingCard) : null;
    }

    // UPDATE
    @Put(':id')
    async updateOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[],
        @Body() updateReadingCardDto: UpdateReadingCardDto
    ): Promise<boolean> {
        const res = await this.readingCardService.updateOneById(id, updateReadingCardDto);
        return res
    }

    // DELETE
    @Delete(':id')
    async removeOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<boolean> {
        const res = await this.readingCardService.removeOneById(id);
        return res;
    }
}
