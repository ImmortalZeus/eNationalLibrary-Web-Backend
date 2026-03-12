import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.schema';
import { BaseService } from 'src/common/base.service';

@Injectable()
export class AdminService extends BaseService<Admin> {
    constructor(@InjectModel(Admin.name) adminModel: Model<Admin>) {
        super(adminModel);
    }
}