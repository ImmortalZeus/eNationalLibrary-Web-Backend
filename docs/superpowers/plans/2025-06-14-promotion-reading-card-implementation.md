# Promotion Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a promotion system for reading cards that allows admins to create time-based discounts and extended borrowing limits with retroactive application.

**Architecture:** Create new PromotionModule following existing module patterns (entity → service → controller → DTOs → mapper). Extend User and ReadingCard entities with promotion-related fields. Auto-apply best matching promotion on card creation/renewal and activation.

**Tech Stack:** NestJS, TypeORM, PostgreSQL

---

## File Structure

### New Files to Create
- `src/modules/promotion/promotion.entity.ts`
- `src/modules/promotion/promotion.module.ts`
- `src/modules/promotion/promotion.service.ts`
- `src/modules/promotion/promotion.controller.ts`
- `src/modules/promotion/promotion.mapper.ts`
- `src/modules/promotion/dto/create-promotion.dto.ts`
- `src/modules/promotion/dto/update-promotion.dto.ts`
- `src/modules/promotion/dto/promotion-public.dto.ts`
- `src/common/enums/promotion/discountType.enum.ts`

### Files to Modify
- `src/modules/user/user.entity.ts` - add dateOfBirth field
- `src/modules/user/user.module.ts` - import PromotionModule
- `src/modules/reading-card/reading-card.entity.ts` - add promotion fields
- `src/modules/reading-card/reading-card.module.ts` - import PromotionModule
- `src/modules/reading-card/reading-card.service.ts` - auto-apply promotion logic
- `src/app.module.ts` - import PromotionModule

---

## Tasks

### Task 1: Add dateOfBirth to User Entity

**Files:**
- Modify: `src/modules/user/user.entity.ts`

- [ ] **Step 1: Add dateOfBirth field to User entity**

```typescript
// In user.entity.ts, add import:
import { Type } from 'class-transformer';

// Add after phoneNumber field:
@Column({ type: 'date', nullable: true, default: null })
@Type(() => Date)
dateOfBirth: Date | null;
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/user/user.entity.ts
git commit -m "feat: add dateOfBirth field to User entity"
```

---

### Task 2: Create DiscountType Enum

**Files:**
- Create: `src/common/enums/promotion/discountType.enum.ts`

- [ ] **Step 1: Create discount type enum**

```typescript
// src/common/enums/promotion/discountType.enum.ts
export enum DiscountType {
    Percentage = 'Percentage',
    FixedAmount = 'FixedAmount',
}
```

- [ ] **Step 2: Commit**

```bash
git add src/common/enums/promotion/discountType.enum.ts
git commit -m "feat: add DiscountType enum for promotions"
```

---

### Task 3: Create Promotion Entity

**Files:**
- Create: `src/modules/promotion/promotion.entity.ts`

- [ ] **Step 1: Create Promotion entity**

```typescript
// src/modules/promotion/promotion.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DiscountType } from 'src/common/enums/promotion/discountType.enum';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';

@Entity({ name: 'promotions' })
export class Promotion {
    @PrimaryGeneratedColumn('uuid')
    promotionId: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true, default: null })
    description: string | null;

    @Column({ type: 'varchar', nullable: false })
    discountType: DiscountType;

    @Column({ type: 'int', nullable: false })
    discountValue: number;

    @Column({ type: 'int', nullable: true, default: null })
    maxBorrowedBooksOverride: number | null;

    @Column({ type: 'int', nullable: true, default: null })
    maxBorrowDurationOverride: number | null;

    @Column({ type: 'varchar', array: true, nullable: false, default: '{Normal,VIP}' })
    applicableCardTypes: ReadingCardType[];

    @Column({ type: 'int', nullable: false })
    applicableAgeMin: number;

    @Column({ type: 'int', nullable: false })
    applicableAgeMax: number;

    @Column({ type: 'date', nullable: false })
    startDate: Date;

    @Column({ type: 'date', nullable: false })
    endDate: Date;

    @Column({ type: 'boolean', nullable: false, default: false })
    isActive: boolean;

    @Column({ type: 'int', nullable: false, default: 0 })
    priority: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/promotion/promotion.entity.ts
git commit -m "feat: create Promotion entity"
```

---

### Task 4: Create Promotion DTOs

**Files:**
- Create: `src/modules/promotion/dto/create-promotion.dto.ts`
- Create: `src/modules/promotion/dto/update-promotion.dto.ts`
- Create: `src/modules/promotion/dto/promotion-public.dto.ts`

- [ ] **Step 1: Create CreatePromotionDto**

```typescript
// src/modules/promotion/dto/create-promotion.dto.ts
import { IsString, IsEnum, IsInt, IsOptional, IsArray, Min, Max, IsDateString } from 'class-validator';
import { DiscountType } from 'src/common/enums/promotion/discountType.enum';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';

export class CreatePromotionDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(DiscountType)
    discountType: DiscountType;

    @IsInt()
    @Min(0)
    discountValue: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    maxBorrowedBooksOverride?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    maxBorrowDurationOverride?: number;

    @IsArray()
    @IsEnum(ReadingCardType, { each: true })
    applicableCardTypes: ReadingCardType[];

    @IsInt()
    @Min(0)
    applicableAgeMin: number;

    @IsInt()
    @Min(0)
    applicableAgeMax: number;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;
}
```

- [ ] **Step 2: Create UpdatePromotionDto**

```typescript
// src/modules/promotion/dto/update-promotion.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionDto } from './create-promotion.dto';

export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {}
```

- [ ] **Step 3: Create PromotionPublicDto**

```typescript
// src/modules/promotion/dto/promotion-public.dto.ts
import { DiscountType } from 'src/common/enums/promotion/discountType.enum';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';

export class PromotionPublicDto {
    promotionId: string;
    name: string;
    description: string | null;
    discountType: DiscountType;
    discountValue: number;
    maxBorrowedBooksOverride: number | null;
    maxBorrowDurationOverride: number | null;
    applicableCardTypes: ReadingCardType[];
    applicableAgeMin: number;
    applicableAgeMax: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/modules/promotion/dto/
git commit -m "feat: create Promotion DTOs"
```

---

### Task 5: Create Promotion Mapper

**Files:**
- Create: `src/modules/promotion/promotion.mapper.ts`

- [ ] **Step 1: Create PromotionMapper**

```typescript
// src/modules/promotion/promotion.mapper.ts
import { Promotion } from './promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionPublicDto } from './dto/promotion-public.dto';

export class PromotionMapper {
    static createFromDto(dto: CreatePromotionDto): Promotion {
        const promotion = new Promotion();
        promotion.name = dto.name;
        promotion.description = dto.description || null;
        promotion.discountType = dto.discountType;
        promotion.discountValue = dto.discountValue;
        promotion.maxBorrowedBooksOverride = dto.maxBorrowedBooksOverride || null;
        promotion.maxBorrowDurationOverride = dto.maxBorrowDurationOverride || null;
        promotion.applicableCardTypes = dto.applicableCardTypes;
        promotion.applicableAgeMin = dto.applicableAgeMin;
        promotion.applicableAgeMax = dto.applicableAgeMax;
        promotion.startDate = new Date(dto.startDate);
        promotion.endDate = new Date(dto.endDate);
        promotion.isActive = false;
        promotion.priority = dto.maxBorrowedBooksOverride ? 1 : 0;
        return promotion;
    }

    static updateFromDto(promotion: Promotion, dto: UpdatePromotionDto): void {
        if (dto.name !== undefined) promotion.name = dto.name;
        if (dto.description !== undefined) promotion.description = dto.description;
        if (dto.discountType !== undefined) promotion.discountType = dto.discountType;
        if (dto.discountValue !== undefined) promotion.discountValue = dto.discountValue;
        if (dto.maxBorrowedBooksOverride !== undefined) promotion.maxBorrowedBooksOverride = dto.maxBorrowedBooksOverride;
        if (dto.maxBorrowDurationOverride !== undefined) promotion.maxBorrowDurationOverride = dto.maxBorrowDurationOverride;
        if (dto.applicableCardTypes !== undefined) promotion.applicableCardTypes = dto.applicableCardTypes;
        if (dto.applicableAgeMin !== undefined) promotion.applicableAgeMin = dto.applicableAgeMin;
        if (dto.applicableAgeMax !== undefined) promotion.applicableAgeMax = dto.applicableAgeMax;
        if (dto.startDate !== undefined) promotion.startDate = new Date(dto.startDate);
        if (dto.endDate !== undefined) promotion.endDate = new Date(dto.endDate);
        if (dto.priority !== undefined) promotion.priority = dto.priority;
    }

    static toPromotionPublicDto(promotion: Promotion): PromotionPublicDto {
        return {
            promotionId: promotion.promotionId,
            name: promotion.name,
            description: promotion.description,
            discountType: promotion.discountType,
            discountValue: promotion.discountValue,
            maxBorrowedBooksOverride: promotion.maxBorrowedBooksOverride,
            maxBorrowDurationOverride: promotion.maxBorrowDurationOverride,
            applicableCardTypes: promotion.applicableCardTypes,
            applicableAgeMin: promotion.applicableAgeMin,
            applicableAgeMax: promotion.applicableAgeMax,
            startDate: promotion.startDate,
            endDate: promotion.endDate,
            isActive: promotion.isActive,
            priority: promotion.priority,
            createdAt: promotion.createdAt,
            updatedAt: promotion.updatedAt,
        };
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/promotion/promotion.mapper.ts
git commit -m "feat: create PromotionMapper"
```

---

### Task 6: Create Promotion Service

**Files:**
- Create: `src/modules/promotion/promotion.service.ts`

- [ ] **Step 1: Create PromotionService with core methods**

```typescript
// src/modules/promotion/promotion.service.ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/promotion/promotion.service.ts
git commit -m "feat: create PromotionService with auto-apply and activate/deactivate logic"
```

---

### Task 7: Create Promotion Controller

**Files:**
- Create: `src/modules/promotion/promotion.controller.ts`

- [ ] **Step 1: Create PromotionController**

```typescript
// src/modules/promotion/promotion.controller.ts
import { Body, Controller, Param, Get, Post, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionService } from './promotion.service';
import { Promotion } from './promotion.entity';
import { PromotionPublicDto } from './dto/promotion-public.dto';
import { PromotionMapper } from './promotion.mapper';
import { ParseRelationsPipe } from 'src/common/queryPipes/parseRelations.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { Roles } from '../auth/roles.decorator';

@Controller('promotions')
export class PromotionController {
    constructor(private readonly promotionService: PromotionService) {}

    // CREATE
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Post()
    async create(
        @Body() createPromotionDto: CreatePromotionDto
    ): Promise<string> {
        const promotion = await this.promotionService.create(createPromotionDto);
        return promotion.promotionId;
    }

    // READ ALL (admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Get()
    async findAll(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<PromotionPublicDto[]> {
        const promotions = await this.promotionService.findAll(relations);
        return promotions.map(p => PromotionMapper.toPromotionPublicDto(p));
    }

    // READ ACTIVE (public)
    @Get('active')
    async findActive(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<PromotionPublicDto[]> {
        const promotions = await this.promotionService.findActivePromotions(relations);
        return promotions.map(p => PromotionMapper.toPromotionPublicDto(p));
    }

    // READ ONE
    @Get(':id')
    async findOneById(
        @Param('id') id: string,
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<PromotionPublicDto | null> {
        const promotion = await this.promotionService.findOneById(id, relations);
        return promotion ? PromotionMapper.toPromotionPublicDto(promotion) : null;
    }

    // GET AFFECTED CARDS PREVIEW
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Get(':id/affected-cards')
    async getAffectedCards(
        @Param('id') id: string
    ): Promise<{ count: number }> {
        const cards = await this.promotionService.getAffectedCards(id);
        return { count: cards.length };
    }

    // UPDATE
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Patch(':id')
    async updateOneById(
        @Param('id') id: string,
        @Body() updatePromotionDto: UpdatePromotionDto
    ): Promise<boolean> {
        return await this.promotionService.updateOneById(id, updatePromotionDto);
    }

    // DELETE
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Delete(':id')
    async removeOneById(
        @Param('id') id: string
    ): Promise<boolean> {
        return await this.promotionService.removeOneById(id);
    }

    // ACTIVATE
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Post(':id/activate')
    async activate(
        @Param('id') id: string
    ): Promise<boolean> {
        return await this.promotionService.activatePromotion(id);
    }

    // DEACTIVATE
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Post(':id/deactivate')
    async deactivate(
        @Param('id') id: string
    ): Promise<boolean> {
        return await this.promotionService.deactivatePromotion(id);
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/promotion/promotion.controller.ts
git commit -m "feat: create PromotionController with CRUD and activate/deactivate endpoints"
```

---

### Task 8: Create Promotion Module

**Files:**
- Create: `src/modules/promotion/promotion.module.ts`

- [ ] **Step 1: Create PromotionModule**

```typescript
// src/modules/promotion/promotion.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './promotion.entity';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { ReadingCardModule } from '../reading-card/reading-card.module';
import { ReaderModule } from '../reader/reader.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Promotion]),
        forwardRef(() => ReadingCardModule),
        forwardRef(() => ReaderModule),
    ],
    controllers: [PromotionController],
    providers: [PromotionService],
    exports: [PromotionService]
})
export class PromotionModule {}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/promotion/promotion.module.ts
git commit -m "feat: create PromotionModule"
```

---

### Task 9: Update ReadingCard Entity with Promotion Fields

**Files:**
- Modify: `src/modules/reading-card/reading-card.entity.ts`

- [ ] **Step 1: Add promotion fields to ReadingCard entity**

```typescript
// Add imports at top
import { Promotion } from '../promotion/promotion.entity';
import { ManyToOne, JoinColumn } from 'typeorm';

// Add after reader field:
@ManyToOne(() => Promotion, { eager: false, nullable: true })
@JoinColumn({ name: 'applied_promotion_id' })
appliedPromotion: Promotion | null;

@Column({ type: 'int', nullable: false })
originalPrice: number;

@Column({ type: 'int', nullable: false })
discountedPrice: number;

@Column({ type: 'int', nullable: false })
effectiveMaxBorrowedBooks: number;

@Column({ type: 'int', nullable: false })
effectiveMaxBorrowDurationDays: number;
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/reading-card/reading-card.entity.ts
git commit -m "feat: add promotion fields to ReadingCard entity"
```

---

### Task 10: Update ReadingCard Module

**Files:**
- Modify: `src/modules/reading-card/reading-card.module.ts`

- [ ] **Step 1: Import PromotionModule in ReadingCardModule**

```typescript
// Add import
import { forwardRef, Module } from '@nestjs/common';
import { PromotionModule } from '../promotion/promotion.module';

// Add to imports array
TypeOrmModule.forFeature([ReadingCard]),
forwardRef(() => ReaderModule),
forwardRef(() => PromotionModule),  // Add this
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/reading-card/reading-card.module.ts
git commit -m "feat: import PromotionModule in ReadingCardModule"
```

---

### Task 11: Update ReadingCard Service for Auto-Apply

**Files:**
- Modify: `src/modules/reading-card/reading-card.service.ts`

- [ ] **Step 1: Update create method to auto-apply promotion**

```typescript
// Add import at top
import { Inject, forwardRef } from '@nestjs/common';
import { PromotionService } from '../promotion/promotion.service';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';
import { ReadingCardConfig } from 'src/common/configs/readingCard.config';

// Add to constructor
@Inject(forwardRef(() => PromotionService))
private readonly promotionService: PromotionService,

// Update create method
async create(dto: CreateReadingCardDto): Promise<ReadingCard> {        
    const readingCard = await ReadingCardMapper.createFromDto(dto);

    if(dto.readerId) {
        const reader = await this.readerService.findOneById(dto.readerId, ['user']);
        if(reader) {
            readingCard.reader = reader;
        } else {
            throw new NotFoundException(`Reader with id ${dto.readerId} not found`);
        }
    }
    
    // Auto-apply best promotion
    const activationDate = readingCard.activationDate || new Date();
    const cardType = readingCard.type;
    const dateOfBirth = reader?.user?.dateOfBirth || null;
    
    const bestPromotion = await this.promotionService.findBestPromotion(
        cardType,
        dateOfBirth,
        activationDate,
    );
    
    const result = this.promotionService.applyPromotionToCard(bestPromotion, cardType);
    readingCard.originalPrice = result.originalPrice;
    readingCard.discountedPrice = result.discountedPrice;
    readingCard.effectiveMaxBorrowedBooks = result.effectiveMaxBorrowedBooks;
    readingCard.effectiveMaxBorrowDurationDays = result.effectiveMaxBorrowDurationDays;
    readingCard.appliedPromotion = bestPromotion;
    
    const saved = await this.save(readingCard);
    
    return saved;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/reading-card/reading-card.service.ts
git commit -m "feat: auto-apply promotion when creating reading card"
```

---

### Task 12: Update App Module

**Files:**
- Modify: `src/app.module.ts`

- [ ] **Step 1: Import PromotionModule**

```typescript
// Add import
import { PromotionModule } from './modules/promotion/promotion.module';

// Add to imports array
PromotionModule,
```

- [ ] **Step 2: Commit**

```bash
git add src/app.module.ts
git commit -m "feat: import PromotionModule in AppModule"
```

---

### Task 13: Verify and Test

**Files:**
- Verify all files compile

- [ ] **Step 1: Check TypeScript compilation**

```bash
cd D:/study_materials/2025.2/IT3180E-Introduction_to_Software_Engineering/eNationalLibrary/backend
npm run build
```

Expected: No errors

- [ ] **Step 2: Commit final**

```bash
git add -A
git commit -m "feat: implement promotion feature for reading cards"
```

---

## Acceptance Criteria Checklist

- [ ] Admin can create a promotion with percentage or fixed discount
- [ ] Admin can set eligibility by card type and age range
- [ ] Admin can set extended borrow limits (optional)
- [ ] New card registration auto-applies best matching promotion
- [ ] Card renewal auto-applies best matching promotion
- [ ] Activating promotion applies to all matching existing cards
- [ ] Deactivating promotion reverts all affected cards to default
- [ ] Reader can view active promotions without authentication
- [ ] Age is calculated from dateOfBirth at time of card registration
- [ ] If no promotion matches, use default config values