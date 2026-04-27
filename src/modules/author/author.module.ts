import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { BookModule } from '../book/book.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Author]),
        BookModule
    ],
    controllers: [AuthorController,],
    providers: [AuthorService,],
    exports: [AuthorService]
})
export class AuthorModule {}
