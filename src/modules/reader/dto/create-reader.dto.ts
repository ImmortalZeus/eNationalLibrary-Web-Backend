import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsAlpha, IsArray } from 'class-validator';
import { UserGender } from 'src/common/enums/user/userGender.enum';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { UserStatus } from 'src/common/enums/user/userStatus.enum';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class CreateReaderDto extends CreateUserDto {
    @IsOptional()
    @IsString()
    address?: string | null;

    @IsArray()
    @IsString({ each: true })
    readingCardIds: string[];

    @IsArray()
    @IsString({ each: true })
    borrowRecordIds: string[];
}