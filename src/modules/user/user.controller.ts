import { Body, Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { User } from './user.schema'
import { UserPublicDto } from './dto/user-public.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // CREATE
    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserPublicDto> {
        return this.userService.create(createUserDto);
    }

    // READ ALL
    @Get()
    async findAll(): Promise<UserPublicDto[]> {
        return this.userService.findAll();
    }

    // READ ONE
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<UserPublicDto | null> {
        return this.userService.findOne(id);
    }

    // UPDATE
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserPublicDto | null> {
        return this.userService.update(id, updateUserDto);
    }

    // DELETE
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<UserPublicDto | null> {
        return this.userService.remove(id);
    }
}
