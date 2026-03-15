import { Author } from './author.entity';
import { AuthorPublicDto } from './dto/author-public.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { plainToInstance } from 'class-transformer';

export class AuthorMapper {
    static createFromDto(dto: CreateAuthorDto): Author {
        const author = new Author();

        author.authorId = dto.authorId;
        author.name = dto.name;
        author.dateOfBirth = dto.dateOfBirth;
        author.dateOfDeath = dto.dateOfDeath;
        author.description = dto.description;

        return author;
    }

    static updateFromDto(author: Author, dto: UpdateAuthorDto): Author {
        author.name = dto.name === undefined ? author.name : dto.name;
        author.dateOfBirth = dto.dateOfBirth === undefined ? author.dateOfBirth : dto.dateOfBirth;
        author.dateOfDeath = dto.dateOfDeath === undefined ? author.dateOfDeath : dto.dateOfDeath;
        author.description = dto.description === undefined ? author.description : dto.description;

        return author;
    }

    static toAuthorPublicDto(author: Author): AuthorPublicDto {
        return plainToInstance(AuthorPublicDto, { ...author }, {
            excludeExtraneousValues: true,
        });
    }
}