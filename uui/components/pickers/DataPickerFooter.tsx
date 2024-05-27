import React, { PropsWithChildren } from 'react';
import { isMobile, PickerFooterProps } from '@epam/uui-core';
import { i18n } from '../../i18n';
import { Switch, SwitchProps } from '../inputs';
import { FlexCell, FlexRow, FlexRowProps, FlexSpacer } from '../layout';
import { LinkButton, LinkButtonProps } from '../buttons';
import { SizeMod } from '../types';
import { settings } from '../../settings';

type DataPickerFooterProps<TItem, TId> = PickerFooterProps<TItem, TId> &
SizeMod & {
    selectionMode: 'single' | 'multi';
};

function DataPickerFooterImpl<TItem, TId>(props: PropsWithChildren<DataPickerFooterProps<TItem, TId>>) {
    const {
        clearSelection,
        view,
        showSelected,
        selectionMode,
    } = props;
    const size = settings.sizes.dataPickerFooter.linkButton[isMobile() ? 'mobile' : props.size] as LinkButtonProps['size'];
    const hasSelection = view.getSelectedRowsCount() > 0;
    const rowsCount = view.getListProps().rowsCount;
    const isEmptyRowsAndHasNoSelection = (rowsCount === 0 && !hasSelection);

    const isSinglePicker = selectionMode === 'single';

    const clearAllText = i18n.pickerInput.clearSelectionButton;
    const clearSingleText = i18n.pickerInput.clearSelectionButtonSingle;
    const selectAllText = i18n.pickerInput.selectAllButton;

    // show always for multi picker and for single only in case if search not disabled.
    const shouldShowFooter = isSinglePicker ? !props.disableClear : true;

    return shouldShowFooter && (
        <FlexRow padding={ settings.sizes.dataPickerFooter.flexRowPadding as FlexRowProps['padding'] }>
            {!isSinglePicker && (
                <Switch
                    size={ settings.sizes.dataPickerFooter.switch[props.size] as SwitchProps['size'] }
                    value={ showSelected.value }
                    isDisabled={ !hasSelection }
                    onValueChange={ showSelected.onValueChange }
                    label={ i18n.pickerInput.showOnlySelectedLabel }
                />
            )}

            <FlexSpacer />

            <FlexCell width="auto" alignSelf="center">
                {view.selectAll && (
                    <LinkButton
                        size={ size }
                        caption={ hasSelection ? clearAllText : selectAllText }
                        onClick={ hasSelection ? clearSelection : () => view.selectAll.onValueChange(true) }
                        rawProps={ {
                            'aria-label': hasSelection ? clearAllText : selectAllText,
                        } }
                        isDisabled={ isEmptyRowsAndHasNoSelection }
                    />
                )}
                {!view.selectAll && (
                    <LinkButton
                        isDisabled={ !hasSelection }
                        size={ size }
                        caption={ isSinglePicker ? clearSingleText : clearAllText }
                        onClick={ clearSelection }
                        rawProps={ {
                            'aria-label': isSinglePicker ? clearSingleText : clearAllText,
                        } }
                    />
                )}
            </FlexCell>
        </FlexRow>
    );
}

export const DataPickerFooter = React.memo(DataPickerFooterImpl);
