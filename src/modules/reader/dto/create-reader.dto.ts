import { Type } from 'class-transformer';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsAlpha, IsArray, IsDefined, ValidateNested } from 'class-validator';
import { UserGender } from 'src/common/enums/user/userGender.enum';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { UserStatus } from 'src/common/enums/user/userStatus.enum';
import { IsPresent } from 'src/common/validators/isPresent.validator';
import { IsStringOrNull } from 'src/common/validators/isStringOrNull.validator';
import { Book } from 'src/modules/book/book.entity';
import { BorrowRecord } from 'src/modules/borrow-record/borrow-record.entity';
import { ReadingCard } from 'src/modules/reading-card/reading-card.entity';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class CreateReaderDto {
    @IsOptional()
    @IsStringOrNull()
    address?: string | null;

    @IsPresent()
    @Type(() => CreateUserDto)
    user: CreateUserDto
}