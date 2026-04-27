import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateReadingCardDto } from './create-reading-card.dto';
import { IsPresent } from 'src/common/validators/isPresent.validator';
import { IsString } from 'class-validator';

export class UpdateReadingCardDto extends PartialType(
    OmitType(CreateReadingCardDto, ['readerId'] as const)
) {
    // @IsPresent()
    // @IsString()
    // readingCardId: string;
}
