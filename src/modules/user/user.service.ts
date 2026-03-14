import { Injectable } from '@nestjs/common';
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

    async create(dto: CreateUserDto): Promise<UserPublicDto> {
        const user = this.userRepo.create(dto);

        const saved = await this.userRepo.save(user);
        
        return UserMapper.toUserPublicDto(saved);
    }

    async findOneById(id: string | { userId: string }): Promise<UserPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;
        return this.findOneByOptions(options);
    }

    async findOneByOptions(options: FindOptionsWhere<User>): Promise<UserPublicDto | null> {
        const user = await this.userRepo.findOne({ where: options });
        if(!user) return null;
        return UserMapper.toUserPublicDto(user);
    }

    async findManyByOptions(options: FindOptionsWhere<User>): Promise<UserPublicDto[]> {
        const users = await this.userRepo.find({ where: options });
        return users.map(user => UserMapper.toUserPublicDto(user));
    }

    async findAll(): Promise<UserPublicDto[]> {
        return this.findManyByOptions({});
    }

    async updateOneById(id: string | { userId: string }, dto: UpdateUserDto): Promise<UserPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<User>, dto: UpdateUserDto): Promise<UserPublicDto | null> {
        const user = await this.userRepo.findOne({ where: options });
        if(!user) return null;
        
        UserMapper.updateFromDto(user, dto);

        const saved = await this.userRepo.save(user);

        return UserMapper.toUserPublicDto(saved);
    }

    async updateManyByOptions(options: FindOptionsWhere<User>, dto: UpdateUserDto): Promise<UserPublicDto[]> {
        const users = await this.userRepo.find({ where: options });
        
        for (const user of users) {
            UserMapper.updateFromDto(user, dto);
            await this.userRepo.save(user);
        }

        return users.map(user => UserMapper.toUserPublicDto(user));
    }

    async removeOneById(id: string | { userId: string }): Promise<UserPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<User>): Promise<UserPublicDto | null> {
        const user = await this.userRepo.findOne({ where: options });
        if (!user) return null;
        await this.userRepo.remove(user);
        return UserMapper.toUserPublicDto(user);
    }

    async removeManyByOptions(options: FindOptionsWhere<User>): Promise<UserPublicDto[]> {
        const users = await this.userRepo.find({ where: options });
        await this.userRepo.remove(users);
        return users.map(user => UserMapper.toUserPublicDto(user));
    }
}