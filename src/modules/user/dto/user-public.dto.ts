import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';
import { UserGender } from 'src/common/enums/user/userGender.enum';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { UserStatus } from 'src/common/enums/user/userStatus.enum';

export class UserPublicDto {
    userId: string;

    username: string;

    gender: UserGender;

    email: string;

    phoneNumber?: string | null;

    role: UserRole;

    status: UserStatus;
}