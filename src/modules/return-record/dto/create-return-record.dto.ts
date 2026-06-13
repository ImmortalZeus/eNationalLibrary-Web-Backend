import { IsString, IsEmail, IsEnum, MinLength, IsOptional, IsDate, IsDefined, IsDateString, IsInt } from 'class-validator';
import { IsDateStringOrNull } from 'src/common/validators/isDateStringOrNull.validator';
import { IsPresent } from 'src/common/validators/isPresent.validator';

export class CreateReturnRecordDto {
    @IsPresent()
    @IsInt()
    quantity: number;

    @IsPresent()
    @IsDateString()
    borrowDate: string;

    @IsPresent()
    @IsDateString()
    dueDate: string;

    @IsPresent()
    @IsDateString()
    actualReturnDate: string;

    @IsOptional()
    @IsString()
    readerId: string;

    @IsOptional()
    @IsString()
    bookId: string;
}