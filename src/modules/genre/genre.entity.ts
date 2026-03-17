import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'genres' })
export class Genre {
    @PrimaryColumn({ type: 'varchar', nullable: false, unique: true })
    genreId: string;

    @Column({ type: 'varchar', nullable: false })
    label: string;

    @Column({ type: 'varchar', nullable: false })
    description: string;
}