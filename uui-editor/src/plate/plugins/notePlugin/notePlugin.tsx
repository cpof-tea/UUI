import React from 'react';
import { Dropdown } from '@epam/uui-components';

import {
    createPluginFactory,
    getBlockAbove,
    PlateEditor,
    ToolbarButton as PlateToolbarButton,
    insertText,
    getAboveNode,
    setElements,
    createNode,
} from '@udecode/plate';

import { isPluginActive } from '../../../helpers';

import { ToolbarButton } from '../../implementation/ToolbarButton';
import { NoteBar } from '../../../implementation/NoteBar';

import { ReactComponent as NoteIcon } from '../../../icons/info-block-quote.svg';

import { NotePluginBlock } from './NotePluginBlock';
import { getBlockAboveByType } from '../../utils/getAboveBlock';

const noteBlocks = ['note-error', 'note-warning', 'note-link', 'note-quote'];

const Note = (props: any) => {
    return <NotePluginBlock
        { ...props }
        type={ props.element.type.replace('note-', '') }
    />;
};

export const notePlugin = () => {
    const createNotePlugin = createPluginFactory({
        key: 'note',
        isElement: true,
        isVoid: false,
        component: Note,
        handlers: {
            // TODO: potential handler improvement by https://github.com/ianstormtaylor/slate/issues/97
            onKeyDown: (editor) => (event) => {
                const isNoteEntry = !!getBlockAboveByType(editor, ['note-link', 'note-error', 'note-warning', 'note-quote']);
                if (!isNoteEntry || event.key !== 'Enter') return;

                const [entries] = getAboveNode(editor);
                const textExist = entries.children.some(item => !!item.text);
                if (event.shiftKey) {
                    event.preventDefault();
                    insertText(editor, '\n');
                    return true;
                } else if (!textExist) {
                    setElements(editor, createNode());
                }
            },
        },
        plugins: [
            {
                key: 'note-error',
                type: 'note-error',
                isElement: true,
                isVoid: false,
                component: Note,
            },
            {
                key: 'note-warning',
                type: 'note-warning',
                isElement: true,
                isVoid: false,
                component: Note,
            },
            {
                key: 'note-link',
                type: 'note-link',
                isElement: true,
                isVoid: false,
                component: Note,
            },
            {
                key: 'note-quote',
                type: 'note-quote',
                isElement: true,
                isVoid: false,
                component: Note,
            },
        ],
    });
    return createNotePlugin();
};

interface IToolbarNote {
    editor: PlateEditor;
}

export const NoteButton = ({ editor }: IToolbarNote) => {

    if (!isPluginActive('note')) return null;

    const block = getBlockAbove(editor, { block: true });
    const type: any = block?.length && block[0].type;

    return (
        <Dropdown
            renderTarget={ (props) => (
                <PlateToolbarButton
                    styles={ { root: { width: 'auto', cursor: 'pointer', padding: '0px' } } }
                    active={ true }
                    onMouseDown={
                        editor
                            ? (e) => e.preventDefault()
                            : undefined
                    }
                    icon={ <ToolbarButton
                        isActive={ noteBlocks.includes(type) }
                        icon={ NoteIcon }
                        { ...props }
                    /> }
                />
            ) }
            renderBody={ (props) => <NoteBar editor={ editor } type={ type } { ...props } /> }
            placement='top-start'
            modifiers={ [{ name: 'offset', options: { offset: [0, 3] } }] }
        />
    );
};