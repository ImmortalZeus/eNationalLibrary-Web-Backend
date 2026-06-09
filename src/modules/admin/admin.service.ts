import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { AdminPublicDto } from './dto/admin-public.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { User } from '../user/user.entity';
import { AdminMapper } from './admin.mapper';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepo: Repository<Admin>,
        private readonly userService: UserService,
    ) {}

    async create(dto: CreateAdminDto): Promise<Admin> {
        const admin = await AdminMapper.createFromDto(dto);
        
        if(admin.user) {
            // const userPublicDto = await this.userService.create(admin.user);
            const user = await this.userService.create(dto.user);
            admin.user = user;
        }

        const saved = await this.save(admin);

        // return AdminMapper.toAdminPublicDto(saved);
        return saved;
    }

    async findOneById(userId: string | { userId: string }, relations: string[]): Promise<Admin | null> {
        const options = typeof userId === "string" ? { userId: userId } : { userId: userId.userId };
        return this.findOneByOptions(options, relations);
    }

    async findOneByOptions(options: FindOptionsWhere<Admin>, relations: string[]): Promise<Admin | null> {
        const admin = await this.adminRepo.findOne({ where: options, relations: relations });
        if(!admin) return null;
        // return AdminMapper.toAdminPublicDto(admin);
        return admin;
    }

    async findManyByOptions(options: FindOptionsWhere<Admin>, relations: string[]): Promise<Admin[]> {
        const admins = await this.adminRepo.find({ where: options, relations: relations });
        // return admins.map(admin => AdminMapper.toAdminPublicDto(admin));
        return admins;
    }

    async findAll(relations: string[]): Promise<Admin[]> {
        return this.findManyByOptions({}, relations);
    }

    async updateOneById(userId: string | { userId: string }, dto: UpdateAdminDto): Promise<boolean> {
        const options = typeof userId === "string" ? { userId: userId } : { userId: userId.userId };
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<Admin>, dto: UpdateAdminDto): Promise<boolean> {
        const admin = await this.findOneByOptions(options, []);
        if(!admin) return false;
        
        await AdminMapper.updateFromDto(admin, dto);

        if(dto.user) {
            await this.userService.updateOneById(admin.userId, dto.user);
            
            // admin.user = await this.userService.findOneById(admin.userId, []);
        }

        const saved = await this.save(admin);

        // return AdminMapper.toAdminPublicDto(saved);

        return true;
    }

    async updateManyByOptions(options: FindOptionsWhere<Admin>, dto: UpdateAdminDto): Promise<boolean> {
        const admins = await this.findManyByOptions(options, []);
        
        for (const admin of admins) {
            await AdminMapper.updateFromDto(admin, dto);

            if (dto.user) {
                await this.userService.updateOneById(admin.userId, dto.user);
                
                // admin.user = await this.userService.findOneById(admin.userId, []);
            }

            await this.save(admin);
        }

        // return admins.map(admin => AdminMapper.toAdminPublicDto(admin));

        return true;
    }

    async removeOneById(userId: string | { userId: string }): Promise<boolean> {
        const options = typeof userId === "string" ? { userId: userId } : { userId: userId.userId };
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<Admin>): Promise<boolean> {
        const admin = await this.findOneByOptions(options, ['user']);
        if (!admin) return false;
        await this.remove(admin);
        if (admin.user) {
            await this.userService.remove(admin.user);
        }
        // return AdminMapper.toAdminPublicDto(admin);
        return true;
    }

    async removeManyByOptions(options: FindOptionsWhere<Admin>): Promise<boolean> {
        const admins = await this.findManyByOptions(options, ['user']);
        await this.removeMany(admins);
        await this.userService.removeMany(admins.map(a => a.user).filter(e => !!e));
        return true;
    }

    async save(admin: Admin): Promise<Admin> {
        return await this.adminRepo.save(admin);
    }

    async remove(admin: Admin): Promise<Admin> {
        return await this.adminRepo.remove(admin);
    }

    async removeMany(admins: Admin[]): Promise<Admin[]> {
        return await this.adminRepo.remove(admins);
    }
}