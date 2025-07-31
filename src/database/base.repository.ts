import {
    Document,
    FilterQuery,
    ProjectionType,
    QueryOptions,
    UpdateQuery,
    Model,
    PopulateOptions
} from 'mongoose';

export type FindType<T> = {
    projection?: ProjectionType<T> | null | string;
    options?: QueryOptions<T> | null;
    populateOptions?: PopulateOptions | PopulateOptions[] | null;
    page?: number;
    limit?: number;
    sort?: string;
    sortOrder?: string;
    search?: string;
    omitFields?: string[];
    conditions?: string[];
};
type QueryMethods = 'find' | 'findOne' | 'findById';
export abstract class BaseRepository<T extends Document> {
    // eslint-disable-next-line no-useless-constructor
    constructor(public readonly BaseModel: Model<T>) {}

    async create(doc: Partial<T>): Promise<T> {
        const createdEntity = new this.BaseModel(doc);
        const savedEntity = await createdEntity.save();
        return savedEntity;
    }

    async findOne(
        filterQuery: FilterQuery<T>,
        option: FindType<T> = {},
        includePassword = false
    ): Promise<T | null> {
        return this._findBy(filterQuery, option, 'findOne', includePassword);
    }

    async _findBy(
        filterQuery: FilterQuery<T> | string,
        {
            projection = null,
            options = null,
            populateOptions = null
        }: FindType<T>,
        queryMethod: QueryMethods,
        includePassword = false
    ) {
        let query = (this.BaseModel[queryMethod] as any)(
            filterQuery,
            projection,
            options
        );
        if (includePassword) {
            query = query.select('+password');
        }
        if (populateOptions) {
            query.populate(populateOptions);
        }
        const result = await query;
        return result;
    }

    async findById(
        id: string,
        option: FindType<T> = {},
        includePassword = false
    ): Promise<T | null> {
        return this._findBy(id, option, 'findById', includePassword);
    }

    async find(
        filterQuery: FilterQuery<T>,
        option: FindType<T> = {},
        includePassword = false
    ): Promise<T[]> {
        return this._findBy(filterQuery, option, 'find', includePassword);
    }

    async update(
        filterQuery: FilterQuery<T>,
        updateQuery: UpdateQuery<T>
    ): Promise<T | null> {
        const updatedEntity = await this.BaseModel.findOneAndUpdate(
            filterQuery,
            updateQuery,
            {
                new: true,
                runValidators: true
            }
        ).exec();

        return updatedEntity;
    }

    async deleteOne(filterQuery: FilterQuery<T>): Promise<boolean> {
        const deleteResult = await this.BaseModel.deleteOne(filterQuery).exec();
        return deleteResult.deletedCount >= 1;
    }

    async insertMany(documents: T[]): Promise<T[]> {
        const insertedDocuments = await this.BaseModel.insertMany(documents);
        return insertedDocuments;
    }

    async aggregate(pipeline: any[]): Promise<any[]> {
        const result = await this.BaseModel.aggregate(pipeline).exec();
        return result;
    }

    async findWithPagination(
        filterQuery: FilterQuery<T>,
        options: FindType<T> = {}
    ) {
        const page = Number(options.page) || 1;
        const limit = Math.min(Number(options.limit) || 20, 200);
        const skip = (page - 1) * limit;

        try {
            let queryConditions = { ...filterQuery };

            // Apply search if provided
            if (options.search && options.conditions?.length) {
                const regex = new RegExp(options.search, 'i'); // Case-insensitive search
                const searchConditions = options.conditions.map((field) => ({
                    [field]: { $regex: regex }
                }));

                queryConditions = {
                    ...queryConditions,
                    $or: searchConditions
                };
            }

            // Build the base query
            let query = this.BaseModel.find(queryConditions)
                .skip(skip)
                .limit(limit)
                .lean();

            // Apply sorting if provided
            if (options.sort) {
                const sortField = options.sort || '_id'; // Default sort field: _id
                const sortOrder = options.sortOrder === 'asc' ? 1 : -1; // Default to descending
                query = query.sort({ [sortField]: sortOrder });
                // query = query.sort(options.sort);
            }

            // Apply projection if provided
            if (options.projection) {
                if (
                    typeof options.projection === 'string' ||
                    Array.isArray(options.projection)
                ) {
                    query = query.select(options.projection) as any;
                } else if (
                    typeof options.projection === 'object' &&
                    options.projection !== null
                ) {
                    query = query.select(
                        options.projection as Record<string, 1 | 0>
                    ) as any;
                }
            }

            // Select fields to omit if specified
            if (options.omitFields?.length) {
                const omittedFields = options.omitFields
                    .map((field) => `-${field}`)
                    .join(' ');
                query = query.select(omittedFields) as any;
            }

            // Apply population if provided
            if (options.populateOptions) {
                query = query.populate(options.populateOptions);
            }

            // Execute the query and get results
            const [result, total] = await Promise.all([
                query.exec(),
                this.BaseModel.countDocuments(queryConditions).exec()
            ]);

            return {
                result,
                pagination: {
                    total,
                    currentPage: page,
                    pageSize: limit
                }
            };
        } catch (error) {
            console.error('Error executing findWithPagination:', error);
            throw new Error('Failed to fetch data');
        }
    }

    async count(filterQuery: FilterQuery<T>) {
        const count = await this.BaseModel.countDocuments(filterQuery).exec();
        return count;
    }
}
