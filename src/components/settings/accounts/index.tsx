// src/components/settings/modules/index.tsx
import React from 'react';
import { SettingsPage } from '@/contexts/SettingsRegistryContext';

const AccountSettings: React.FC = () => {
    return (
        <div>
            <h2>Accounts</h2>
            <p>Manage and configure your installed modules.</p>
            <ul>
                <li>Module 1 - Enabled</li>
                <li>Module 2 - Disabled</li>
                <li>Module 3 - Enabled</li>
            </ul>
        </div>
    );
};

const accountSettings: SettingsPage = {
    id: 'accounts',
    label: 'Accounts',
    category: 'panel',
    component: AccountSettings,
};

export default accountSettings;