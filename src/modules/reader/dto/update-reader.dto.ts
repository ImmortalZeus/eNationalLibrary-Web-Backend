import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateReaderDto } from './create-reader.dto';
import { IsPresent } from 'src/common/validators/isPresent.validator';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

export class UpdateReaderDto extends PartialType(
    OmitType(CreateReaderDto, ['user'] as const)
) {

    @IsOptional()
    @Type(() => UpdateUserDto)
    user: UpdateUserDto
}