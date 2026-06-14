import { Body, Controller, Param, Get, Post, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionService } from './promotion.service';
import { Promotion } from './promotion.entity';
import { PromotionPublicDto } from './dto/promotion-public.dto';
import { PromotionMapper } from './promotion.mapper';
import { ParseRelationsPipe } from 'src/common/queryPipes/parseRelations.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { Roles } from '../auth/roles.decorator';

@Controller('promotions')
export class PromotionController {
    constructor(private readonly promotionService: PromotionService) {}

    // CREATE
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Post()
    async create(
        @Body() createPromotionDto: CreatePromotionDto
    ): Promise<string> {
        const promotion = await this.promotionService.create(createPromotionDto);
        return promotion.promotionId;
    }

    // READ ALL (admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Get()
    async findAll(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<PromotionPublicDto[]> {
        const promotions = await this.promotionService.findAll(relations);
        return promotions.map(p => PromotionMapper.toPromotionPublicDto(p));
    }

    // READ ACTIVE (public)
    @Get('active')
    async findActive(
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<PromotionPublicDto[]> {
        const promotions = await this.promotionService.findActivePromotions(relations);
        return promotions.map(p => PromotionMapper.toPromotionPublicDto(p));
    }

    // READ ONE
    @Get(':id')
    async findOneById(
        @Param('id') id: string,
        @Query('relations', ParseRelationsPipe) relations: string[]
    ): Promise<PromotionPublicDto | null> {
        const promotion = await this.promotionService.findOneById(id, relations);
        return promotion ? PromotionMapper.toPromotionPublicDto(promotion) : null;
    }

    // GET AFFECTED CARDS PREVIEW
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Get(':id/affected-cards')
    async getAffectedCards(
        @Param('id') id: string
    ): Promise<{ count: number }> {
        const cards = await this.promotionService.getAffectedCards(id);
        return { count: cards.length };
    }

    // UPDATE
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Patch(':id')
    async updateOneById(
        @Param('id') id: string,
        @Body() updatePromotionDto: UpdatePromotionDto
    ): Promise<boolean> {
        return await this.promotionService.updateOneById(id, updatePromotionDto);
    }

    // DELETE
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Delete(':id')
    async removeOneById(
        @Param('id') id: string
    ): Promise<boolean> {
        return await this.promotionService.removeOneById(id);
    }

    // ACTIVATE
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Post(':id/activate')
    async activate(
        @Param('id') id: string
    ): Promise<boolean> {
        return await this.promotionService.activatePromotion(id);
    }

    // DEACTIVATE
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Admin)
    @Post(':id/deactivate')
    async deactivate(
        @Param('id') id: string
    ): Promise<boolean> {
        return await this.promotionService.deactivatePromotion(id);
    }
}
