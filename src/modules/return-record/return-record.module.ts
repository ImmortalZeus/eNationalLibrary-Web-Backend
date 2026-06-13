import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReturnRecord } from './return-record.entity';
import { ReturnRecordService } from './return-record.service';
import { ReturnRecordController } from './return-record.controller';
import { ReaderModule } from '../reader/reader.module';
import { BookModule } from '../book/book.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ReturnRecord]),
        forwardRef(() => ReaderModule),
        BookModule,
    ],
    controllers: [ReturnRecordController],
    providers: [ReturnRecordService],
    exports: [ReturnRecordService],
})
export class ReturnRecordModule {}