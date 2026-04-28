import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowRecord } from './borrow-record.entity';
import { BorrowRecordService } from './borrow-record.service';
import { BorrowRecordController } from './borrow-record.controller';
import { ReaderModule } from '../reader/reader.module';
import { BookModule } from '../book/book.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([BorrowRecord]),
        forwardRef(() => ReaderModule),
        BookModule,
    ],
    controllers: [BorrowRecordController],
    providers: [BorrowRecordService],
    exports: [BorrowRecordService],
})
export class BorrowRecordModule {}