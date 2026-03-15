import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';

export class CategoryPublicDto {
    @Expose()
    categoryId: string;

    @Expose()
    label: string;

    @Expose()
    description: string;
}