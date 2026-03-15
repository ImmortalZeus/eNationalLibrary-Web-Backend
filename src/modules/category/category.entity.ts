import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
    @PrimaryColumn({ type: 'varchar', nullable: false, unique: true })
    categoryId: string;

    @Column({ type: 'varchar', nullable: false })
    label: string;

    @Column({ type: 'varchar', nullable: false })
    description: string;
}