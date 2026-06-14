import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ReadingCard } from './reading-card.entity';
import { ReadingCardPublicDto } from './dto/reading-card-public.dto';
import { CreateReadingCardDto } from './dto/create-reading-card.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateReadingCardDto } from './dto/update-reading-card.dto';
import { ReadingCardMapper } from './reading-card.mapper';
import { ReaderService } from '../reader/reader.service';
import { PromotionService } from '../promotion/promotion.service';

@Injectable()
export class ReadingCardService {
    constructor(
    @InjectRepository(ReadingCard)
    private readonly readingCardRepo: Repository<ReadingCard>,

    @Inject(forwardRef(() => ReaderService))
    private readonly readerService: ReaderService,

    @Inject(forwardRef(() => PromotionService))
    private readonly promotionService: PromotionService,
    ) {}

    async create(dto: CreateReadingCardDto): Promise<ReadingCard> {
        const readingCard = await ReadingCardMapper.createFromDto(dto);

        if(dto.readerId) {
            const reader = await this.readerService.findOneById(dto.readerId, ['user']);
            if(reader) {
                readingCard.reader = reader;

                // Auto-apply promotion
                const activationDate = readingCard.activationDate;
                const cardType = readingCard.type;
                const dateOfBirth = reader.user?.dateOfBirth || null;

                const bestPromotion = await this.promotionService.findBestPromotion(
                    cardType,
                    dateOfBirth,
                    activationDate,
                );

                const pricing = this.promotionService.applyPromotionToCard(bestPromotion, cardType);

                readingCard.originalPrice = pricing.originalPrice;
                readingCard.discountedPrice = pricing.discountedPrice;
                readingCard.effectiveMaxBorrowedBooks = pricing.effectiveMaxBorrowedBooks;
                readingCard.effectiveMaxBorrowDurationDays = pricing.effectiveMaxBorrowDurationDays;
                readingCard.appliedPromotion = bestPromotion;
            } else {
                throw new NotFoundException(`Reader with id ${dto.readerId} not found`);
            }
        }

        const saved = await this.save(readingCard);

        return saved;
    }

    async findOneById(readingCardId: string | { readingCardId: string }, relations: string[]): Promise<ReadingCard | null> {
        const options = typeof readingCardId === "string" ? { readingCardId: readingCardId } : { readingCardId: readingCardId.readingCardId };
        return this.findOneByOptions(options, relations);
    }

    async findOneByOptions(options: FindOptionsWhere<ReadingCard>, relations: string[]): Promise<ReadingCard | null> {
        const readingCard = await this.readingCardRepo.findOne({ where: options, relations: relations });
        if(!readingCard) return null;
        return readingCard;
    }

    async findManyByOptions(options: FindOptionsWhere<ReadingCard>, relations: string[]): Promise<ReadingCard[]> {
        const readingCards = await this.readingCardRepo.find({ where: options, relations: relations });
        return readingCards;
    }

    async findAll(relations: string[]): Promise<ReadingCard[]> {
        return this.findManyByOptions({}, relations);
    }

    async updateOneById(readingCardId: string | { readingCardId: string }, dto: UpdateReadingCardDto): Promise<boolean> {
        const options = typeof readingCardId === "string" ? { readingCardId: readingCardId } : { readingCardId: readingCardId.readingCardId };
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<ReadingCard>, dto: UpdateReadingCardDto): Promise<boolean> {
        const readingCard = await this.findOneByOptions(options, []);
        if(!readingCard) return false;

        await ReadingCardMapper.updateFromDto(readingCard, dto);

        const saved = await this.save(readingCard);

        return true;
    }

    async updateManyByOptions(options: FindOptionsWhere<ReadingCard>, dto: UpdateReadingCardDto): Promise<boolean> {
        const readingCards = await this.findManyByOptions(options, []);
        
        for (const readingCard of readingCards) {
            await ReadingCardMapper.updateFromDto(readingCard, dto);
            await this.save(readingCard);
        }

        return true
    }

    async removeOneById(readingCardId: string | { readingCardId: string }): Promise<boolean> {
        const options = typeof readingCardId === "string" ? { readingCardId: readingCardId } : { readingCardId: readingCardId.readingCardId };
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<ReadingCard>): Promise<boolean> {
        const readingCard = await this.findOneByOptions(options, []);
        if (!readingCard) return false;
        await this.remove(readingCard);
        return true;
    }

    async removeManyByOptions(options: FindOptionsWhere<ReadingCard>): Promise<boolean> {
        const readingCards = await this.findManyByOptions(options, []);
        await this.removeMany(readingCards);
        return true;
    }

    async save(readingCard: ReadingCard): Promise<ReadingCard> {
        return await this.readingCardRepo.save(readingCard);
    }

    async remove(readingCard: ReadingCard): Promise<ReadingCard> {
        return await this.readingCardRepo.remove(readingCard);
    }

    async removeMany(readingCards: ReadingCard[]): Promise<ReadingCard[]> {
        return await this.readingCardRepo.remove(readingCards);
    }

    async addReadingCardReader(readingCardId: string | { readingCardId: string }, relations: string[], userId: string | { userId: string }): Promise<ReadingCard | null> {
        const readingCardOptions = typeof readingCardId === "string" ? { readingCardId: readingCardId } : { readingCardId: readingCardId.readingCardId };
        const readerOptions = typeof userId === "string" ? { userId: userId } : { userId: userId.userId };
        
        const readingCard = await this.findOneByOptions(readingCardOptions, []);
        if (!readingCard) return null;

        const reader = await this.readerService.findOneByOptions(readerOptions, []);
        if(!reader) return null;
        readingCard.reader = reader;
            
        await this.save(readingCard);

        return await this.findOneByOptions(readingCardOptions, relations);
    }

    async removeReadingCardReader(readingCardId: string | { readingCardId: string }, relations: string[]): Promise<ReadingCard | null> {
        const readingCardOptions = typeof readingCardId === "string" ? { readingCardId: readingCardId } : { readingCardId: readingCardId.readingCardId };
        
        const readingCard = await this.findOneByOptions(readingCardOptions, []);
        if (!readingCard) return null;

        readingCard.reader = null;

        await this.save(readingCard);

        return await this.findOneByOptions(readingCardOptions, relations);
    }
}