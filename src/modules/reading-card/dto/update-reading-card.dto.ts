import { PartialType } from '@nestjs/mapped-types';
import { CreateReadingCardDto } from './create-reading-card.dto';

export class UpdateReadingCardDto extends PartialType(CreateReadingCardDto) {}
