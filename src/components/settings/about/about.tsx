// src/components/settings/modules/index.tsx
import React from 'react';
import WindowComponent from '@/components/common/Window';
import info from '@/app-info.json';
import { LaunchpadLogo } from '@/components/common/Logo';


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
                    <h2>{info.name}</h2>
                    <small>v{info.version}</small>
                    {/* VERY TEMPORARY. USE COMPONENTS LATER FOR LAYOUTS */}
                    <h4>
                        Copyright notice
                    </h4>
                    <small>
                        © 2022-{getCurrentYear()} B9 Creators. All rights reserved.
                        <br/><br/>
                        B9 Creators and Launchpad, and the B9 Creators and Launchpad logo are either registered trademarks of B9 Creators in the United Kingdom and/or other countries. All other trademarks are property of their respective owners.
                    </small>
                </div>
            </div>
        </WindowComponent>
    );
};

export default SettingsAbout;