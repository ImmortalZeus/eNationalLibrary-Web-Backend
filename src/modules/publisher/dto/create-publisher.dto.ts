import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray } from 'class-validator';

export class CreatePublisherDto {
    @IsString()
    publisherId: string;

    @IsString()
    name: string;

    @IsString()
    description: string;
}