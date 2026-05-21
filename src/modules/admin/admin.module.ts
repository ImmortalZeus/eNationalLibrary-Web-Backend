import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from '../user/user.module';
import { BookModule } from '../book/book.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Admin]),
        forwardRef(() => UserModule)
    ],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService]
})
export class AdminModule {}
