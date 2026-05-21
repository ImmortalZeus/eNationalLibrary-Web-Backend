import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserPublicDto } from './dto/user-public.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export class UserMapper {
    static async createFromDto(dto: CreateUserDto): Promise<User> {
        const user = new User();

        user.username = dto.username;
        user.gender = dto.gender;
        user.email = dto.email;
        user.passwordHash = await bcrypt.hash(dto.password, 10);
        user.phoneNumber = dto.phoneNumber ?? null;
        user.role = dto.role;
        user.status = dto.status;

        return user;
    }

    static async updateFromDto(user: User, dto: UpdateUserDto): Promise<User> {
        user.username = dto.username ?? user.username;
        user.gender = dto.gender ?? user.gender;
        user.email = dto.email ?? user.email;

        if (dto.password !== undefined) {
            user.passwordHash = await bcrypt.hash(dto.password, 10);
        }

        user.phoneNumber =
            dto.phoneNumber === undefined ? user.phoneNumber : dto.phoneNumber;

        user.role = dto.role ?? user.role;
        user.status = dto.status ?? user.status;

        return user;
    }

    static toUserPublicDto(user: User): UserPublicDto {
        return plainToInstance(UserPublicDto, { ...user }, {
            excludeExtraneousValues: true,
        });
    }
}