// src/components/settings/modules/index.tsx
import React from 'react';
import { SettingsPage } from '@/contexts/SettingsRegistryContext';
import WindowComponent from '@/components/common/Window';
import InputString from '@/components/common/Input/StringInput';
import WindowBlock from '@/components/modules/FormBlock';
import InputSelect from '@/components/common/Input/SelectInput';

const AccountSettings: React.FC = () => {
    return (
        <>
            <WindowComponent 
                action={[
                    { 
                        children: (<>Cancel</>),
                        variant: 'secondary'
                    },
                    { 
                        children: (<>Save</>)
                    }
                ]}
                label={"Personal info"} 
                description={"Customise how your profile information will appear in the network"}
            >   
                <WindowBlock direction='row'>
                    <h2>Profile picture will be here!</h2>
                    <WindowBlock>
                        <InputString expand={true} title={'Name'} isMandatory={true} type={'string'}></InputString>
                        <InputString expand={true} title={'Email Address'} isMandatory={true} type={'string'}>
                            <small>Email address verified!</small>
                        </InputString>
                        <InputSelect 
                            options={[
                                {
                                    label: "Admin",
                                    value: "admin"
                                },
                                {
                                    label: "User",
                                    value: "user"
                                },
                                {
                                    label: "Owner",
                                    value: "owner"
                                }
                            ]}
                            title={'Role'} 
                            expand={true}
                            value='user'
                            disabled={true}
                        >
                        </InputSelect>
                    </WindowBlock>
                </WindowBlock>
            </WindowComponent>
        </>
    );
};

const accountSettings: SettingsPage = {
    id: 'account',
    label: 'Account',
    category: 'user',
    component: AccountSettings,
};

export default accountSettings;