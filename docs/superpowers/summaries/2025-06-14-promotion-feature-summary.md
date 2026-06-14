# Promotion Feature Implementation Summary

## Overview
Implemented a promotion system for reading cards that allows admins to create time-based discounts and extended borrowing limits. Promotions can apply to new card registrations, renewals, and retroactively to existing active cards.

---

## New Files Created

### 1. Enum: DiscountType
**File:** `src/common/enums/promotion/discountType.enum.ts`
```typescript
export enum DiscountType {
    Percentage = 'Percentage',
    FixedAmount = 'FixedAmount',
}
```

### 2. Entity: Promotion
**File:** `src/modules/promotion/promotion.entity.ts`

Fields:
- `promotionId` (UUID, primary key)
- `name` (string)
- `description` (text, nullable)
- `discountType` (DiscountType enum)
- `discountValue` (int)
- `maxBorrowedBooksOverride` (int, nullable)
- `maxBorrowDurationOverride` (int, nullable)
- `applicableCardTypes` (ReadingCardType[])
- `applicableAgeMin` (int)
- `applicableAgeMax` (int)
- `startDate` (date)
- `endDate` (date)
- `isActive` (boolean)
- `priority` (int)
- `createdAt`, `updatedAt` (timestamps)

### 3. DTOs
**File:** `src/modules/promotion/dto/create-promotion.dto.ts`
- Input validation for creating promotions

**File:** `src/modules/promotion/dto/update-promotion.dto.ts`
- PartialType of CreatePromotionDto

**File:** `src/modules/promotion/dto/promotion-public.dto.ts`
- Public response DTO with @Expose decorators

### 4. Mapper: PromotionMapper
**File:** `src/modules/promotion/promotion.mapper.ts`

Methods:
- `createFromDto(dto)` → Promotion entity
- `updateFromDto(entity, dto)` → updates entity in place
- `toPromotionPublicDto(entity)` → PromotionPublicDto using plainToInstance

### 5. Service: PromotionService
**File:** `src/modules/promotion/promotion.service.ts`

Key methods:
- `create(dto)` - Create new promotion
- `findActivePromotions()` - Get all currently active promotions
- `findBestPromotion(cardType, dateOfBirth, activationDate)` - Find best matching promotion for a reader
- `selectBestPromotion(promotions)` - Sort by discount value then extended limits
- `applyPromotionToCard(promotion, cardType)` - Calculate discounted price and effective limits
- `activatePromotion(promotionId)` - Retroactively apply promotion to all matching cards
- `deactivatePromotion(promotionId)` - Revert cards to default values
- `getAffectedCards(promotionId)` - Preview which cards would be affected

### 6. Controller: PromotionController
**File:** `src/modules/promotion/promotion.controller.ts`

Endpoints:
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/promotions` | Admin | Create promotion |
| GET | `/promotions` | Admin | List all promotions |
| GET | `/promotions/active` | Public | List active promotions |
| GET | `/promotions/:id` | Public | Get promotion details |
| GET | `/promotions/:id/affected-cards` | Admin | Preview affected cards |
| PATCH | `/promotions/:id` | Admin | Update promotion |
| DELETE | `/promotions/:id` | Admin | Delete promotion |
| POST | `/promotions/:id/activate` | Admin | Activate promotion |
| POST | `/promotions/:id/deactivate` | Admin | Deactivate promotion |

### 7. Module: PromotionModule
**File:** `src/modules/promotion/promotion.module.ts`
- Imports: TypeOrmModule (Promotion), forwardRef(ReadingCardModule), forwardRef(ReaderModule)
- Exports: PromotionService

---

## Files Modified

### 1. User Entity
**File:** `src/modules/user/user.entity.ts`

**Added:**
```typescript
@Column({ type: 'date', nullable: true, default: null })
@Type(() => Date)
dateOfBirth: Date | null;
```

### 2. ReadingCard Entity
**File:** `src/modules/reading-card/reading-card.entity.ts`

**Added imports:**
```typescript
import { Promotion } from '../promotion/promotion.entity';
import { ManyToOne, JoinColumn } from 'typeorm';
```

**Added fields:**
```typescript
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

### 3. ReadingCard Module
**File:** `src/modules/reading-card/reading-card.module.ts`

**Added import:**
```typescript
import { PromotionModule } from '../promotion/promotion.module';
```

**Added to imports array:**
```typescript
forwardRef(() => PromotionModule),
```

### 4. ReadingCard Service
**File:** `src/modules/reading-card/reading-card.service.ts`

**Added imports:**
```typescript
import { Inject, forwardRef } from '@nestjs/common';
import { PromotionService } from '../promotion/promotion.service';
```

**Added to constructor:**
```typescript
@Inject(forwardRef(() => PromotionService))
private readonly promotionService: PromotionService,
```

**Updated create method** to auto-apply best promotion:
- Loads reader with user relation to get dateOfBirth
- Calls `promotionService.findBestPromotion()` to find best matching promotion
- Calls `promotionService.applyPromotionToCard()` to calculate discounted price and effective limits
- Sets all promotion fields on the reading card

### 5. App Module
**File:** `src/app.module.ts`

**Added import:**
```typescript
import { PromotionModule } from './modules/promotion/promotion.module';
```

**Added to imports array:**
```typescript
PromotionModule,
```

---

## Database Schema Changes

```sql
-- Add dateOfBirth to users
ALTER TABLE users ADD COLUMN date_of_birth DATE;

-- Create promotions table
CREATE TABLE promotions (
    promotion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL,
    discount_value INT NOT NULL,
    max_borrowed_books_override INT,
    max_borrow_duration_override INT,
    applicable_card_types VARCHAR(50)[],
    applicable_age_min INT NOT NULL,
    applicable_age_max INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add promotion fields to reading_cards
ALTER TABLE reading_cards ADD COLUMN original_price INT NOT NULL;
ALTER TABLE reading_cards ADD COLUMN discounted_price INT NOT NULL;
ALTER TABLE reading_cards ADD COLUMN effective_max_borrowed_books INT NOT NULL;
ALTER TABLE reading_cards ADD COLUMN effective_max_borrow_duration_days INT NOT NULL;
ALTER TABLE reading_cards ADD COLUMN applied_promotion_id UUID REFERENCES promotions(promotion_id);
```

---

## Acceptance Criteria

- [x] Admin can create a promotion with percentage or fixed discount
- [x] Admin can set eligibility by card type and age range
- [x] Admin can set extended borrow limits (optional)
- [x] New card registration auto-applies best matching promotion
- [x] Card renewal auto-applies best matching promotion
- [x] Activating promotion applies to all matching existing cards
- [x] Deactivating promotion reverts all affected cards to default
- [x] Reader can view active promotions without authentication
- [x] Age is calculated from dateOfBirth at time of card registration
- [x] If no promotion matches, use default config values

---

## File Summary

| Category | Count |
|----------|-------|
| New files created | 7 |
| Files modified | 5 |
| Commits | 20 |

### New Files
1. `src/common/enums/promotion/discountType.enum.ts`
2. `src/modules/promotion/promotion.entity.ts`
3. `src/modules/promotion/promotion.mapper.ts`
4. `src/modules/promotion/promotion.service.ts`
5. `src/modules/promotion/promotion.controller.ts`
6. `src/modules/promotion/promotion.module.ts`
7. `src/modules/promotion/dto/*.dto.ts` (3 files)

### Modified Files
1. `src/modules/user/user.entity.ts`
2. `src/modules/reading-card/reading-card.entity.ts`
3. `src/modules/reading-card/reading-card.module.ts`
4. `src/modules/reading-card/reading-card.service.ts`
5. `src/app.module.ts`