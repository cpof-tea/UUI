import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/test-utils';
import { NotificationCard } from '../NotificationCard';
import {
    ClearNotification, ErrorNotification, HintNotification, SuccessNotification, WarningNotification,
} from '@epam/uui';
import { ReactComponent as AcceptIcon } from '../../icons/accept-12.svg';

describe('NotificationCard', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<NotificationCard icon={ AcceptIcon } id={ 1 } key="test" color="sun" onClose={ jest.fn() } onSuccess={ jest.fn() } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with icon', async () => {
        const tree = await renderSnapshotWithContextAsync(<NotificationCard icon={ AcceptIcon } id={ 1 } key="test" color="sun" onClose={ jest.fn() } onSuccess={ jest.fn() } />);
        expect(tree).toMatchSnapshot();
    });
});

describe('WarningNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<WarningNotification id={ 1 } key="test" onClose={ jest.fn() } onSuccess={ jest.fn() } />);
        expect(tree).toMatchSnapshot();
    });
});

describe('SuccessNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<SuccessNotification id={ 1 } key="test" onClose={ jest.fn() } onSuccess={ jest.fn() } />);
        expect(tree).toMatchSnapshot();
    });
});

describe('HintNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<HintNotification id={ 1 } key="test" onClose={ jest.fn() } onSuccess={ jest.fn() } />);
        expect(tree).toMatchSnapshot();
    });
});

describe('ErrorNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<ErrorNotification id={ 1 } key="test" onClose={ jest.fn() } onSuccess={ jest.fn() } />);
        expect(tree).toMatchSnapshot();
    });
});

describe('ClearNotification', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<ClearNotification key="test" />);
        expect(tree).toMatchSnapshot();
    });
});
