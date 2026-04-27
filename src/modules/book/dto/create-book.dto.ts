import { Type } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray, IsDefined, ValidateNested } from 'class-validator';
import { IsPresent } from 'src/common/validators/isPresent.validator';
import { Author } from 'src/modules/author/author.entity';
import { CreateAuthorDto } from 'src/modules/author/dto/create-author.dto';
import { CreateGenreDto } from 'src/modules/genre/dto/create-genre.dto';
import { Genre } from 'src/modules/genre/genre.entity';
import { CreatePublisherDto } from 'src/modules/publisher/dto/create-publisher.dto';
import { Publisher } from 'src/modules/publisher/publisher.entity';

export class CreateBookDto {
    @IsPresent()
    @IsString()
    title: string;

    @IsPresent()
    @IsString()
    description: string;

    @IsPresent()
    @IsString()
    previewUrl: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    authorIds?: string[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAuthorDto)
    newAuthors?: CreateAuthorDto[]

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    publisherIds?: string[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePublisherDto)
    newPublishers?: CreatePublisherDto[]

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    genreIds?: string[]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateGenreDto)
    newGenres?: CreateGenreDto[]
}