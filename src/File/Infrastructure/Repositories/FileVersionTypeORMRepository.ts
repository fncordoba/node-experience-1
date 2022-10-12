import IFileVersionRepository from './IFileVersionRepository';
import ICriteria from '../../../Shared/Presentation/Requests/ICriteria';
import IPaginator from '../../../Shared/Infrastructure/Orm/IPaginator';

import TypeORMPaginator from '../../../Shared/Infrastructure/Orm/TypeORMPaginator';
import FileFilter from '../../Presentation/Criterias/FileFilter';
import FileVersionSchema from '../Schemas/FileVersionTypeORM';
import FileVersion from '../../Domain/Entities/FileVersion';
import IFileVersionDomain from '../../Domain/Entities/IFileVersionDomain';

import BaseTypeORMRepository from '../../../Shared/Infrastructure/Repositories/BaseTypeORMRepository';

class FileVersionTypeORMRepository extends BaseTypeORMRepository<IFileVersionDomain> implements IFileVersionRepository
{
    constructor()
    {
        super(FileVersion.name, FileVersionSchema);
    }

    async list(criteria: ICriteria): Promise<IPaginator>
    {
        const queryBuilder = this.repository.createQueryBuilder('i');

        const filter = criteria.getFilter();

        queryBuilder.where('1 = 1');

        if (filter.has(FileFilter.NAME))
        {
            const name = filter.get(FileFilter.NAME);

            queryBuilder.andWhere(`i.${FileFilter.NAME} ilike :${FileFilter.NAME}`);
            queryBuilder.setParameter(FileFilter.NAME, `%${name}%`);
        }

        return new TypeORMPaginator(queryBuilder, criteria);
    }

    async getLastOneBy(conditions: Record<string, any>): Promise<IFileVersionDomain>
    {
        const options: any = {
            ...conditions,
            order: { createdAt: 'DESC' },
            take: 1
        };
        const [fileVersion] = await this.repository.find(options);

        return fileVersion;
    }
}

export default FileVersionTypeORMRepository;
