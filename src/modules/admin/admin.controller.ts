import { Body, Controller, Param, Get, Post, Put, Delete, Query } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { AdminPublicDto } from './dto/admin-public.dto';
import { AdminMapper } from './admin.mapper';
import { ParseRelationsPipe } from 'src/common/queryPipes/parseRelations.pipe';

@Controller('admins')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    // CREATE
    @Post()
    async create(
        @Body() createAdminDto: CreateAdminDto
    ): Promise<string> {
        const admin = await this.adminService.create(createAdminDto);
        return admin.userId;
    }

    // READ ALL
    @Get()
    async findAll(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<AdminPublicDto[]> {
        const admins = await this.adminService.findAll(relations);
        return admins.map(admin => AdminMapper.toAdminPublicDto(admin));
    }

    // READ ONE
    @Get(':id')
    async findOneById(
        @Param('id') id: string,
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<AdminPublicDto | null> {
        const admin = await this.adminService.findOneById(id, relations);
        return admin ? AdminMapper.toAdminPublicDto(admin) : null;
    }

    // UPDATE
    @Put(':id')
    async updateOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[],
        @Body() updateAdminDto: UpdateAdminDto
    ): Promise<boolean> {
        const res = await this.adminService.updateOneById(id, updateAdminDto);
        return res;
    }

    // DELETE
    @Delete(':id')
    async removeOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<boolean> {
        const res = await this.adminService.removeOneById(id);
        return res;
    }
}
