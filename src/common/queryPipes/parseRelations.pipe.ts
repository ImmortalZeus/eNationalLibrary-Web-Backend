import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParseRelationsPipe implements PipeTransform {
    transform(value: string | string[] | undefined): string[] {
        if (!value) return [];                // nothing passed -> []
        if (Array.isArray(value)) return value; // ?relations=profile&relations=roles
        return value.split(',');              // ?relations=profile,roles
    }
}
