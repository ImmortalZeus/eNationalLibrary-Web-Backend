import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray, IsDefined } from 'class-validator';
import { IsPresent } from 'src/common/validators/isPresent.validator';

export class CreateBookDto {
    @IsPresent()
    @IsString()
    bookId: string;

    @IsPresent()
    @IsString()
    title: string;

    @IsPresent()
    @IsArray()
    @IsString({ each: true })
    authorIds: string[];

    @IsPresent()
    @IsString()
    description: string;

    @IsPresent()
    @IsString()
    publisherId: string;

    @IsPresent()
    @IsArray()
    @IsString({ each: true })
    genreIds: string[];

    @IsPresent()
    @IsString()
    previewUrl: string;
}