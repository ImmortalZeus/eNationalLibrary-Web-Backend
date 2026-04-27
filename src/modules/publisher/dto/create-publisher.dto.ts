import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray, IsDefined } from 'class-validator';
import { IsPresent } from 'src/common/validators/isPresent.validator';

export class CreatePublisherDto {
    @IsPresent()
    @IsString()
    name: string;

    @IsPresent()
    @IsString()
    description: string;
}