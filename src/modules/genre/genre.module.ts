import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './genre.entity';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { BookModule } from '../book/book.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Genre]),
        BookModule,
    ],
    controllers: [GenreController,],
    providers: [GenreService,],
    exports: [GenreService]
})
export class GenreModule {}
