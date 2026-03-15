import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryPublicDto } from './dto/category-public.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryMapper } from './category.mapper';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) {}

    async create(dto: CreateCategoryDto): Promise<CategoryPublicDto> {
        const existing = await this.categoryRepo.findOneBy({ categoryId: dto.categoryId });
        if (existing) {
            throw new ConflictException('categoryId already exists');
        }

        const category = CategoryMapper.createFromDto(dto);

        const saved = await this.categoryRepo.save(category);

        return CategoryMapper.toCategoryPublicDto(saved);
    }

    async findOneById(categoryId: string | { categoryId: string }): Promise<CategoryPublicDto | null> {
        const options = typeof categoryId === "string" ? { categoryId: categoryId } : categoryId;
        return this.findOneByOptions(options);
    }

    async findOneByOptions(options: FindOptionsWhere<Category>): Promise<CategoryPublicDto | null> {
        const category = await this.categoryRepo.findOne({ where: options });
        if(!category) return null;
        return CategoryMapper.toCategoryPublicDto(category);
    }

    async findManyByOptions(options: FindOptionsWhere<Category>): Promise<CategoryPublicDto[]> {
        const categories = await this.categoryRepo.find({ where: options });
        return categories.map(category => CategoryMapper.toCategoryPublicDto(category));
    }

    async findAll(): Promise<CategoryPublicDto[]> {
        return this.findManyByOptions({});
    }

    async updateOneById(categoryId: string | { categoryId: string }, dto: UpdateCategoryDto): Promise<CategoryPublicDto | null> {
        const options = typeof categoryId === "string" ? { categoryId: categoryId } : categoryId;
        return this.updateOneByOptions(options, dto);
    }

    async updateOneByOptions(options: FindOptionsWhere<Category>, dto: UpdateCategoryDto): Promise<CategoryPublicDto | null> {
        const category = await this.categoryRepo.findOne({ where: options });
        if(!category) return null;

        CategoryMapper.updateFromDto(category, dto);

        const saved = await this.categoryRepo.save(category);

        return CategoryMapper.toCategoryPublicDto(saved);
    }

    async updateManyByOptions(options: FindOptionsWhere<Category>, dto: UpdateCategoryDto): Promise<CategoryPublicDto[]> {
        const categories = await this.categoryRepo.find({ where: options });

        for (const category of categories) {
            CategoryMapper.updateFromDto(category, dto);
            await this.categoryRepo.save(category);
        }

        return categories.map(category => CategoryMapper.toCategoryPublicDto(category));
    }

    async removeOneById(categoryId: string | { categoryId: string }): Promise<CategoryPublicDto | null> {
        const options = typeof categoryId === "string" ? { categoryId: categoryId } : categoryId;
        return this.removeOneByOptions(options);
    }

    async removeOneByOptions(options: FindOptionsWhere<Category>): Promise<CategoryPublicDto | null> {
        const category = await this.categoryRepo.findOne({ where: options });
        if (!category) return null;
        await this.categoryRepo.remove(category);
        return CategoryMapper.toCategoryPublicDto(category);
    }

    async removeManyByOptions(options: FindOptionsWhere<Category>): Promise<CategoryPublicDto[]> {
        const categories = await this.categoryRepo.find({ where: options });
        await this.categoryRepo.remove(categories);
        return categories.map(category => CategoryMapper.toCategoryPublicDto(category));
    }
}