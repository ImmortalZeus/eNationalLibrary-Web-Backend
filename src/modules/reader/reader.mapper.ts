import { User } from '../user/user.entity';
import { Reader } from './reader.entity';
import { ReaderPublicDto } from './dto/reader-public.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UserPublicDto } from '../user/dto/user-public.dto';
import { plainToInstance } from 'class-transformer';

export class ReaderMapper {
    static createFromDto(dto: CreateReaderDto): Reader {
        const reader = new Reader();

        reader.userId = dto.userId;
        reader.address = dto.address;
        reader.readingCardIds = dto.readingCardIds;
        reader.borrowRecordIds = dto.borrowRecordIds;

        if (!reader.user) {
            reader.user = new User();
            reader.user.userId = dto.userId;
        }
        reader.user.username = dto.username;
        reader.user.gender = dto.gender;
        reader.user.email = dto.email;
        reader.user.passwordHash = dto.passwordHash;
        reader.user.phoneNumber = dto.phoneNumber;
        reader.user.role = dto.role;
        reader.user.status = dto.status;

        return reader;
    }

    static updateFromDto(reader: Reader, dto: UpdateReaderDto): Reader {
        reader.address = dto.address === undefined ? reader.address : dto.address;
        reader.readingCardIds = dto.readingCardIds === undefined ? reader.readingCardIds : dto.readingCardIds;
        reader.borrowRecordIds = dto.borrowRecordIds === undefined ? reader.borrowRecordIds : dto.borrowRecordIds;

        if (!reader.user) {
            reader.user = new User();
            reader.user.userId = dto.userId === undefined ? reader.user.userId : dto.userId;
        }
        reader.user.username = dto.username === undefined ? reader.user.username : dto.username;
        reader.user.gender = dto.gender === undefined ? reader.user.gender : dto.gender;
        reader.user.email = dto.email === undefined ? reader.user.email : dto.email;
        reader.user.passwordHash = dto.passwordHash === undefined ? reader.user.passwordHash : dto.passwordHash;
        reader.user.phoneNumber = dto.phoneNumber === undefined ? reader.user.phoneNumber : dto.phoneNumber;
        reader.user.role = dto.role === undefined ? reader.user.role : dto.role;
        reader.user.status = dto.status === undefined ? reader.user.status : dto.status;

        return reader;
    }

    static toUserPublicDto(reader: Reader): UserPublicDto | null {
        if (!reader.user) return null;

        return plainToInstance(UserPublicDto, reader.user, {
            excludeExtraneousValues: true,
        });
    }

    static toReaderPublicDto(reader: Reader): ReaderPublicDto {
        return plainToInstance(ReaderPublicDto, { ...(this.toUserPublicDto(reader) || {}), ...reader }, {
            excludeExtraneousValues: true,
        });
    }
}
