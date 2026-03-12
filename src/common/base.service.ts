import { Model, HydratedDocument, QueryFilter, UpdateQuery } from 'mongoose';

export class BaseService<TSchema> {
    constructor(public model: Model<TSchema>) {}

    async create(dto: Partial<TSchema>): Promise<HydratedDocument<TSchema>> {
        return this.model.create(dto);
    }

    async findAll(filter: QueryFilter<TSchema> = {}): Promise<HydratedDocument<TSchema>[]> {
        return this.model.find(filter).exec();
    }

    async findOne(id: string): Promise<HydratedDocument<TSchema> | null>;
    async findOne(filter: QueryFilter<TSchema>): Promise<HydratedDocument<TSchema> | null>;
    async findOne(arg: string | QueryFilter<TSchema>): Promise<HydratedDocument<TSchema> | null> {
        const filter = typeof arg === "string" ? {_id: arg} : arg;

        return this.model.findOne(filter).exec();
    }

    async update(id: string, dto: UpdateQuery<TSchema>): Promise<HydratedDocument<TSchema> | null>;
    async update(filter: { _id: string }, dto: UpdateQuery<TSchema>): Promise<HydratedDocument<TSchema> | null>;
    async update(arg: string | { _id: string }, dto: UpdateQuery<TSchema>): Promise<HydratedDocument<TSchema> | null> {
        const id = typeof arg === "string" ? arg : arg._id;

        return this.model.findOneAndUpdate({ _id: id }, dto, { new: true, runValidators: true }).exec();
    }

    async remove(id: string): Promise<HydratedDocument<TSchema> | null>;
    async remove(filter: { _id: string }): Promise<HydratedDocument<TSchema> | null>;
    async remove(arg: string | { _id: string }): Promise<HydratedDocument<TSchema> | null> {
        const id = typeof arg === "string" ? arg : arg._id;

        return this.model.findByIdAndDelete(id).exec();
    }
}
