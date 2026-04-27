import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAuthorDto } from './create-author.dto';
import { IsPresent } from 'src/common/validators/isPresent.validator';
import { IsString } from 'class-validator';

export class UpdateAuthorDto extends PartialType(
    OmitType(CreateAuthorDto, [] as const)
) {
    // @IsPresent()
    // @IsString()
    // authorId: string;
}
