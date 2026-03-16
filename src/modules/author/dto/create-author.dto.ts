import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray, IsDate, IsDefined, IsDateString } from 'class-validator';
import { IsDateOrNull } from 'src/common/validators/isDateOrNull.validator';
import { IsDateStringOrNull } from 'src/common/validators/isDateStringOrNull.validator';
import { IsPresent } from 'src/common/validators/isPresent.validator';

export class CreateAuthorDto {
    @IsPresent()
    @IsString()
    authorId: string;

    @IsPresent()
    @IsString()
    name: string;

    @IsPresent()
    @IsDateString()
    dateOfBirth: string;

    @IsOptional()
    @IsDateStringOrNull()
    dateOfDeath: string | null;

    @IsPresent()
    @IsString()
    description: string;
}