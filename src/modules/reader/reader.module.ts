import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reader } from './reader.entity';
import { ReaderService } from './reader.service';
import { ReaderController } from './reader.controller';
import { User } from '../user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Reader, User])],
    controllers: [ReaderController],
    providers: [ReaderService],
    exports: [ReaderService]
})
export class ReaderModule {}
