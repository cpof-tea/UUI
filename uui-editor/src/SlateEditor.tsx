import React, { useCallback, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IEditable, uuiMod, IHasCX, cx, IHasRawProps } from '@epam/uui-core';
import { ScrollBars } from '@epam/uui-components';

import {
    Plate,
    createPlugins,
    createPlateUI,
    usePlateEditorState,
    isEditorFocused,
    TRenderElementProps,
    TEditableProps,
    Toolbar,
    createSoftBreakPlugin,
    createParagraphPlugin,
    createExitBreakPlugin,
} from '@udecode/plate';

import {
    ToolbarButtons,
    MarkBalloonToolbar,
} from './plate/plugins/Toolbars';

import { migrateSchema } from './migration';

import { baseMarksPlugin } from './plate/plugins';

import style from '@epam/assets/scss/promo/typography.scss';
import css from './SlateEditor.scss';

let components = createPlateUI();

export const defaultPlugins: any = [
    createSoftBreakPlugin(),
    createExitBreakPlugin(),
    createParagraphPlugin(),
];

export const basePlugins: any = [
    baseMarksPlugin(),
    ...defaultPlugins,
];

interface SlateEditorProps extends IEditable<any | null>, IHasCX, IHasRawProps<HTMLDivElement>  {
    isReadonly?: boolean;
    plugins?: any[];
    autoFocus?: boolean;
    minHeight?: number | 'none';
    placeholder?: string;
    mode?: 'form' | 'inline';
    fontSize?: '14' | '16';
    onKeyDown?: (event: KeyboardEvent, value: any | null) => void;
    onBlur?: (event: FocusEvent, value: any | null) => void;
    scrollbars?: boolean;
}

let id = Date.now();

export function SlateEditor(props: SlateEditorProps) {
    const {
        autoFocus,
        isReadonly,
        placeholder,
    } = props;
    const currentId = String(id++);
    const editor = usePlateEditorState();
    const isFocused = isEditorFocused(editor);

    const plugins = createPlugins((props.plugins || []).flat(), {
        components,
    });

    const editableProps: TEditableProps = {
        autoFocus,
        readOnly: isReadonly,
        placeholder,
    };

    const onChange = (value: any) => {
        //props?.onValueChange(value);
    };

    const renderElement = (props: TRenderElementProps): JSX.Element => {
        const { attributes, children } = props;

        return <p { ...attributes }>{ children }</p>;
    };

    const initialValue = useMemo(() => migrateSchema(props.value), [props.value]);

    const renderEditor = useCallback(() => (
        <DndProvider backend={ HTML5Backend }>
            <Plate
                onChange={ onChange }
                editableProps={ editableProps }
                renderElement={ renderElement }
                id={ currentId }
                plugins={ plugins }
                initialValue={ initialValue }
            >
                <MarkBalloonToolbar />
                <Toolbar id={ currentId } style={ {
                    position: 'sticky',
                    bottom: 12,
                    display: 'flex',
                } }>
                    <ToolbarButtons />
                </Toolbar>
            </Plate>
        </DndProvider>
    ), [editableProps, currentId, plugins, initialValue]);

    return (
        <div
            className={ cx(
                props.cx,
                css.container,
                css['mode-' + (props.mode || 'form')],
                (!props.isReadonly && isFocused) && uuiMod.focus,
                props.isReadonly && uuiMod.readonly,
                props.scrollbars && css.withScrollbars,
                // from slate editor
                style.typographyPromo,
                props.fontSize == '16' ? style.typography16 : style.typography14,
            ) }
            //@ts-ignore
            style={ { minHeight: props.minHeight || 350, padding: '0 24px' } as any }
            { ...props.rawProps }
        >
            { props.scrollbars
                ? <ScrollBars cx={ css.scrollbars }>
                    { renderEditor() }
                </ScrollBars>
                : renderEditor()
            }
        </div>
    );
}
