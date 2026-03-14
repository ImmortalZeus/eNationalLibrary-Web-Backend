import { User } from '../user/user.entity';
import { Admin } from './admin.entity';
import { AdminPublicDto } from './dto/admin-public.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UserPublicDto } from '../user/dto/user-public.dto';
import { plainToInstance } from 'class-transformer';

export class AdminMapper {
    static createFromDto(dto: CreateAdminDto): Admin {
        const admin = new Admin();

        admin.userId = dto.userId;

        if (!admin.user) {
            admin.user = new User();
            admin.user.userId = dto.userId;
        }
        admin.user.username = dto.username;
        admin.user.gender = dto.gender;
        admin.user.email = dto.email;
        admin.user.passwordHash = dto.passwordHash;
        admin.user.phoneNumber = dto.phoneNumber;
        admin.user.role = dto.role;
        admin.user.status = dto.status;

        return admin;
    }

    static updateFromDto(admin: Admin, dto: UpdateAdminDto): Admin {
        if (!admin.user) {
            admin.user = new User();
            admin.user.userId = dto.userId === undefined ? admin.user.userId : dto.userId;
        }
        admin.user.username = dto.username === undefined ? admin.user.username : dto.username;
        admin.user.gender = dto.gender === undefined ? admin.user.gender : dto.gender;
        admin.user.email = dto.email === undefined ? admin.user.email : dto.email;
        admin.user.passwordHash = dto.passwordHash === undefined ? admin.user.passwordHash : dto.passwordHash;
        admin.user.phoneNumber = dto.phoneNumber === undefined ? admin.user.phoneNumber : dto.phoneNumber;
        admin.user.role = dto.role === undefined ? admin.user.role : dto.role;
        admin.user.status = dto.status === undefined ? admin.user.status : dto.status;

        return admin;
    }

    static toUserPublicDto(admin: Admin): UserPublicDto | null {
        if (!admin.user) return null;

        return plainToInstance(UserPublicDto, admin.user, {
            excludeExtraneousValues: true,
        });
    }

    static toAdminPublicDto(admin: Admin): AdminPublicDto {
        return plainToInstance(AdminPublicDto, { ...(this.toUserPublicDto(admin)  || {}), ...admin }, {
            excludeExtraneousValues: true,
        });
    }
}
