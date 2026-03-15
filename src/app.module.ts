import { AuthorModule } from './modules/author/author.module';
import { PublisherModule } from './modules/publisher/publisher.module';
import { CategoryModule } from './modules/category/category.module';
import { ReadingCardController } from './modules/reading-card/reading-card.controller';
import { ReadingCardModule } from './modules/reading-card/reading-card.module';
import { ReaderModule } from './modules/reader/reader.module';
import { ReaderService } from './modules/reader/reader.service';
import { AdminModule } from './modules/admin/admin.module';
import { AdminService } from './modules/admin/admin.service';
import { AdminController } from './modules/admin/admin.controller';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReaderController } from './modules/reader/reader.controller';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookModule } from './modules/book/book.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // để dùng ở mọi module mà không cần import lại
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get<string>('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                username: config.get<string>('DB_USER'),
                password: config.get<string>('DB_PASS'),
                database: config.get<string>('DB_NAME'),
                autoLoadEntities: true, // tự động load entity từ các module
                synchronize: true, // chỉ bật trong dev
            }),
        }),
        ReaderModule,
        AdminModule,
        UserModule,
        ReadingCardModule,
        BookModule,
        CategoryModule,
        PublisherModule,
        AuthorModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
