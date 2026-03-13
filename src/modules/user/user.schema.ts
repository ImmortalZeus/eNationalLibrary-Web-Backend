import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { UserGender } from 'src/common/enums/user/userGender.enum';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { UserStatus } from 'src/common/enums/user/userStatus.enum';

@Schema()
export class User {
    @Prop({ type: String, required: true, unique: true, immutable: true })
    userId: string;

    @Prop({ type: String, required: true, unique: true })
    username: string;

    @Prop({ type: String, required: true, enum: UserGender })
    gender: UserGender;

    @Prop({ type: String, required: true })
    email: string;
    
    @Prop({ type: String, required: true, unique: true })
    passwordHash: string;

    @Prop({ type: String, required: false, default: null })
    phoneNumber: string | null;

    @Prop({ type: String, required: true, enum: UserRole, default: UserRole.Reader })
    role: UserRole;

    @Prop({ type: String, required: true, status: UserStatus, default: UserStatus.Active })
    status: UserStatus;

    constructor({
        userId,
        username,
        gender,
        email,
        passwordHash,
        phoneNumber = null,
        role = UserRole.Reader,
        status = UserStatus.Active
    }: {
        userId: string,
        username: string,
        gender: UserGender,
        email: string,
        passwordHash: string,
        phoneNumber: string | null,
        role: UserRole,
        status: UserStatus
    }) {
        this.userId = userId;
        this.username = username;
        this.gender = gender;
        this.email = email;
        this.passwordHash = passwordHash;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.status = status;
    }
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
