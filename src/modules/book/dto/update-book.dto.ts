import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { IsPresent } from 'src/common/validators/isPresent.validator';
import { IsString } from 'class-validator';

export class UpdateBookDto extends PartialType(
    OmitType(CreateBookDto, [] as const)
) {
    // @IsPresent()
    // @IsString()
    // bookId: string;
}
