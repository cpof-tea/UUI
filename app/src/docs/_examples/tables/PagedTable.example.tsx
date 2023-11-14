import React, { useCallback, useMemo, useState } from 'react';
import {
    DataColumnProps, useLazyDataSource, DataSourceState, LazyDataSourceApiRequest, useUuiContext,
} from '@epam/uui-core';
import {
    DataTable, Panel, Text, Paginator, FlexRow,
} from '@epam/promo';
import { Person } from '@epam/uui-docs';
import css from './TablesExamples.module.scss';
import { FlexSpacer } from '@epam/uui-components';

export interface PagedTableState extends DataSourceState<{}> {
    page?: number;
    pageSize?: number;
    totalCount?: number;
}

export default function PagedTable() {
    const svc = useUuiContext();
    const [state, setState] = useState<PagedTableState>({
        page: 1, visibleCount: 15, totalCount: 0, pageSize: 100,
    });

    const columns: DataColumnProps<Person>[] = useMemo(
        () => [
            {
                key: 'name',
                caption: 'Name',
                render: (person) => (
                    <Text color="gray80" font="sans-semibold">
                        {person.name}
                    </Text>
                ),
                isSortable: true,
                grow: 1,
                width: 224,
            }, {
                key: 'location',
                caption: 'Location',
                render: (person) => <Text>{person.locationName}</Text>,
                width: 144,
            },
        ],
        [],
    );

    const api = useCallback(
        async (rq: LazyDataSourceApiRequest<{}>) => {
            const result = await svc.api.demo.personsPaged({
                ...rq,
                filter: { departmentId: 13 }, // to get less results and non round-numbered number of people
                page: state.page - 1, // server counts from 0, UI - from 1
                pageSize: state.pageSize,
            });
            // setState((s) => ({ ...s, totalCount: result.totalCount }));
            result.from = 0;
            return result;
        },
        [state.page, state.pageSize, svc.api.demo],
    );

    const dataSource = useLazyDataSource<Person, number, unknown>({
        api,
        rowOptions: {
            checkbox: {
                isVisible: true,
            },
        },
        backgroundReload: true,
    }, [state.page]);
    const view = dataSource.useView(state, setState, {});

    const listProps = view.getListProps();
    console.log('listProps', listProps);
    return (
        <Panel shadow cx={ css.container }>
            <DataTable { ...listProps } getRows={ view.getVisibleRows } value={ state } onValueChange={ setState } columns={ columns } headerTextCase="upper" />
            <FlexRow size="36" padding="12" background="gray5">
                <FlexSpacer />
                <Paginator
                    value={ state.page }
                    onValueChange={ (newPage) => setState({ ...state, page: newPage, scrollTo: { index: 0 } }) }
                    totalPages={ Math.ceil(listProps.totalCount / state.pageSize) }
                    size="30"
                />
                <FlexSpacer />
            </FlexRow>
        </Panel>
    );
}
