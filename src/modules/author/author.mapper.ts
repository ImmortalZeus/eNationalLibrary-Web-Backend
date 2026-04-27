import { Author } from './author.entity';
import { AuthorPublicDto } from './dto/author-public.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../book/book.entity';
import { In, Repository } from 'typeorm';
import { BookService } from '../book/book.service';
import { BadRequestException } from '@nestjs/common';
import { BookMapper } from '../book/book.mapper';

export class AuthorMapper {
    @InjectRepository(Book)
    private static readonly bookService: BookService;
    
    // eslint-disable-next-line @typescript-eslint/require-await
    static async createFromDto(dto: CreateAuthorDto): Promise<Author> {
        const author = new Author();

        author.name = dto.name;
        author.dateOfBirth = new Date(dto.dateOfBirth);
        author.dateOfDeath = dto.dateOfDeath == null ? null : (!dto.dateOfDeath ? null : new Date(dto.dateOfDeath));
        author.description = dto.description;

        return author;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    static async updateFromDto(author: Author, dto: UpdateAuthorDto): Promise<Author> {
        author.name = dto.name ? dto.name : author.name;
        author.dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : author.dateOfBirth;
        author.dateOfDeath = dto.dateOfDeath == null ? null : (!dto.dateOfDeath ? author.dateOfDeath : new Date(dto.dateOfDeath));
        author.description = dto.description ? dto.description : author.description;

        return author;
    }
    
    static toAuthorPublicDto(author: Author): AuthorPublicDto {
        return plainToInstance(AuthorPublicDto, {
                ...author,
                books: author.books ? author.books.map(b => BookMapper.toBookPublicDto(b)) : undefined
            }, {
            excludeExtraneousValues: true,
        });
    }
}