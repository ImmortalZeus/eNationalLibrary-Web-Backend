import { Body, Controller, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryService } from './category.service';
import { Category } from './category.entity'
import { CategoryPublicDto } from './dto/category-public.dto';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    // CREATE
    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryPublicDto> {
        return this.categoryService.create(createCategoryDto);
    }

    // READ ALL
    @Get()
    async findAll(): Promise<CategoryPublicDto[]> {
        return this.categoryService.findAll();
    }

    // READ ONE
    @Get(':id')
    async findOneById(@Param('id') id: string): Promise<CategoryPublicDto | null> {
        return this.categoryService.findOneById(id);
    }

    // UPDATE
    @Put(':id')
    async updateOneById(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<CategoryPublicDto | null> {
        return this.categoryService.updateOneById(id, updateCategoryDto);
    }

    // DELETE
    @Delete(':id')
    async removeOneById(@Param('id') id: string): Promise<CategoryPublicDto | null> {
        return this.categoryService.removeOneById(id);
    }
}
