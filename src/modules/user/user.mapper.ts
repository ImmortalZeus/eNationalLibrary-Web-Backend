import { User } from './user.entity';
import { UserPublicDto } from './dto/user-public.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';

export class UserMapper {
    // eslint-disable-next-line @typescript-eslint/require-await
    static async createFromDto(dto: CreateUserDto): Promise<User> {
        const user = new User();

        user.username = dto.username;
        user.gender = dto.gender;
        user.email = dto.email;
        user.passwordHash = dto.passwordHash;
        user.phoneNumber = dto.phoneNumber ? dto.phoneNumber : null;
        user.role = dto.role;
        user.status = dto.status;

        return user;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    static async updateFromDto(user: User, dto: UpdateUserDto): Promise<User> {
        user.username = dto.username ? dto.username : user.username;
        user.gender = dto.gender ? dto.gender : user.gender;
        user.email = dto.email ? dto.email: user.email;
        user.passwordHash = dto.passwordHash ? dto.passwordHash : user.passwordHash;
        user.phoneNumber = dto.phoneNumber === null ? null : (!dto.phoneNumber ? user.phoneNumber : dto.phoneNumber);
        user.role = dto.role ? dto.role : user.role;
        user.status = dto.status ? dto.status : user.status;

        return user;
    }

    static toUserPublicDto(user: User): UserPublicDto {
        return plainToInstance(UserPublicDto, { ...user }, {
            excludeExtraneousValues: true,
        });
    }
}