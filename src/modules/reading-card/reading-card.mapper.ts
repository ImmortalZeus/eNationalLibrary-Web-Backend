import { ReadingCard } from './reading-card.entity';
import { ReadingCardPublicDto } from './dto/reading-card-public.dto';
import { UpdateReadingCardDto } from './dto/update-reading-card.dto';
import { CreateReadingCardDto } from './dto/create-reading-card.dto';
import { plainToInstance } from 'class-transformer';
import { ReadingCardConfig } from 'src/common/configs/readingCard.config';
import { ReaderMapper } from '../reader/reader.mapper';
import { PromotionMapper } from '../promotion/promotion.mapper';

export class ReadingCardMapper {
    // eslint-disable-next-line @typescript-eslint/require-await
    static async createFromDto(dto: CreateReadingCardDto): Promise<ReadingCard> {
        const readingCard = new ReadingCard();

        readingCard.label = dto.label;
        readingCard.type = dto.type;
        readingCard.activationDate = new Date(dto.activationDate);
        readingCard.expiryDate = dto.expiryDate ? new Date(dto.expiryDate) : new Date(readingCard.activationDate.getTime() + ReadingCardConfig[readingCard.type].cardValidityDays * 24 * 60 * 60 * 1000);
        
        return readingCard;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    static async updateFromDto(readingCard: ReadingCard, dto: UpdateReadingCardDto): Promise<ReadingCard> {
        readingCard.label = dto.label ? dto.label : readingCard.label;
        readingCard.type = dto.type ? dto.type : readingCard.type;
        readingCard.activationDate = dto.activationDate ? new Date(dto.activationDate) : readingCard.activationDate;
        readingCard.expiryDate = dto.expiryDate ? new Date(dto.expiryDate) : (!dto.activationDate ? readingCard.expiryDate : new Date(readingCard.activationDate.getTime() + ReadingCardConfig[readingCard.type].cardValidityDays * 24 * 60 * 60 * 1000));

        return readingCard;
    }

    static toReadingCardPublicDto(readingCard: ReadingCard): ReadingCardPublicDto {
        return plainToInstance(ReadingCardPublicDto, {
                ...readingCard,
                reader: readingCard.reader ? ReaderMapper.toReaderPublicDto(readingCard.reader) : undefined,
                appliedPromotion: readingCard.appliedPromotion ? PromotionMapper.toPromotionPublicDto(readingCard.appliedPromotion) : null,
            }, {
            excludeExtraneousValues: true,
        });
    }
}