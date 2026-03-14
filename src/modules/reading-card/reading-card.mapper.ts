import { ReadingCard } from './reading-card.entity';
import { ReadingCardPublicDto } from './dto/reading-card-public.dto';
import { UpdateReadingCardDto } from './dto/update-reading-card.dto';
import { CreateReadingCardDto } from './dto/create-reading-card.dto';
import { plainToInstance } from 'class-transformer';

export class ReadingCardMapper {
    static createFromDto(dto: CreateReadingCardDto): ReadingCard {
        const readingCard = new ReadingCard();

        readingCard.readingCardId = dto.readingCardId;
        readingCard.label = dto.label;
        readingCard.type = dto.type;
        readingCard.activationDate = dto.activationDate;
        readingCard.expiryDate = dto.expiryDate;

        return readingCard;
    }

    static updateFromDto(readingCard: ReadingCard, dto: UpdateReadingCardDto): ReadingCard {
        readingCard.label = dto.label === undefined ? readingCard.label : dto.label;;
        readingCard.type = dto.type === undefined ? readingCard.type : dto.type;
        readingCard.activationDate = dto.activationDate === undefined ? readingCard.activationDate : dto.activationDate;
        readingCard.expiryDate = dto.expiryDate === undefined ? readingCard.expiryDate : dto.expiryDate;

        return readingCard;
    }

    static toReadingCardPublicDto(readingCard: ReadingCard): ReadingCardPublicDto {
        return plainToInstance(ReadingCardPublicDto, { ...readingCard }, {
            excludeExtraneousValues: true,
        });
    }
}