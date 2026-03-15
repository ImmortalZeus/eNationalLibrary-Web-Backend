import { Category } from './category.entity';
import { CategoryPublicDto } from './dto/category-public.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { plainToInstance } from 'class-transformer';

export class CategoryMapper {
    static createFromDto(dto: CreateCategoryDto): Category {
        const category = new Category();

        category.categoryId = dto.categoryId;
        category.label = dto.label;
        category.description = dto.description;

        return category;
    }

    static updateFromDto(category: Category, dto: UpdateCategoryDto): Category {
        category.label = dto.label === undefined ? category.label : dto.label;
        category.description = dto.description === undefined ? category.description : dto.description;

        return category;
    }

    static toCategoryPublicDto(category: Category): CategoryPublicDto {
        return plainToInstance(CategoryPublicDto, { ...category }, {
            excludeExtraneousValues: true,
        });
    }
}