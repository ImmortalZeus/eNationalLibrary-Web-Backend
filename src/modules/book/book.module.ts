import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { AuthorModule } from '../author/author.module';
import { PublisherModule } from '../publisher/publisher.module';
import { GenreModule } from '../genre/genre.module';
import { ReaderModule } from '../reader/reader.module';
import { BorrowRecordModule } from '../borrow-record/borrow-record.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Book]),
        AuthorModule,
        PublisherModule,
        GenreModule,
        ReaderModule,
        BorrowRecordModule
    ],
    controllers: [BookController],
    providers: [BookService],
    exports: [BookService]
})
export class BookModule {}