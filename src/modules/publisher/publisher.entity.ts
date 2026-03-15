import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'publishers' })
export class Publisher {
    @PrimaryColumn({ type: 'varchar', nullable: false, unique: true })
    publisherId: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: false })
    description: string;
}