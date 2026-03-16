import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray, IsDefined } from 'class-validator';
import { IsPresent } from 'src/common/validators/isPresent.validator';

export class CreateCategoryDto {
    @IsPresent()
    @IsString()
    categoryId: string;

    @IsPresent()
    @IsString()
    label: string;

    @IsPresent()
    @IsString()
    description: string;
}