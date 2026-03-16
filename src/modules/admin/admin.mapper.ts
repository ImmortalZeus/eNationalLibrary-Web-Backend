import { User } from '../user/user.entity';
import { Admin } from './admin.entity';
import { AdminPublicDto } from './dto/admin-public.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UserPublicDto } from '../user/dto/user-public.dto';
import { plainToInstance } from 'class-transformer';
import { UserMapper } from '../user/user.mapper';

export class AdminMapper {
    static createFromDto(dto: CreateAdminDto): Admin {
        const admin = new Admin();

        admin.userId = dto.userId;

        admin.user = UserMapper.createFromDto({
            userId: dto.userId,
            username: dto.username,
            gender: dto.gender,
            email: dto.email,
            passwordHash: dto.passwordHash,
            phoneNumber: dto.phoneNumber,
            role: dto.role,
            status: dto.status
        });

        return admin;
    }

    static updateFromDto(admin: Admin, dto: UpdateAdminDto): Admin {
        
        if (!admin.user) {
            admin.user = new User();
            admin.user.userId = dto.userId === undefined ? admin.user.userId : dto.userId;
        }

        admin.user = UserMapper.updateFromDto(admin.user, {
            username: dto.username,
            gender: dto.gender,
            email: dto.email,
            passwordHash: dto.passwordHash,
            phoneNumber: dto.phoneNumber,
            role: dto.role,
            status: dto.status
        });
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
