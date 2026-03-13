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

@Module({
    imports: [ReadingCardModule, ReadingCardModule, MongooseModule.forRoot('mongodb://localhost:27017/mydb'), ReaderModule, AdminModule, UserModule, ReadingCardModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
