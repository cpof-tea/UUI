import { useMemo } from 'react';
import { NodeStats } from './stats';
import { TreeState } from '../tree/newTree';

export interface UseSelectAllProps<TItem, TId> {
    tree: TreeState<TItem, TId>;
    selectAll?: boolean;
    stats: NodeStats;
    checked?: TId[];
    areCheckboxesVisible: boolean;
    handleSelectAll: (isChecked: boolean) => void;
}

export function useSelectAll<TItem, TId>(props: UseSelectAllProps<TItem, TId>) {
    const isSelectAllEnabled = useMemo(() => props.selectAll === undefined ? true : props.selectAll, [props.selectAll]);

    const selectAll = useMemo(() => {
        if (props.stats.isSomeCheckable && isSelectAllEnabled) {
            return {
                value: props.stats.isSomeCheckboxEnabled ? props.stats.isAllChecked : false,
                onValueChange: props.handleSelectAll,
                indeterminate: props.checked && props.checked.length > 0 && !props.stats.isAllChecked,
            };
        } else if (props.tree.visible.getRootIds().length === 0 && props.areCheckboxesVisible && isSelectAllEnabled) {
            // Nothing loaded yet, but we guess that something is checkable. Add disabled checkbox for less flicker.
            return {
                value: false,
                onValueChange: () => {},
                isDisabled: true,
                indeterminate: props.checked?.length > 0,
            };
        }
        return null;
    }, [
        props.tree.visible,
        props.areCheckboxesVisible,
        props.checked,
        props.stats,
        isSelectAllEnabled,
        props.handleSelectAll,
    ]);

    return selectAll;
}
