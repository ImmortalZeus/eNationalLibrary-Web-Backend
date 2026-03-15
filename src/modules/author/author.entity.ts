import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'authors' })
export class Author {
    @PrimaryColumn({ type: 'varchar', nullable: false, unique: true })
    authorId: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'date', nullable: false })
    dateOfBirth: Date;

    @Column({ type: 'date', nullable: true })
    dateOfDeath: Date | null;

    @Column({ type: 'varchar', nullable: false })
    description: string;
}