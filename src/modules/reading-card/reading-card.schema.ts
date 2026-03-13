import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { ReadingCardType } from 'src/common/enums/readingCard/readingCardType.enum';

@Schema()
export class ReadingCard {
    @Prop({ type: String, required: true, unique: true, immutable: true })
    readingCardId: string;

    @Prop({ type: String, required: true, unique: true })
    label: string;

    @Prop({ type: String, required: true, enum: ReadingCardType })
    type: ReadingCardType;

    @Prop({ type: Date, required: true })
    activationDate: Date;
    
    @Prop({ type: Date, required: true })
    expiryDate: Date;

    constructor({
        readingCardId,
        label,
        type,
        activationDate,
        expiryDate,
    }: {
        readingCardId: string,
        label: string,
        type: ReadingCardType,
        activationDate: Date,
        expiryDate: Date,
    }) {
        this.readingCardId = readingCardId;
        this.label = label;
        this.type = type;
        this.activationDate = activationDate;
        this.expiryDate = expiryDate;
    }
}

export type ReadingCardDocument = HydratedDocument<ReadingCard>;
export const ReadingCardSchema = SchemaFactory.createForClass(ReadingCard);
