import { Body, Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminService } from './admin.service';
import { Admin } from './admin.schema';
import { AdminPublicDto } from './dto/admin-public.dto';

@Controller('admins')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    // CREATE
    @Post()
    async create(@Body() createAdminDto: CreateAdminDto): Promise<AdminPublicDto> {
        return this.adminService.create(createAdminDto);
    }

    // READ ALL
    @Get()
    async findAll(): Promise<AdminPublicDto[]> {
        return this.adminService.findAll();
    }

    // READ ONE
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<AdminPublicDto | null> {
        return this.adminService.findOne(id);
    }

    // UPDATE
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto): Promise<AdminPublicDto | null> {
        return this.adminService.update(id, updateAdminDto);
    }

    // DELETE
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<AdminPublicDto | null> {
        return this.adminService.remove(id);
    }
}
