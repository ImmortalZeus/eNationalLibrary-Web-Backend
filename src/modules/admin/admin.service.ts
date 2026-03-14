import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from 'src/common/base.service';
import { Admin } from './admin.entity';
import { AdminPublicDto } from './dto/admin-public.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { User } from '../user/user.entity';
import { AdminMapper } from './admin.mapper';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Admin)
        private readonly adminRepo: Repository<Admin>,
    ) {}

    async create(dto: CreateAdminDto): Promise<AdminPublicDto> {
        const admin = this.adminRepo.create(dto);
        
        if(admin.user) {
            await this.userRepo.save(admin.user);
        }

        const saved = await this.adminRepo.save(admin);

        return AdminMapper.toAdminPublicDto(saved);
    }

    async findOneById(id: string | { userId: string }): Promise<AdminPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;
        return this.findOneByOptions(options);
    }

    async findOneByOptions(options: FindOptionsWhere<Admin>): Promise<AdminPublicDto | null> {
        const admin = await this.adminRepo.findOne({ where: options });
        if(!admin) return null;
        return AdminMapper.toAdminPublicDto(admin);
    }

    async findManyByOptions(options: FindOptionsWhere<Admin>): Promise<AdminPublicDto[]> {
        const admins = await this.adminRepo.find({ where: options });
        return admins.map(admin => AdminMapper.toAdminPublicDto(admin));
    }

    async findAll(): Promise<AdminPublicDto[]> {
        return this.findManyByOptions({});
    }

    async updateOneById(id: string | { userId: string }, dto: UpdateAdminDto): Promise<AdminPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<Admin>, dto: UpdateAdminDto): Promise<AdminPublicDto | null> {
        const admin = await this.adminRepo.findOne({ where: options });
        if(!admin) return null;
        
        AdminMapper.updateFromDto(admin, dto);

        if(admin.user) {
            await this.userRepo.save(admin.user);
        }

        const saved = await this.adminRepo.save(admin);

        return AdminMapper.toAdminPublicDto(saved);
    }

    async updateManyByOptions(options: FindOptionsWhere<Admin>, dto: UpdateAdminDto): Promise<AdminPublicDto[]> {
        const admins = await this.adminRepo.find({ where: options });
        
        for (const admin of admins) {
            AdminMapper.updateFromDto(admin, dto);

            if (admin.user) {
                await this.userRepo.save(admin.user);
            }
            await this.adminRepo.save(admin);
        }

        return admins.map(admin => AdminMapper.toAdminPublicDto(admin));
    }

    async removeOneById(id: string | { userId: string }): Promise<AdminPublicDto | null> {
        const options = typeof id === "string" ? { userId: id } : id;
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<Admin>): Promise<AdminPublicDto | null> {
        const admin = await this.adminRepo.findOne({ where: options });
        if (!admin) return null;
        await this.adminRepo.remove(admin);
        return AdminMapper.toAdminPublicDto(admin);
    }

    async removeManyByOptions(options: FindOptionsWhere<Admin>): Promise<AdminPublicDto[]> {
        const admins = await this.adminRepo.find({ where: options });
        await this.adminRepo.remove(admins);
        return admins.map(admin => AdminMapper.toAdminPublicDto(admin));
    }
}