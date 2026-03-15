import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Author } from './author.entity';
import { AuthorPublicDto } from './dto/author-public.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorMapper } from './author.mapper';

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(Author)
        private readonly authorRepo: Repository<Author>,
    ) {}

    async create(dto: CreateAuthorDto): Promise<AuthorPublicDto> {
        const existing = await this.authorRepo.findOneBy({ authorId: dto.authorId });
        if (existing) {
            throw new ConflictException('authorId already exists');
        }

        const author = AuthorMapper.createFromDto(dto);

        const saved = await this.authorRepo.save(author);

        return AuthorMapper.toAuthorPublicDto(saved);
    }

    async findOneById(authorId: string | { authorId: string }): Promise<AuthorPublicDto | null> {
        const options = typeof authorId === "string" ? { authorId: authorId } : authorId;
        return this.findOneByOptions(options);
    }

    async findOneByOptions(options: FindOptionsWhere<Author>): Promise<AuthorPublicDto | null> {
        const author = await this.authorRepo.findOne({ where: options });
        if(!author) return null;
        return AuthorMapper.toAuthorPublicDto(author);
    }

    async findManyByOptions(options: FindOptionsWhere<Author>): Promise<AuthorPublicDto[]> {
        const authors = await this.authorRepo.find({ where: options });
        return authors.map(author => AuthorMapper.toAuthorPublicDto(author));
    }

    async findAll(): Promise<AuthorPublicDto[]> {
        return this.findManyByOptions({});
    }

    async updateOneById(authorId: string | { authorId: string }, dto: UpdateAuthorDto): Promise<AuthorPublicDto | null> {
        const options = typeof authorId === "string" ? { authorId: authorId } : authorId;
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<Author>, dto: UpdateAuthorDto): Promise<AuthorPublicDto | null> {
        const author = await this.authorRepo.findOne({ where: options });
        if(!author) return null;

        AuthorMapper.updateFromDto(author, dto);

        const saved = await this.authorRepo.save(author);

        return AuthorMapper.toAuthorPublicDto(saved);
    }

    async updateManyByOptions(options: FindOptionsWhere<Author>, dto: UpdateAuthorDto): Promise<AuthorPublicDto[]> {
        const authors = await this.authorRepo.find({ where: options });

        for (const author of authors) {
            AuthorMapper.updateFromDto(author, dto);
            await this.authorRepo.save(author);
        }

        return authors.map(author => AuthorMapper.toAuthorPublicDto(author));
    }

    async removeOneById(authorId: string | { authorId: string }): Promise<AuthorPublicDto | null> {
        const options = typeof authorId === "string" ? { authorId: authorId } : authorId;
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<Author>): Promise<AuthorPublicDto | null> {
        const author = await this.authorRepo.findOne({ where: options });
        if (!author) return null;
        await this.authorRepo.remove(author);
        return AuthorMapper.toAuthorPublicDto(author);
    }

    async removeManyByOptions(options: FindOptionsWhere<Author>): Promise<AuthorPublicDto[]> {
        const authors = await this.authorRepo.find({ where: options });
        await this.authorRepo.remove(authors);
        return authors.map(author => AuthorMapper.toAuthorPublicDto(author));
    }
}