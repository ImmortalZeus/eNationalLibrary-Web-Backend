import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    categoryId: string;

    @IsString()
    label: string;

    @IsString()
    description: string;
}