import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBorrowRecordDto } from './create-borrow-record.dto';
import { IsPresent } from 'src/common/validators/isPresent.validator';
import { IsString } from 'class-validator';

export class UpdateBorrowRecordDto extends PartialType(
    OmitType(CreateBorrowRecordDto, ['readerId', 'bookId'] as const)
) {
    // @IsPresent()
    // @IsString()
    // borrowRecordId: string;
}
