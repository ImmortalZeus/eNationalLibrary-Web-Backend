import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { User } from './user.entity';
import { UserPublicDto } from './dto/user-public.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async create(dto: CreateUserDto): Promise<UserPublicDto> {
        const entity = this.userRepo.create(dto);
        const saved = await this.userRepo.save(entity);
        return plainToInstance(UserPublicDto, saved, {
            excludeExtraneousValues: true,
        });
    }

    async findOneById(id: string | { userId: string }): Promise<UserPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;
        return this.findOneByOptions(options);
    }

    async findOneByOptions(options: FindOptionsWhere<User>): Promise<UserPublicDto | null> {
        const entity = await this.userRepo.findOne({ where: options });
        return entity
            ? plainToInstance(UserPublicDto, entity, { excludeExtraneousValues: true })
            : null;
    }

    async findManyByOptions(options: FindOptionsWhere<User>): Promise<UserPublicDto[]> {
        const entities = await this.userRepo.find({ where: options });
        return plainToInstance(UserPublicDto, entities, {
            excludeExtraneousValues: true,
        });
    }

    async findAll(): Promise<UserPublicDto[]> {
        return this.findManyByOptions({});
    }

    async updateOneById(id: string | { userId: string }, dto: UpdateUserDto): Promise<UserPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<User>, dto: UpdateUserDto): Promise<UserPublicDto | null> {
        await this.userRepo.update(options, dto);
        const updatedEntity = await this.userRepo.findOne({ where: options });
        return updatedEntity
            ? plainToInstance(UserPublicDto, updatedEntity, { excludeExtraneousValues: true })
            : null;
    }

    async updateManyByOptions(options: FindOptionsWhere<User>, dto: UpdateUserDto): Promise<UserPublicDto[]> {
        await this.userRepo.update(options, dto);
        const updatedEntities = await this.userRepo.find({ where: options });
        return plainToInstance(UserPublicDto, updatedEntities, { excludeExtraneousValues: true });
    }

    async removeOneById(id: string | { userId: string }): Promise<UserPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<User>): Promise<UserPublicDto | null> {
        const entity = await this.userRepo.findOne({ where: options });
        if (!entity) return null;
        await this.userRepo.remove(entity);
        return plainToInstance(UserPublicDto, entity, { excludeExtraneousValues: true });
    }

    async removeManyByOptions(options: FindOptionsWhere<User>): Promise<UserPublicDto[]> {
        const entities = await this.userRepo.find({ where: options });
        await this.userRepo.remove(entities);
        return plainToInstance(UserPublicDto, entities, { excludeExtraneousValues: true });
    }
}