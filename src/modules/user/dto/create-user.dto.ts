import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';
import { UserGender } from 'src/common/enums/user/userGender.enum';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { UserStatus } from 'src/common/enums/user/userStatus.enum';

export class CreateUserDto {
    @IsString()
    userId: string;

    @IsString()
    username: string;

    @IsEnum(UserGender)
    gender: UserGender;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    passwordHash: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string | null;

    @IsEnum(UserRole)
    role: UserRole;

    @IsEnum(UserStatus)
    status: UserStatus;
}