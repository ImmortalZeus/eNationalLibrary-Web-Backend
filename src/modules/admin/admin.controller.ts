import { Body, Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminService } from './admin.service';
import { Admin } from './admin.schema';

@Controller('admins')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    // CREATE
    @Post()
    async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
        return this.adminService.create(createAdminDto);
    }

    // READ ALL
    @Get()
    async findAll(): Promise<Admin[]> {
        return this.adminService.findAll();
    }

    // READ ONE
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Admin | null> {
        return this.adminService.findOne(id);
    }

    // UPDATE
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto): Promise<Admin | null> {
        return this.adminService.update(id, updateAdminDto);
    }

    // DELETE
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<Admin | null> {
        return this.adminService.remove(id);
    }
}
