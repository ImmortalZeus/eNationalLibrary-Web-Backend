import { User } from './user.entity';
import { UserPublicDto } from './dto/user-public.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';

export class UserMapper {
    static createFromDto(dto: CreateUserDto): User {
        const user = new User();

        user.userId = dto.userId;
        user.username = dto.username;
        user.gender = dto.gender;
        user.email = dto.email;
        user.passwordHash = dto.passwordHash;
        user.phoneNumber = dto.phoneNumber;
        user.role = dto.role;
        user.status = dto.status;

        return user;
    }

    static updateFromDto(user: User, dto: UpdateUserDto): User {
        user.username = dto.username === undefined ? user.username : dto.username;
        user.gender = dto.gender === undefined ? user.gender : dto.gender;
        user.email = dto.email === undefined ? user.email : dto.email;
        user.passwordHash = dto.passwordHash === undefined ? user.passwordHash : dto.passwordHash;
        user.phoneNumber = dto.phoneNumber === undefined ? user.phoneNumber : dto.phoneNumber;
        user.role = dto.role === undefined ? user.role : dto.role;
        user.status = dto.status === undefined ? user.status : dto.status;

        return user;
    }

    static toUserPublicDto(user: User): UserPublicDto {
        return plainToInstance(UserPublicDto, { ...user }, {
            excludeExtraneousValues: true,
        });
    }
}