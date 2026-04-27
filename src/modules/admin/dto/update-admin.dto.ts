import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsPresent } from 'src/common/validators/isPresent.validator';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

export class UpdateAdminDto extends PartialType(
    OmitType(CreateAdminDto, ['user'] as const)
) {
    @IsOptional()
    @Type(() => UpdateUserDto)
    user: UpdateUserDto
}
