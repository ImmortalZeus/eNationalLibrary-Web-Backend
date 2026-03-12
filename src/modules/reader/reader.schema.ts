// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { UserGender } from 'src/common/enums/user/userGender.enum';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { UserStatus } from 'src/common/enums/user/userStatus.enum';
import { User } from '../user/user.schema';

@Schema()
export class Reader extends User {
    @Prop({ type: String, required: false, default: null })
    address: string | null;

    @Prop({ type: [String], required: true, default: [] })
    readingCardIds: string[];

    @Prop({ type: [String], required: true, default: [] })
    borrowRecordIds: string[];

    constructor({
        userId,
        username,
        gender,
        email,
        passwordHash,
        phoneNumber = null,
        role = UserRole.Reader,
        status = UserStatus.Active,
        address = null,
        readingCardIds = [],
        borrowRecordIds = [],
    }: {
        userId: string,
        username: string,
        gender: UserGender,
        email: string,
        passwordHash: string,
        phoneNumber: string | null,
        role: UserRole.Reader,
        status: UserStatus,
        address: string | null,
        readingCardIds: string[],
        borrowRecordIds: string[]
    }) {
        super({ userId, username, gender, email, passwordHash, phoneNumber, role, status });
        this.address = address;
        this.readingCardIds = readingCardIds;
        this.borrowRecordIds = borrowRecordIds;
    }
}

export type ReaderDocument = HydratedDocument<Reader>;
export const ReaderSchema = SchemaFactory.createForClass(Reader);
