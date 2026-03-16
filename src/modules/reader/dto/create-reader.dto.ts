import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsAlpha, IsArray, IsDefined } from 'class-validator';
import { UserGender } from 'src/common/enums/user/userGender.enum';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { UserStatus } from 'src/common/enums/user/userStatus.enum';
import { IsPresent } from 'src/common/validators/isPresent.validator';
import { IsStringOrNull } from 'src/common/validators/isStringOrNull.validator';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class CreateReaderDto extends CreateUserDto {
    @IsOptional()
    @IsStringOrNull()
    address: string | null;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readingCardIds: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    borrowRecordIds: string[];
}