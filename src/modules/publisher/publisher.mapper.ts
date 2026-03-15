import { Publisher } from './publisher.entity';
import { PublisherPublicDto } from './dto/publisher-public.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { plainToInstance } from 'class-transformer';

export class PublisherMapper {
    static createFromDto(dto: CreatePublisherDto): Publisher {
        const publisher = new Publisher();

        publisher.publisherId = dto.publisherId;
        publisher.name = dto.name;
        publisher.description = dto.description;

        return publisher;
    }

    static updateFromDto(publisher: Publisher, dto: UpdatePublisherDto): Publisher {
        publisher.name = dto.name === undefined ? publisher.name : dto.name;
        publisher.description = dto.description === undefined ? publisher.description : dto.description;

        return publisher;
    }

    static toPublisherPublicDto(publisher: Publisher): PublisherPublicDto {
        return plainToInstance(PublisherPublicDto, { ...publisher }, {
            excludeExtraneousValues: true,
        });
    }
}