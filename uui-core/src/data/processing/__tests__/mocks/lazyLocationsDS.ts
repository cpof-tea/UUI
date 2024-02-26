import { Location, demoData } from '@epam/uui-docs';
import { getLazyDataSourceMock } from '@epam/uui-test-utils';

import { LazyDataSourceProps } from '../../LazyDataSource';
import { DataQueryFilter } from '../../../../types';
import { runDataQuery } from '../../../querying';

type Props<TItem, TId, TFilter> = Partial<LazyDataSourceProps<TItem, TId, TFilter>>;

export type LocationItem = Omit<Location, 'children'>;

export function getLazyLocationsDS(props: Props<LocationItem, string, DataQueryFilter<LocationItem>>) {
    return getLazyDataSourceMock(
        demoData.locations,
        {
            getId: ({ id }) => id,
            getParentId: ({ parentId }) => parentId,
            getChildCount: ({ childCount }) => childCount,

            ...props,
        },
    );
}

export function getLazyPagedLocationsDS(props: Props<LocationItem, string, DataQueryFilter<LocationItem>>) {
    return getLazyLocationsDS({
        api: async (request, ctx) => {
            const range = request.page != null || request.pageSize != null ? undefined : request.range;
            const data = runDataQuery(demoData.locations, ctx?.parent
                ? { ...request, filter: { parentId: ctx.parentId, ...request.filter } as DataQueryFilter<LocationItem>, range }
                : { ...request, filter: { parentId: { isNull: true }, ...request.filter } as DataQueryFilter<LocationItem>, range });

            if (request.page != null || request.pageSize != null) {
                const { page = 1, pageSize = 10 } = request;
                const from = page - 1;
                const items = data.items.slice(from * pageSize, (from + 1) * pageSize);
                return {
                    items,
                    totalCount: data.items.length,
                    count: request.page != null ? items.length : data.items.length,
                    pageCount: Math.ceil(data.items.length / pageSize),
                };
            }

            return data;
        },
        ...props,
    });
}
