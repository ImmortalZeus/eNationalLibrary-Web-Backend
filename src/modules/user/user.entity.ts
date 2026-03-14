import { Entity, Column, PrimaryColumn } from 'typeorm';
import { UserGender } from 'src/common/enums/user/userGender.enum';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { UserStatus } from 'src/common/enums/user/userStatus.enum';

@Entity({ name: 'users' })
export class User {
    @PrimaryColumn({ type: 'varchar', nullable: false, unique: true })
    userId: string;

    @Column({ type: 'varchar', nullable: false })
    username: string;

    @Column({ type: 'varchar', nullable: false })
    gender: UserGender;

    @Column({ type: 'varchar', nullable: false })
    email: string;
    
    @Column({ type: 'varchar', nullable: false })
    passwordHash: string;

    @Column({ type: 'varchar', nullable: true, default: null })
    phoneNumber: string | null;

    @Column({ type: 'varchar', nullable: false, default: UserRole.Reader })
    role: UserRole;

    @Column({ type: 'varchar', nullable: false, default: UserStatus.Active })
    status: UserStatus;
}