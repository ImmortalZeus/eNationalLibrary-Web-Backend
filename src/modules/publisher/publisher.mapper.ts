import { Publisher } from './publisher.entity';
import { PublisherPublicDto } from './dto/publisher-public.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { plainToInstance } from 'class-transformer';
import { BookMapper } from '../book/book.mapper';

export class PublisherMapper {
    // eslint-disable-next-line @typescript-eslint/require-await
    static async createFromDto(dto: CreatePublisherDto): Promise<Publisher> {
        const publisher = new Publisher();

        publisher.name = dto.name;
        publisher.description = dto.description;

        return publisher;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    static async updateFromDto(publisher: Publisher, dto: UpdatePublisherDto): Promise<Publisher> {
        publisher.name = dto.name ? dto.name : publisher.name;
        publisher.description = dto.description ? dto.description : publisher.description;

        return publisher;
    }

    static toPublisherPublicDto(publisher: Publisher): PublisherPublicDto {
        return plainToInstance(PublisherPublicDto, {
                ...publisher,
                books: publisher.books ? publisher.books.map(b => BookMapper.toBookPublicDto(b)) : undefined
            }, {
            excludeExtraneousValues: true,
        });
    }
}