import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reader } from './reader.entity';
import { ReaderService } from './reader.service';
import { ReaderController } from './reader.controller';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Reader]),
        UserModule
    ],
    controllers: [ReaderController],
    providers: [ReaderService],
    exports: [ReaderService]
})
export class ReaderModule {}
