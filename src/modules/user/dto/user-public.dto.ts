import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';
import { UserGender } from 'src/common/enums/user/userGender.enum';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { UserStatus } from 'src/common/enums/user/userStatus.enum';

export class UserPublicDto {
    @Expose()
    userId: string;

    @Expose()
    username: string;

    @Expose()
    gender: UserGender;

    @Expose()
    email: string;

    @Expose()
    phoneNumber: string | null;

    @Expose()
    role: UserRole;

    @Expose()
    status: UserStatus;
}