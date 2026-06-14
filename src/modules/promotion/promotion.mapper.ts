import { plainToInstance } from 'class-transformer';
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

    static updateFromDto(promotion: Promotion, dto: UpdatePromotionDto): Promotion {
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
        return promotion;
    }

    static toPromotionPublicDto(promotion: Promotion): PromotionPublicDto {
        return plainToInstance(PromotionPublicDto, promotion, {
            excludeExtraneousValues: true,
        });
    }
}
