import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateGenreDto } from './create-genre.dto';
import { IsPresent } from 'src/common/validators/isPresent.validator';
import { IsString } from 'class-validator';

export class UpdateGenreDto extends PartialType(
    OmitType(CreateGenreDto, [] as const)
) {
    // @IsPresent()
    // @IsString()
    // genreId: string;
}
