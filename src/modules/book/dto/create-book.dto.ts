import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray } from 'class-validator';

export class CreateBookDto {
    @IsString()
    bookId: string;

    @IsString()
    title: string;

    @IsArray()
    @IsString({ each: true })
    authorIds: string[];

    @IsString()
    description: string;

    @IsString()
    publisherId: string;

    @IsArray()
    @IsString({ each: true })
    categoryIds: string[];

    @IsString()
    previewUrl: string;
}