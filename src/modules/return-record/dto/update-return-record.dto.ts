import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateReturnRecordDto } from './create-return-record.dto';
import { IsPresent } from 'src/common/validators/isPresent.validator';
import { IsString } from 'class-validator';

export class UpdateReturnRecordDto extends PartialType(
    OmitType(CreateReturnRecordDto, ['returnRecordId'] as const)
) {
    // No additional fields for now, but you can add any update-specific fields here if needed
    // @IsPresent()
    // @IsString()
    // returnRecordId: string;
}