import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePublisherDto } from './create-publisher.dto';
import { IsPresent } from 'src/common/validators/isPresent.validator';
import { IsString } from 'class-validator';

export class UpdatePublisherDto extends PartialType(
    OmitType(CreatePublisherDto, [] as const)
) {
    // @IsPresent()
    // @IsString()
    // publisherId: string;

}
