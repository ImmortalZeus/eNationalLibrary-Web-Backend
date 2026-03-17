import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'books' })
export class Book {
    @PrimaryColumn({ type: 'varchar', nullable: false, unique: true })
    bookId: string;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'varchar', array: true, nullable: false, default: [] })
    authorIds: string[];

    @Column({ type: 'varchar', nullable: false })
    description: string;
    
    @Column({ type: 'varchar', nullable: false })
    publisherId: string;

    @Column({ type: 'varchar', array: true, nullable: false, default: [] })
    genreIds: string[];
    
    @Column({ type: 'varchar', nullable: false })
    previewUrl: string;
}