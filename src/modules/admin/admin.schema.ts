import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { UserGender } from 'src/common/enums/user/userGender.enum';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { UserStatus } from 'src/common/enums/user/userStatus.enum';
import { User } from '../user/user.schema';

@Schema()
export class Admin extends User {
    constructor({
        userId,
        username,
        gender,
        email,
        passwordHash,
        phoneNumber = null,
        role = UserRole.Admin,
        status = UserStatus.Active
    }: {
        userId: string,
        username: string,
        gender: UserGender,
        email: string,
        passwordHash: string,
        phoneNumber: string | null,
        role: UserRole.Admin,
        status: UserStatus
    }) {
        super({ userId, username, gender, email, passwordHash, phoneNumber, role, status });
    }
}

export type AdminDocument = HydratedDocument<Admin>;
export const AdminSchema = SchemaFactory.createForClass(Admin);
