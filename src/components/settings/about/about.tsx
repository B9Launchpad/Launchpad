// src/components/settings/modules/index.tsx
import React from 'react';
import WindowComponent from '@/components/common/Window';
import info from '@/app-info.json';
import { LaunchpadLogo } from '@/components/common/Logo';
import WindowBlock from '@/components/modules/FormBlock';


const SettingsAbout: React.FC = () => {
    const getCurrentYear = () => {
        const d: Date = new Date();
        let year = d.getFullYear();
        return year;
    }

    return (
        <WindowComponent>
            <div className='flex-row'>
                <LaunchpadLogo className='app__logo'/>
                <div className='flex-col' style={{paddingLeft: '6px'}}>
                    <WindowBlock>
                        <div className='flex-col'>
                            <h2>{info.name}</h2>
                            <small>v{info.version}</small>
                        </div>
                        <WindowBlock label='Copyright notice' description={`© 2022-${getCurrentYear()} B9 Creators. All rights reserved.`}>
                            <small>
                                B9 Creators and Launchpad, and the B9 Creators and Launchpad logo are either registered trademarks of B9 Creators in the United Kingdom and/or other countries. All other trademarks are property of their respective owners.
                            </small>
                        </WindowBlock>
                    </WindowBlock>
                </div>
            </div>
        </WindowComponent>
    );
};

export default SettingsAbout;