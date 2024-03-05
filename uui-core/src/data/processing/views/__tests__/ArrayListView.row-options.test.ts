import { renderHook, waitFor } from '@epam/uui-test-utils';
import { DataQueryFilter, DataRowProps, DataSourceState, IDataSourceView } from '../../../../types';
import { LocationItem, getArrayLocationsDS } from '../../__tests__/mocks';
import { act } from 'react-dom/test-utils';

describe('ArrayListView - row options', () => {
    let currentValue: DataSourceState<DataQueryFilter<LocationItem>, string>;
    const onValueChanged = (newValue: React.SetStateAction<DataSourceState<DataQueryFilter<LocationItem>, string>>) => {
        if (typeof newValue === 'function') {
            currentValue = newValue(currentValue);
            return;
        }
        currentValue = newValue;
    };
    beforeEach(() => {
        jest.clearAllMocks();
        currentValue = { topIndex: 0, visibleCount: 3 };
    });

    function expectViewToLookLike(
        view: IDataSourceView<LocationItem, string, DataQueryFilter<LocationItem>>,
        rows: Partial<DataRowProps<LocationItem, string>>[],
    ) {
        const viewRows = view.getVisibleRows();
        expect(viewRows).toEqual(rows.map((r) => expect.objectContaining(r)));
    }
    describe('rowOptions', () => {
        it('should not allow checking if checkbox is not configured at rowOptions', async () => {
            const dataSource = getArrayLocationsDS({
                rowOptions: {},
            });

            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isCheckable: false, onCheck: undefined },
                    { id: 'c-EU', parentId: undefined, isCheckable: false, onCheck: undefined },
                ]);
            });
        });

        it('should not allow checking if checkbox is not visible at rowOptions', async () => {
            const checkbox = { isVisible: false };
            const dataSource = getArrayLocationsDS({
                rowOptions: { checkbox },
            });

            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                    { id: 'c-EU', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                ]);
            });
        });

        it('should not allow checking if checkbox is disabled at rowOptions', async () => {
            const checkbox = { isVisible: true, isDisabled: true };
            const dataSource = getArrayLocationsDS({
                rowOptions: { checkbox },
            });

            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                    { id: 'c-EU', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                ]);
            });
        });

        it('should selectAll be null, if checkbox is not configured at rowOptions', async () => {
            const dataSource = getArrayLocationsDS({
                rowOptions: {},
            });

            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isCheckable: false, onCheck: undefined },
                    { id: 'c-EU', parentId: undefined, isCheckable: false, onCheck: undefined },
                ]);
            });

            const view = hookResult.result.current;
            expect(view.selectAll).toBeNull();
        });

        it('should selectAll be null, if checkbox is not visible at rowOptions', async () => {
            const checkbox = { isVisible: false };
            const dataSource = getArrayLocationsDS({
                rowOptions: { checkbox },
            });

            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                    { id: 'c-EU', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                ]);
            });

            const view = hookResult.result.current;
            expect(view.selectAll).toBeNull();
        });

        it('should return selectAll, if checkbox is disabled at rowOptions', async () => {
            const checkbox = { isVisible: true, isDisabled: true };
            const dataSource = getArrayLocationsDS({
                rowOptions: { checkbox },
            });

            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                    { id: 'c-EU', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                ]);
            });

            const view = hookResult.result.current;
            expect(view.selectAll).not.toBeNull();
            expect(view.selectAll!.value).toBeFalsy();
            expect(typeof view.selectAll!.onValueChange).toBe('function');
            expect(view.selectAll!.indeterminate).toBeUndefined();
        });

        it('should return indeterminate = false for selectAll, if checkbox is visible and disabled at rowOptions and some item is checked', async () => {
            const checkbox = { isVisible: true, isDisabled: true };
            const dataSource = getArrayLocationsDS({
                rowOptions: { checkbox },
            });

            currentValue.checked = ['BJ'];
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isCheckable: false, isChecked: false, isChildrenChecked: true, onCheck: undefined, checkbox },
                    { id: 'c-EU', parentId: undefined, isCheckable: false, onCheck: undefined, checkbox },
                ]);
            });

            let view = hookResult.result.current;
            expect(view.selectAll).not.toBeNull();
            expect(view.selectAll!.value).toBeFalsy();
            expect(typeof view.selectAll!.onValueChange).toBe('function');
            expect(view.selectAll!.indeterminate).toBeFalsy();

            const afRow = view.getVisibleRows()[0];

            await act(() => {
                afRow.onFold?.(afRow);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isCheckable: false, isChecked: false, isChildrenChecked: true, onCheck: undefined, checkbox },
                    { id: 'DZ', isChecked: false },
                    { id: 'BJ', isChecked: true },
                ]);
            });
        });

        it('should return indeterminate = true for selectAll, if checkbox is visible and enabled at rowOptions and some item is checked', async () => {
            const checkbox = { isVisible: true };
            const dataSource = getArrayLocationsDS({
                rowOptions: { checkbox },
            });

            currentValue.checked = ['BJ'];
            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isCheckable: true, isChecked: false, isChildrenChecked: true, checkbox },
                    { id: 'c-EU', parentId: undefined, isCheckable: true, checkbox },
                ]);
            });

            let view = hookResult.result.current;
            expect(view.selectAll).not.toBeNull();
            expect(view.selectAll!.value).toBeFalsy();
            expect(typeof view.selectAll!.onValueChange).toBe('function');
            expect(view.selectAll!.indeterminate).toBeTruthy();

            const afRow = view.getVisibleRows()[0];

            await act(() => {
                afRow.onFold?.(afRow);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isCheckable: true, isChecked: false, isChildrenChecked: true, checkbox },
                    { id: 'DZ', isChecked: false },
                    { id: 'BJ', isChecked: true },
                ]);
            });
        });

        it('should disable rows if isDisabled is passed to rowOptions', async () => {
            const dataSource = getArrayLocationsDS({
                rowOptions: { isDisabled: true },
            });

            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isDisabled: true },
                    { id: 'c-EU', parentId: undefined, isDisabled: true },
                ]);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { rowOptions: { isDisabled: false } } });

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isDisabled: false },
                    { id: 'c-EU', parentId: undefined, isDisabled: false },
                ]);
            });
        });

        it('should allow row to be selectable if isSelectable is passed to rowOptions', async () => {
            const dataSource = getArrayLocationsDS({
                rowOptions: { isSelectable: true },
            });

            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isSelectable: true },
                    { id: 'c-EU', parentId: undefined, isSelectable: true },
                ]);
            });

            hookResult.rerender({ value: currentValue, onValueChange: onValueChanged, props: { rowOptions: { isSelectable: false } } });

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isSelectable: false },
                    { id: 'c-EU', parentId: undefined, isSelectable: false },
                ]);
            });
        });

        it('should pass onClick to rows if is specified at rowOptions', async () => {
            const onClick = jest.fn();
            const dataSource = getArrayLocationsDS({
                rowOptions: { onClick },
            });

            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, onClick },
                    { id: 'c-EU', parentId: undefined, onClick },
                ]);
            });

            const view = hookResult.result.current;
            const afRow = view.getVisibleRows()[0];

            await act(() => {
                afRow.onClick?.(afRow);
            });

            expect(onClick).toBeCalledTimes(1);
            expect(onClick).toBeCalledWith(afRow);
        });

        it('should pass link to rows if is specified at rowOptions', async () => {
            const link = {
                pathname: '/some-link',
            };

            const dataSource = getArrayLocationsDS({
                rowOptions: { link },
            });

            const hookResult = renderHook(
                ({ value, onValueChange, props }) => dataSource.useView(value, onValueChange, props),
                { initialProps: {
                    value: currentValue,
                    onValueChange: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, link },
                    { id: 'c-EU', parentId: undefined, link },
                ]);
            });
        });

        it('should pass value/onValueChange to rows if is specified at rowOptions', async () => {
            const value = { id: 'someID' } as LocationItem;
            const onValueChange = jest.fn();
            const rowOptions = { value, onValueChange };

            const dataSource = getArrayLocationsDS({
                rowOptions,
            });

            const hookResult = renderHook(
                ({ dataSourceState, setDataSourceState, props }) => dataSource.useView(dataSourceState, setDataSourceState, props),
                { initialProps: {
                    dataSourceState: currentValue,
                    setDataSourceState: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, ...rowOptions },
                    { id: 'c-EU', parentId: undefined, ...rowOptions },
                ]);
            });
        });

        it('should pass isReadonly to rows if is specified at rowOptions', async () => {
            const rowOptions = { isReadonly: true };

            const dataSource = getArrayLocationsDS({
                rowOptions,
            });

            const hookResult = renderHook(
                ({ dataSourceState, setDataSourceState, props }) => dataSource.useView(dataSourceState, setDataSourceState, props),
                { initialProps: {
                    dataSourceState: currentValue,
                    setDataSourceState: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, ...rowOptions },
                    { id: 'c-EU', parentId: undefined, ...rowOptions },
                ]);
            });
        });

        it('should pass isInvalid to rows if is specified at rowOptions', async () => {
            const rowOptions = { isInvalid: true };

            const dataSource = getArrayLocationsDS({
                rowOptions,
            });

            const hookResult = renderHook(
                ({ dataSourceState, setDataSourceState, props }) => dataSource.useView(dataSourceState, setDataSourceState, props),
                { initialProps: {
                    dataSourceState: currentValue,
                    setDataSourceState: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, ...rowOptions },
                    { id: 'c-EU', parentId: undefined, ...rowOptions },
                ]);
            });
        });

        it('should pin rows if pin function is specified at rowOptions', async () => {
            const rowOptions = { pin: (item) => item.id === 'c-AF' };

            const dataSource = getArrayLocationsDS({
                rowOptions,
            });

            const hookResult = renderHook(
                ({ dataSourceState, setDataSourceState, props }) => dataSource.useView(dataSourceState, setDataSourceState, props),
                { initialProps: {
                    dataSourceState: currentValue,
                    setDataSourceState: onValueChanged,
                    props: {},
                } },
            );

            await waitFor(() => {
                const view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isPinned: true },
                    { id: 'c-EU', parentId: undefined, isPinned: false },
                ]);
            });

            let view = hookResult.result.current;
            const euRow = view.getVisibleRows()[1];

            await act(() => {
                euRow.onFold?.(euRow);
            });

            hookResult.rerender({ dataSourceState: currentValue, setDataSourceState: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isPinned: true },
                    { id: 'c-EU', parentId: undefined, isPinned: false },
                    { id: 'GB', parentId: 'c-EU', isPinned: false },
                ]);
            });

            const afRow = view.getVisibleRows()[0];

            await act(() => {
                afRow.onFold?.(afRow);
            });
            hookResult.rerender({ dataSourceState: currentValue, setDataSourceState: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isPinned: true },
                    { id: 'DZ', parentId: 'c-AF', isPinned: false },
                    { id: 'BJ', parentId: 'c-AF', isPinned: false },
                ]);
            });

            currentValue.topIndex = 3;
            hookResult.rerender({ dataSourceState: currentValue, setDataSourceState: onValueChanged, props: {} });

            await waitFor(() => {
                view = hookResult.result.current;
                expectViewToLookLike(view, [
                    { id: 'c-AF', parentId: undefined, isPinned: true },
                    { id: 'GM', parentId: 'c-AF', isPinned: false },
                    { id: 'c-EU', parentId: undefined, isPinned: false },
                    { id: 'GB', parentId: 'c-EU', isPinned: false },
                ]);
            });
        });
    });
});
