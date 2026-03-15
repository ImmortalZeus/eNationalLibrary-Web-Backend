import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';

export class AuthorPublicDto {
    @Expose()
    authorId: string;

    @Expose()
    name: string;

    @Expose()
    dateOfBirth: Date;

    @Expose()
    dateOfDeath: Date | null;

    @Expose()
    description: string;
}