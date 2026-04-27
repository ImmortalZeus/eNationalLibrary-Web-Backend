import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publisher } from './publisher.entity';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';
import { BookModule } from '../book/book.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Publisher]),
        BookModule
    ],
    controllers: [PublisherController,],
    providers: [PublisherService,],
    exports: [PublisherService]
})
export class PublisherModule {}
