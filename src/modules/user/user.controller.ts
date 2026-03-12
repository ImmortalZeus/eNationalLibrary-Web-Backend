import { Body, Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { User } from './user.schema'

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // CREATE
    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    // READ ALL
    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    // READ ONE
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User | null> {
        return this.userService.findOne(id);
    }

    // UPDATE
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User | null> {
        return this.userService.update(id, updateUserDto);
    }

    // DELETE
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<User | null> {
        return this.userService.remove(id);
    }
}
