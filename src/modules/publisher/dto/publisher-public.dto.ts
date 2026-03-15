import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';

export class PublisherPublicDto {
    @Expose()
    publisherId: string;

    @Expose()
    name: string;

    @Expose()
    description: string;
}