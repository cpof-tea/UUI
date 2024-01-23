import React, { useMemo, useState } from 'react';
import { DataColumnProps, useDataRows, useTree } from '@epam/uui-core';
import { DataTable, Panel, Text } from '@epam/uui';
import { demoData, FeatureClass } from '@epam/uui-docs';
import css from './TablesExamples.module.scss';

export default function ArrayDataTableExample() {
    const [dataSourceState, setDataSourceState] = useState({});

    const { tree, ...dataRowProps } = useTree({
        getId: (item) => item.id,
        dataSourceState,
        setDataSourceState,
        items: demoData.featureClasses,
    }, []);

    const { listProps, rows } = useDataRows({
        tree,
        ...dataRowProps,
    });

    const productColumns: DataColumnProps<FeatureClass>[] = useMemo(
        () => [
            {
                key: 'id',
                caption: 'Id',
                render: (item) => <Text color="primary">{item.id}</Text>,
                isSortable: true,
                isAlwaysVisible: true,
                width: 100,
            }, {
                key: 'name',
                caption: 'Name',
                render: (item) => <Text color="primary">{item.name}</Text>,
                isSortable: true,
                width: 300,
            }, {
                key: 'description',
                caption: 'Description',
                render: (item) => <Text color="primary">{item.description}</Text>,
                grow: 1,
                width: 300,
            },
        ],
        [],
    );

    return (
        <Panel background="surface-main" shadow cx={ css.container }>
            <DataTable
                { ...listProps }
                rows={ rows }
                value={ dataSourceState }
                onValueChange={ setDataSourceState }
                columns={ productColumns }
                headerTextCase="upper"
            />
        </Panel>
    );
}
