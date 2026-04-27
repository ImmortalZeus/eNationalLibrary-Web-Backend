import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsArray } from 'class-validator';
import { UserGender } from 'src/common/enums/user/userGender.enum';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { UserStatus } from 'src/common/enums/user/userStatus.enum';
import { UserPublicDto } from 'src/modules/user/dto/user-public.dto';

export class AdminPublicDto {
    @Expose()
    userId: string;

    @Expose()
    user?: UserPublicDto;
}