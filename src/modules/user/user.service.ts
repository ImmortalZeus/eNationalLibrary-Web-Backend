import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserPublicDto } from './dto/user-public.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async create(dto: CreateUserDto): Promise<User> {
        const user = await UserMapper.createFromDto(dto);
        
        const saved = await this.save(user);
        
        return saved;
    }

    async findOneById(userId: string | { userId: string }, relations: string[]): Promise<User | null> {
        const options = typeof userId === "string" ? { userId: userId } : { userId: userId.userId };
        return this.findOneByOptions(options, relations);
    }

    async findOneByOptions(options: FindOptionsWhere<User>, relations: string[]): Promise<User | null> {
        const user = await this.userRepo.findOne({ where: options, relations: relations });
        if(!user) return null;
        return user;
    }

    async findManyByOptions(options: FindOptionsWhere<User>, relations: string[]): Promise<User[]> {
        const users = await this.userRepo.find({ where: options, relations: relations });
        return users;
    }

    async findAll(relations: string[]): Promise<User[]> {
        return this.findManyByOptions({}, relations);
    }

    async updateOneById(userId: string | { userId: string }, dto: UpdateUserDto): Promise<boolean> {
        const options = typeof userId === "string" ? { userId: userId } : { userId: userId.userId };
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<User>, dto: UpdateUserDto): Promise<boolean> {
        const user = await this.findOneByOptions(options, []);
        if(!user) return false;
        
        await UserMapper.updateFromDto(user, dto);

        const saved = await this.save(user);

        return true;
    }

    async updateManyByOptions(options: FindOptionsWhere<User>, dto: UpdateUserDto): Promise<boolean> {
        const users = await this.findManyByOptions(options, []);
        
        for (const user of users) {
            await UserMapper.updateFromDto(user, dto);
            await this.save(user);
        }

        return true;
    }

    async removeOneById(userId: string | { userId: string }): Promise<boolean> {
        const options = typeof userId === "string" ? { userId: userId } : { userId: userId.userId };
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<User>): Promise<boolean> {
        const user = await this.findOneByOptions(options, []);
        if (!user) return false;
        await this.remove(user);
        return true;
    }

    async removeManyByOptions(options: FindOptionsWhere<User>, relations: string[]): Promise<boolean> {
        const users = await this.findManyByOptions(options, []);
        await this.removeMany(users);
        return true;
    }

    async save(user: User): Promise<User> {
        return await this.userRepo.save(user);
    }

    async remove(user: User): Promise<User> {
        return await this.userRepo.remove(user);
    }

    async removeMany(users: User[]): Promise<User[]> {
        return await this.userRepo.remove(users);
    }

    async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    return this.userRepo.findOne({
        where: [
            { username: usernameOrEmail },
            { email: usernameOrEmail },
        ],
    });
}
}