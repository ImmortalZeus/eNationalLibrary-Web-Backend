import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reader, ReaderSchema } from './reader.schema';
import { ReaderService } from './reader.service';
import { ReaderController } from './reader.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Reader.name, schema: ReaderSchema }])],
    controllers: [ReaderController],
    providers: [ReaderService],
    exports: [ReaderService]
})
export class ReaderModule {}
