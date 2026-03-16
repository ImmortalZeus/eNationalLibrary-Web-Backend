import { ReadingCard } from './reading-card.entity';
import { ReadingCardPublicDto } from './dto/reading-card-public.dto';
import { UpdateReadingCardDto } from './dto/update-reading-card.dto';
import { CreateReadingCardDto } from './dto/create-reading-card.dto';
import { plainToInstance } from 'class-transformer';
import { ReadingCardConfig } from 'src/common/configs/readingCard.config';

export class ReadingCardMapper {
    static createFromDto(dto: CreateReadingCardDto): ReadingCard {
        const readingCard = new ReadingCard();

        readingCard.readingCardId = dto.readingCardId;
        readingCard.label = dto.label;
        readingCard.type = dto.type;

        const tmpActivationDate = dto.activationDate;
        readingCard.activationDate = new Date(tmpActivationDate);

        const tmpExpiryDate = dto.expiryDate;
        readingCard.expiryDate = tmpExpiryDate ? new Date(tmpExpiryDate) : new Date(readingCard.activationDate.getTime() + ReadingCardConfig[readingCard.type].cardValidityDays * 24 * 60 * 60 * 1000);
        
        return readingCard;
    }

    static updateFromDto(readingCard: ReadingCard, dto: UpdateReadingCardDto): ReadingCard {
        readingCard.label = dto.label === undefined ? readingCard.label : dto.label;;
        readingCard.type = dto.type === undefined ? readingCard.type : dto.type;
        
        const tmpActivationDate = dto.activationDate === undefined ? readingCard.activationDate : dto.activationDate;
        readingCard.activationDate = new Date(tmpActivationDate);

        const tmpExpiryDate = dto.expiryDate === undefined ? readingCard.expiryDate : dto.expiryDate;
        readingCard.expiryDate = tmpExpiryDate ? new Date(tmpExpiryDate) : new Date(readingCard.activationDate.getTime() + ReadingCardConfig[readingCard.type].cardValidityDays * 24 * 60 * 60 * 1000);

        return readingCard;
    }

    static toReadingCardPublicDto(readingCard: ReadingCard): ReadingCardPublicDto {
        return plainToInstance(ReadingCardPublicDto, { ...readingCard }, {
            excludeExtraneousValues: true,
        });
    }
}