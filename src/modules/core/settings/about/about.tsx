// TO DO: i18n localise

import React from 'react';
import WindowComponent from '@/components/common/Window';
import info from '@/app-info.json';
import { LaunchpadLogo } from '@/components/common/Logo';
import WindowBlock from '@/components/modules/FormBlock';
import { useTranslation } from 'react-i18next';


const SettingsAbout: React.FC = () => {
    const { t } = useTranslation('module-core')
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
                        <WindowBlock label={t('about.copyrightNotice')} description={`© 2022-${getCurrentYear()} B9 Creators, ${t('copyrightNote', { ns: 'general'})}.`}>
                            <small>
                                {t('about.copyrightText')}
                            </small>
                        </WindowBlock>
                    </WindowBlock>
                </div>
            </div>
        </WindowComponent>
    );
};

export default SettingsAbout;