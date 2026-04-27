import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsPresent } from 'src/common/validators/isPresent.validator';
import { IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(
    OmitType(CreateUserDto, [] as const)
) {
    // @IsPresent()
    // @IsString()
    // userId: string;
}
