import { Repository, DeepPartial, FindOptions, QueryDeepPartialEntity, ObjectLiteral, FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { plainToInstance } from 'class-transformer';

export class BaseService<TEntity extends ObjectLiteral, TPublicDto> {
    private readonly idField: keyof TEntity;
    protected readonly repo: Repository<TEntity>;
    private readonly publicDtoClass: new (...args: any[]) => TPublicDto;

    constructor(
        repo: Repository<TEntity>,
        publicDtoClass: new (...args: any[]) => TPublicDto,
    ) {
        this.repo = repo;
        this.publicDtoClass = publicDtoClass;

        const primaryColumn = this.repo.metadata.primaryColumns[0];
        this.idField = primaryColumn.propertyName as keyof TEntity;;
    }

    async create(dto: DeepPartial<TEntity>): Promise<TPublicDto> {
        const entity = this.repo.create(dto);
        const saved = await this.repo.save(entity);
        return plainToInstance(this.publicDtoClass, saved, {
            excludeExtraneousValues: true,
        });
    }

    async findOneById(id: string | Partial<TEntity>): Promise<TPublicDto | null> {
        let options: FindOptionsWhere<TEntity>;
        if (typeof id === 'string' || typeof id === 'number') {
            // Trường hợp chỉ có 1 primary key
            options = { [this.idField]: id } as FindOptionsWhere<TEntity>;
        } else {
            // Trường hợp composite key: truyền object chứa đủ các key
            options = id as FindOptionsWhere<TEntity>;
        }

        const entity = await this.repo.findOne({ where: options });
        return entity
            ? plainToInstance(this.publicDtoClass, entity, { excludeExtraneousValues: true })
            : null;
    }

    async findOneByOptions(options: FindOptionsWhere<TEntity>): Promise<TPublicDto | null> {
        const entity = await this.repo.findOne({ where: options });
        return entity
            ? plainToInstance(this.publicDtoClass, entity, { excludeExtraneousValues: true })
            : null;
    }

    async findManyByOptions(options: FindOptionsWhere<TEntity>): Promise<TPublicDto[]> {
        const entities = await this.repo.find({ where: options });
        return plainToInstance(this.publicDtoClass, entities, {
            excludeExtraneousValues: true,
        });
    }

    async findAll(): Promise<TPublicDto[]> {
        const entities = await this.repo.find({ where: {} });
        return plainToInstance(this.publicDtoClass, entities, {
            excludeExtraneousValues: true,
        });
    }

    async updateOneById(id: string | Partial<TEntity>, dto: QueryDeepPartialEntity<TEntity>): Promise<TPublicDto | null> {
        let options: FindOptionsWhere<TEntity>;
        if (typeof id === 'string' || typeof id === 'number') {
            // Trường hợp chỉ có 1 primary key
            options = { [this.idField]: id } as FindOptionsWhere<TEntity>;
        } else {
            // Trường hợp composite key: truyền object chứa đủ các key
            options = id as FindOptionsWhere<TEntity>;
        }

        await this.repo.update(options, dto);
        const updatedEntity = await this.repo.findOne({ where: options });
        return updatedEntity
            ? plainToInstance(this.publicDtoClass, updatedEntity, { excludeExtraneousValues: true })
            : null;
    }

    async updateOneByOptions(options: FindOptionsWhere<TEntity>, dto: QueryDeepPartialEntity<TEntity>): Promise<TPublicDto | null> {
        await this.repo.update(options, dto);
        const updatedEntity = await this.repo.findOne({ where: options });
        return updatedEntity
            ? plainToInstance(this.publicDtoClass, updatedEntity, { excludeExtraneousValues: true })
            : null;
    }

    async updateManyByOptions(options: FindOptionsWhere<TEntity>, dto: QueryDeepPartialEntity<TEntity>): Promise<TPublicDto[]> {
        await this.repo.update(options, dto);
        const updatedEntities = await this.repo.find({ where: options });
        return plainToInstance(this.publicDtoClass, updatedEntities, { excludeExtraneousValues: true });
    }

    async removeOneById(id: string): Promise<TPublicDto | null> {
        let options: FindOptionsWhere<TEntity>;
        if (typeof id === 'string' || typeof id === 'number') {
            // Trường hợp chỉ có 1 primary key
            options = { [this.idField]: id } as FindOptionsWhere<TEntity>;
        } else {
            // Trường hợp composite key: truyền object chứa đủ các key
            options = id as FindOptionsWhere<TEntity>;
        }

        const entity = await this.repo.findOne({ where: options });
        if (!entity) return null;
        await this.repo.remove(entity);
        return plainToInstance(this.publicDtoClass, entity, { excludeExtraneousValues: true });
    }

    async removeOneByOptions(options: FindOptionsWhere<TEntity>): Promise<TPublicDto | null> {
        const entity = await this.repo.findOne({ where: options });
        if (!entity) return null;
        await this.repo.remove(entity);
        return plainToInstance(this.publicDtoClass, entity, { excludeExtraneousValues: true });
    }

    async removeManyByOptions(options: FindOptionsWhere<TEntity>): Promise<TPublicDto[]> {
        const entities = await this.repo.find({ where: options });
        await this.repo.remove(entities);
        return plainToInstance(this.publicDtoClass, entities, { excludeExtraneousValues: true });
    }
}
