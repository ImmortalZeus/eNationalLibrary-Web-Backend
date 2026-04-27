import { Body, Controller, Param, Get, Post, Put, Delete, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { User } from './user.entity'
import { UserPublicDto } from './dto/user-public.dto';
import { UserMapper } from './user.mapper';
import { ParseRelationsPipe } from 'src/common/queryPipes/parseRelations.pipe';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // CREATE
    @Post()
    async create(
        @Body() createUserDto: CreateUserDto
    ): Promise<string> {
        const user = await this.userService.create(createUserDto);
        // return UserMapper.toUserPublicDto(user);
        return user.userId;
    }

    // READ ALL
    @Get()
    async findAll(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<UserPublicDto[]> {
        const users = await this.userService.findAll(relations);
        return users.map(user => UserMapper.toUserPublicDto(user));
    }

    // READ ONE
    @Get(':id')
    async findOneById(
        @Param('id') id: string,
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<UserPublicDto | null> {
        const user = await this.userService.findOneById(id, relations);
        return user ? UserMapper.toUserPublicDto(user) : null;
    }

    // UPDATE
    @Put(':id')
    async updateOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[],
        @Body() updateUserDto: UpdateUserDto
    ): Promise<boolean> {
        const res = await this.userService.updateOneById(id, updateUserDto);
        return res;
    }

    // DELETE
    @Delete(':id')
    async removeOneById(
        @Param('id') id: string,
        // @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<boolean> {
        const res = await this.userService.removeOneById(id);
        // return user ? UserMapper.toUserPublicDto(user) : null;
        return res;
    }
}
