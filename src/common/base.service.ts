import { Model, HydratedDocument, QueryFilter, UpdateQuery } from 'mongoose';
import { plainToInstance } from 'class-transformer';

export class BaseService<TSchema, TPublicDto> {
    constructor(
        protected readonly model: Model<TSchema>,
        private readonly publicDtoClass: new (...args: any[]) => TPublicDto
    ) {}

    async create(dto: Partial<TSchema>): Promise<TPublicDto> {
        const doc = await this.model.create(dto);
        return plainToInstance(this.publicDtoClass, doc.toObject(), {
            excludeExtraneousValues: true,
        })
    }

    async findAll(filter: QueryFilter<TSchema> = {}): Promise<TPublicDto[]> {
        const docs = await this.model.find(filter).lean().exec();
        return plainToInstance(this.publicDtoClass, docs, {
            excludeExtraneousValues: true,
        });
    }

    async findOne(id: string): Promise<TPublicDto | null>;
    async findOne(filter: QueryFilter<TSchema>): Promise<TPublicDto | null>;
    async findOne(arg: string | QueryFilter<TSchema>): Promise<TPublicDto | null> {
        const filter = typeof arg === "string" ? {_id: arg} : arg;
        const doc = await this.model.findOne(filter).lean().exec();
        return doc
            ? plainToInstance(this.publicDtoClass, doc, { excludeExtraneousValues: true })
            : null;
    }

    async findById(id: string): Promise<TPublicDto | null> {
        return this.findOne(id);
    }

    async update(id: string, dto: UpdateQuery<TSchema>): Promise<TPublicDto | null>;
    async update(filter: { _id: string }, dto: UpdateQuery<TSchema>): Promise<TPublicDto | null>;
    async update(arg: string | { _id: string }, dto: UpdateQuery<TSchema>): Promise<TPublicDto | null> {
        const id = typeof arg === "string" ? arg : arg._id;

        const doc = await this.model.findOneAndUpdate({ _id: id }, dto, {
            new: true,
            runValidators: true,
        }).lean().exec();

        return doc
            ? plainToInstance(this.publicDtoClass, doc, { excludeExtraneousValues: true })
            : null;
    }

    async remove(id: string): Promise<TPublicDto | null>;
    async remove(filter: { _id: string }): Promise<TPublicDto | null>;
    async remove(arg: string | { _id: string }): Promise<TPublicDto | null> {
        const id = typeof arg === "string" ? arg : arg._id;
        const doc = await this.model.findOneAndDelete({ _id: id }).lean().exec();
        return doc
            ? plainToInstance(this.publicDtoClass, doc, { excludeExtraneousValues: true })
            : null;
    }
}
