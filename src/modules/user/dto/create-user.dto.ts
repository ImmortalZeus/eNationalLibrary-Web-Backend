import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';
import { UserGender } from 'src/common/enums/user/userGender.enum';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { UserStatus } from 'src/common/enums/user/userStatus.enum';
import { IsPresent } from 'src/common/validators/isPresent.validator';
import { IsStringOrNull } from 'src/common/validators/isStringOrNull.validator';

export class CreateUserDto {
    @IsPresent()
    @IsString()
    username: string;

    @IsPresent()
    @IsEnum(UserGender)
    gender: UserGender;

    @IsPresent()
    @IsEmail()
    email: string;

    @IsPresent()
    @IsString()
    @MinLength(8)
    password: string;   

    @IsOptional()
    @IsStringOrNull()
    phoneNumber?: string | null;

    @IsPresent()
    @IsEnum(UserRole)
    role: UserRole;

    @IsPresent()
    @IsEnum(UserStatus)
    status: UserStatus;
}