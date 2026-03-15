import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray, IsDate } from 'class-validator';

export class CreateAuthorDto {
    @IsString()
    authorId: string;

    @IsString()
    name: string;

    @IsDate()
    dateOfBirth: Date;

    @IsDate()
    dateOfDeath: Date | null;

    @IsString()
    description: string;
}