# Promotion Feature Design

## Overview

Implement a promotion system for reading cards that allows admins to create time-based discounts and extended borrowing limits. Promotions can apply to new card registrations, renewals, and retroactively to existing active cards.

## Requirements

1. **Discount Types**: Percentage (%) or Fixed Amount ($)
2. **Extended Benefits**: Override maxBorrowedBooks and maxBorrowDurationDays
3. **Eligibility**: Based on card type (Normal/VIP) and reader age range
4. **Application**:
   - Auto-apply best matching promotion when registering/renewing
   - Retroactive apply when activating promotion
   - Revert to default when deactivating

## Data Model

### Promotion Entity

| Field | Type | Description |
|-------|------|-------------|
| `promotionId` | UUID | Primary key |
| `name` | string | Promotion name (e.g., "Summer Sale 2025") |
| `description` | string | Description |
| `discountType` | enum | `Percentage` or `FixedAmount` |
| `discountValue` | number | 20 for 20%, 50 for $50 |
| `maxBorrowedBooksOverride` | number \| null | Override card limit, null = use default |
| `maxBorrowDurationOverride` | number \| null | Override duration days |
| `applicableCardTypes` | enum[] | `['Normal']`, `['VIP']`, `['Normal', 'VIP']` |
| `applicableAgeMin` | number | Minimum age to qualify |
| `applicableAgeMax` | number | Maximum age to qualify |
| `startDate` | Date | Promotion start |
| `endDate` | Date | Promotion end |
| `isActive` | boolean | Enable/disable manually |
| `priority` | number | For tie-breaking (reserved) |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

### Updated: User Entity

| Field | Type | Description |
|-------|------|-------------|
| `dateOfBirth` | Date \| null | For age calculation |

### Updated: ReadingCard Entity

| Field | Type | Description |
|-------|------|-------------|
| `originalPrice` | int | Price before promotion (from config) |
| `discountedPrice` | int | Final price after promotion |
| `effectiveMaxBorrowedBooks` | int | Actual borrow limit applied |
| `effectiveMaxBorrowDurationDays` | int | Actual duration applied |
| `appliedPromotionId` | UUID \| null | FK to Promotion |

## Logic Flow

### Auto-Apply Promotion (New/Renew Card)

```
1. Get reader's age from dateOfBirth at activationDate → calculate age
2. Find ALL active promotions where:
   - now >= startDate AND now <= endDate
   - cardType in applicableCardTypes
   - age >= applicableAgeMin AND age <= applicableAgeMax
3. If no match → use default config values
4. If multiple match → sort by:
   - Higher discount (percentage → fixed amount)
   - Then more extended limits (combined override benefit)
5. Apply best promotion:
   - originalPrice = config.price
   - discountedPrice = apply discount
   - effectiveMaxBorrowedBooks = override OR config value
   - effectiveMaxBorrowDurationDays = override OR config value
```

### Activate Promotion (Retroactive)

```
1. Admin calls POST /promotions/:id/activate
2. Find ALL active reading cards where:
   - card type matches applicableCardTypes
   - reader age falls within applicableAgeMin-AgeMax
3. For each matching card:
   - Apply promotion (same logic as new registration)
   - Update: discountedPrice, effectiveMaxBorrowedBooks, effectiveMaxBorrowDurationDays
   - Save appliedPromotionId
4. Update promotion: isActive = true
```

### Deactivate Promotion

```
1. Admin calls POST /promotions/:id/deactivate
2. Find all reading cards with this promotion applied
3. For each card:
   - Revert to default config values
   - Clear appliedPromotionId
4. Update promotion: isActive = false
```

### Discount Calculation

**Percentage:**
```
discountedPrice = originalPrice - (originalPrice * discountValue / 100)
```

**Fixed Amount:**
```
discountedPrice = max(0, originalPrice - discountValue)
```

## API Endpoints

### PromotionModule

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/promotions` | Admin | List all promotions |
| GET | `/promotions/active` | Public | List active promotions |
| GET | `/promotions/:id` | Public | Get promotion details |
| GET | `/promotions/:id/affected-cards` | Admin | Preview affected cards |
| POST | `/promotions` | Admin | Create promotion |
| PATCH | `/promotions/:id` | Admin | Update promotion |
| DELETE | `/promotions/:id` | Admin | Delete promotion |
| POST | `/promotions/:id/activate` | Admin | Activate promotion |
| POST | `/promotions/:id/deactivate` | Admin | Deactivate promotion |

### ReadingCardModule Changes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reading-cards` | Auto-applies best promotion |

## Acceptance Criteria

1. Admin can create a promotion with percentage or fixed discount
2. Admin can set eligibility by card type and age range
3. Admin can set extended borrow limits (optional)
4. New card registration auto-applies best matching promotion
5. Card renewal auto-applies best matching promotion
6. Activating promotion applies to all matching existing cards
7. Deactivating promotion reverts all affected cards to default
8. Reader can view active promotions without authentication
9. Age is calculated from dateOfBirth at time of card registration
10. If no promotion matches, use default config values (original price, default limits)

## File Structure

```
src/modules/promotion/
├── promotion.entity.ts
├── promotion.module.ts
├── promotion.service.ts
├── promotion.controller.ts
├── dto/
│   ├── create-promotion.dto.ts
│   ├── update-promotion.dto.ts
│   └── promotion-public.dto.ts
└── promotion.mapper.ts
```

## Database Migration

```sql
-- Add dateOfBirth to users
ALTER TABLE users ADD COLUMN date_of_birth DATE;

-- Create promotions table
CREATE TABLE promotions (
    promotion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- 'Percentage' or 'FixedAmount'
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