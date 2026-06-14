import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Promotion } from './promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionMapper } from './promotion.mapper';
import { ReadingCardService } from '../reading-card/reading-card.service';
import { ReaderService } from '../reader/reader.service';
import { User } from '../user/user.entity';
import { ReadingCard } from '../reading-card/reading-card.entity';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';
import { ReadingCardConfig } from 'src/common/configs/readingCard.config';

@Injectable()
export class PromotionService {
    constructor(
        @InjectRepository(Promotion)
        private readonly promotionRepo: Repository<Promotion>,

        @Inject(forwardRef(() => ReadingCardService))
        private readonly readingCardService: ReadingCardService,

        @Inject(forwardRef(() => ReaderService))
        private readonly readerService: ReaderService,
    ) {}

    async create(dto: CreatePromotionDto): Promise<Promotion> {
        const promotion = PromotionMapper.createFromDto(dto);
        return await this.save(promotion);
    }

    async findOneById(promotionId: string, relations: string[] = []): Promise<Promotion | null> {
        return this.promotionRepo.findOne({ where: { promotionId }, relations });
    }

    async findOneByOptions(options: FindOptionsWhere<Promotion>, relations: string[]): Promise<Promotion | null> {
        return this.promotionRepo.findOne({ where: options, relations });
    }

    async findManyByOptions(options: FindOptionsWhere<Promotion>, relations: string[]): Promise<Promotion[]> {
        return this.promotionRepo.find({ where: options, relations });
    }

    async findAll(relations: string[] = []): Promise<Promotion[]> {
        return this.promotionRepo.find({ relations });
    }

    async findActivePromotions(relations: string[] = []): Promise<Promotion[]> {
        const now = new Date();
        return this.promotionRepo.find({
            where: {
                isActive: true,
                startDate: LessThanOrEqual(now),
                endDate: MoreThanOrEqual(now),
            },
            relations,
        });
    }

    async updateOneById(promotionId: string, dto: UpdatePromotionDto): Promise<boolean> {
        const promotion = await this.findOneById(promotionId, []);
        if (!promotion) return false;
        PromotionMapper.updateFromDto(promotion, dto);
        await this.save(promotion);
        return true;
    }

    async removeOneById(promotionId: string): Promise<boolean> {
        const promotion = await this.findOneById(promotionId, []);
        if (!promotion) return false;
        await this.promotionRepo.remove(promotion);
        return true;
    }

    async save(promotion: Promotion): Promise<Promotion> {
        return await this.promotionRepo.save(promotion);
    }

    async remove(promotion: Promotion): Promise<Promotion> {
        return await this.promotionRepo.remove(promotion);
    }

    // Calculate reader age from dateOfBirth at a specific date
    calculateAge(dateOfBirth: Date, referenceDate: Date): number {
        let age = referenceDate.getFullYear() - dateOfBirth.getFullYear();
        const monthDiff = referenceDate.getMonth() - dateOfBirth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < dateOfBirth.getDate())) {
            age--;
        }
        return age;
    }

    // Find best matching promotion for a reader
    async findBestPromotion(
        cardType: ReadingCardType,
        dateOfBirth: Date | null,
        activationDate: Date,
    ): Promise<Promotion | null> {
        const activePromotions = await this.findActivePromotions([]);

        if (!dateOfBirth) {
            // No dateOfBirth, filter by card type only
            const matchingPromotions = activePromotions.filter(p =>
                p.applicableCardTypes.includes(cardType)
            );
            return this.selectBestPromotion(matchingPromotions);
        }

        const readerAge = this.calculateAge(dateOfBirth, activationDate);

        const matchingPromotions = activePromotions.filter(p =>
            p.applicableCardTypes.includes(cardType) &&
            readerAge >= p.applicableAgeMin &&
            readerAge <= p.applicableAgeMax
        );

        return this.selectBestPromotion(matchingPromotions);
    }

    // Select best promotion based on discount and extended limits
    private selectBestPromotion(promotions: Promotion[]): Promotion | null {
        if (promotions.length === 0) return null;

        // Sort by: higher discount first, then more extended limits
        return promotions.sort((a, b) => {
            // Compare discount value (percentage wins over fixed)
            const aDiscountScore = a.discountType === 'Percentage' ? a.discountValue * 100 : a.discountValue;
            const bDiscountScore = b.discountType === 'Percentage' ? b.discountValue * 100 : b.discountValue;

            if (bDiscountScore !== aDiscountScore) {
                return bDiscountScore - aDiscountScore;
            }

            // If same discount, compare extended limits benefit
            const aLimitBenefit = (a.maxBorrowedBooksOverride || 0) + (a.maxBorrowDurationOverride || 0);
            const bLimitBenefit = (b.maxBorrowedBooksOverride || 0) + (b.maxBorrowDurationOverride || 0);
            return bLimitBenefit - aLimitBenefit;
        })[0];
    }

    // Apply promotion to a reading card
    applyPromotionToCard(promotion: Promotion | null, cardType: ReadingCardType): {
        originalPrice: number;
        discountedPrice: number;
        effectiveMaxBorrowedBooks: number;
        effectiveMaxBorrowDurationDays: number;
    } {
        const config = ReadingCardConfig[cardType];
        const originalPrice = config.price;
        const defaultMaxBorrowedBooks = config.maxBorrowedBooks;
        const defaultMaxBorrowDurationDays = config.maxBorrowDurationDays;

        if (!promotion) {
            return {
                originalPrice,
                discountedPrice: originalPrice,
                effectiveMaxBorrowedBooks: defaultMaxBorrowedBooks,
                effectiveMaxBorrowDurationDays: defaultMaxBorrowDurationDays,
            };
        }

        // Calculate discounted price
        let discountedPrice: number;
        if (promotion.discountType === 'Percentage') {
            discountedPrice = originalPrice - Math.floor(originalPrice * promotion.discountValue / 100);
        } else {
            discountedPrice = Math.max(0, originalPrice - promotion.discountValue);
        }

        return {
            originalPrice,
            discountedPrice,
            effectiveMaxBorrowedBooks: promotion.maxBorrowedBooksOverride || defaultMaxBorrowedBooks,
            effectiveMaxBorrowDurationDays: promotion.maxBorrowDurationOverride || defaultMaxBorrowDurationDays,
        };
    }

    // Activate promotion (retroactive apply)
    async activatePromotion(promotionId: string): Promise<boolean> {
        const promotion = await this.findOneById(promotionId, []);
        if (!promotion) return false;

        // Get all active reading cards
        const allCards = await this.readingCardService.findManyByOptions({}, ['reader', 'reader.user']);

        // Filter and apply to matching cards
        for (const card of allCards) {
            if (!card.reader || !card.reader.user) continue;

            const cardType = card.type;
            const dateOfBirth = card.reader.user.dateOfBirth;
            const activationDate = card.activationDate;

            // Check if promotion applies
            if (!promotion.applicableCardTypes.includes(cardType)) continue;

            if (dateOfBirth) {
                const readerAge = this.calculateAge(dateOfBirth, activationDate);
                if (readerAge < promotion.applicableAgeMin || readerAge > promotion.applicableAgeMax) continue;
            }

            // Apply promotion
            const result = this.applyPromotionToCard(promotion, cardType);
            card.originalPrice = result.originalPrice;
            card.discountedPrice = result.discountedPrice;
            card.effectiveMaxBorrowedBooks = result.effectiveMaxBorrowedBooks;
            card.effectiveMaxBorrowDurationDays = result.effectiveMaxBorrowDurationDays;
            card.appliedPromotion = promotion;

            await this.readingCardService.save(card);
        }

        promotion.isActive = true;
        await this.save(promotion);
        return true;
    }

    // Deactivate promotion (revert cards)
    async deactivatePromotion(promotionId: string): Promise<boolean> {
        const promotion = await this.findOneById(promotionId, []);
        if (!promotion) return false;

        // Find all cards with this promotion applied
        const cardsWithPromotion = await this.readingCardService.findManyByOptions(
            { appliedPromotion: promotion },
            []
        );

        // Revert each card to default
        for (const card of cardsWithPromotion) {
            const result = this.applyPromotionToCard(null, card.type);
            card.originalPrice = result.originalPrice;
            card.discountedPrice = result.discountedPrice;
            card.effectiveMaxBorrowedBooks = result.effectiveMaxBorrowedBooks;
            card.effectiveMaxBorrowDurationDays = result.effectiveMaxBorrowDurationDays;
            card.appliedPromotion = null;

            await this.readingCardService.save(card);
        }

        promotion.isActive = false;
        await this.save(promotion);
        return true;
    }

    // Get affected cards preview
    async getAffectedCards(promotionId: string): Promise<ReadingCard[]> {
        const promotion = await this.findOneById(promotionId, []);
        if (!promotion) return [];

        const allCards = await this.readingCardService.findManyByOptions({}, ['reader', 'reader.user']);

        return allCards.filter(card => {
            if (!card.reader || !card.reader.user) return false;

            const cardType = card.type;
            const dateOfBirth = card.reader.user.dateOfBirth;

            if (!promotion.applicableCardTypes.includes(cardType)) return false;

            if (dateOfBirth) {
                const readerAge = this.calculateAge(dateOfBirth, card.activationDate);
                if (readerAge < promotion.applicableAgeMin || readerAge > promotion.applicableAgeMax) return false;
            }

            return true;
        });
    }
}
