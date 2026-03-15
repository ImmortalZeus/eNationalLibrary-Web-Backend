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

    async create(dto: CreateAdminDto): Promise<AdminPublicDto> {
        const existing = await this.adminRepo.findOneBy({ userId: dto.userId });
        if (existing) {
            throw new ConflictException('userId already exists');
        }

        const admin = this.adminRepo.create(dto);
        
        if(admin.user) {
            const userPublicDto = await this.userService.create(admin.user);
        }

        const saved = await this.adminRepo.save(admin);

        return AdminMapper.toAdminPublicDto(saved);
    }

    async findOneById(userId: string | { userId: string }): Promise<AdminPublicDto | null> {
        const options = typeof userId === "string" ? { userId: userId } : userId;
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

    async updateOneById(userId: string | { userId: string }, dto: UpdateAdminDto): Promise<AdminPublicDto | null> {
        const options = typeof userId === "string" ? { userId: userId } : userId;
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<Admin>, dto: UpdateAdminDto): Promise<AdminPublicDto | null> {
        const admin = await this.adminRepo.findOne({ where: options });
        if(!admin) return null;
        
        AdminMapper.updateFromDto(admin, dto);

        if(admin.user) {
            const userPublicDto = await this.userService.updateOneByOptions({ userId: admin.user.userId }, admin.user);
        }

        const saved = await this.adminRepo.save(admin);

        return AdminMapper.toAdminPublicDto(saved);
    }

    async updateManyByOptions(options: FindOptionsWhere<Admin>, dto: UpdateAdminDto): Promise<AdminPublicDto[]> {
        const admins = await this.adminRepo.find({ where: options });
        
        for (const admin of admins) {
            AdminMapper.updateFromDto(admin, dto);

            if (admin.user) {
                const userPublicDto = await this.userService.updateOneByOptions({ userId: admin.user.userId }, admin.user);
            }
            await this.adminRepo.save(admin);
        }

        return admins.map(admin => AdminMapper.toAdminPublicDto(admin));
    }

    async removeOneById(userId: string | { userId: string }): Promise<AdminPublicDto | null> {
        const options = typeof userId === "string" ? { userId: userId } : userId;
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<Admin>): Promise<AdminPublicDto | null> {
        const admin = await this.adminRepo.findOne({ where: options });
        if (!admin) return null;
        await this.adminRepo.remove(admin);
        if (admin.user) {
            const userPublicDto = await this.userService.removeOneByOptions({ userId: admin.user.userId });
        }
        return AdminMapper.toAdminPublicDto(admin);
    }

    async removeManyByOptions(options: FindOptionsWhere<Admin>): Promise<AdminPublicDto[]> {
        const admins = await this.adminRepo.find({ where: options });
        await this.adminRepo.remove(admins);
        for (const admin of admins) {
            if (admin.user) {
                const userPublicDto = await this.userService.removeOneByOptions({ userId: admin.user.userId });
            }
        }
        return admins.map(admin => AdminMapper.toAdminPublicDto(admin));
    }
}