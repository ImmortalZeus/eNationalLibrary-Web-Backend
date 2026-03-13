import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { BaseService } from 'src/common/base.service';
import { UserPublicDto } from './dto/user-public.dto';

// @Injectable()
// export class UserService {
//     constructor(@InjectModel(User.name) private userModel: Model<User>) {}

//     // CREATE
//     async create(createUserDto: CreateUserDto): Promise<UserDocument> {
//         const newUser = new this.userModel(createUserDto);
//         return newUser.save();
//     }

//     // READ ALL
//     async findAll(): Promise<UserDocument[]> {
//         return this.userModel.find().exec();
//     }

//     // READ ONE
//     async findOne(id: string): Promise<UserDocument | null> {
//         return this.userModel.findById(id).exec();
//     }

//     // UPDATE
//     async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument | null> {
//         return this.userModel.findOneAndUpdate({ _id: id }, updateUserDto, { new: true }).exec();
//     }

//     // DELETE
//     async remove(id: string): Promise<UserDocument | null> {
//         return this.userModel.findByIdAndDelete(id).exec();
//     }
// }

@Injectable()
export class UserService extends BaseService<User, UserPublicDto> {
    constructor(@InjectModel(User.name) userModel: Model<User>) {
        super(userModel, UserPublicDto);
    }
}