import { User } from '../user/user.entity';
import { Admin } from './admin.entity';
import { AdminPublicDto } from './dto/admin-public.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UserPublicDto } from '../user/dto/user-public.dto';
import { plainToInstance } from 'class-transformer';
import { UserMapper } from '../user/user.mapper';

export class AdminMapper {
    // eslint-disable-next-line @typescript-eslint/require-await
    static async createFromDto(dto: CreateAdminDto): Promise<Admin> {
        const admin = new Admin();

        return admin;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    static async updateFromDto(admin: Admin, dto: UpdateAdminDto): Promise<Admin> {
        return admin;
    }

    static toAdminPublicDto(admin: Admin): AdminPublicDto {
        return plainToInstance(AdminPublicDto, {
                ...admin,
                user: admin.user ? UserMapper.toUserPublicDto(admin.user) : undefined,
            }, {
            excludeExtraneousValues: true,
        });
    }
}
