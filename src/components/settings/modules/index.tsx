// src/components/settings/modules/index.tsx
import React from 'react';
import { SettingsPage } from '@/contexts/SettingsRegistryContext';

const ModulesSettings: React.FC = () => {
    return (
        <div>
            <h2>Modules</h2>
            <p>Manage and configure your installed modules.</p>
            <ul>
                <li>Module 1 - Enabled</li>
                <li>Module 2 - Disabled</li>
                <li>Module 3 - Enabled</li>
            </ul>
        </div>
    );
};

const modulesSettings: SettingsPage = {
    id: 'modules',
    label: 'Modules',
    category: 'panel',
    component: ModulesSettings,
    type: 'secondary'
};

export default modulesSettings;