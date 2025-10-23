// src/components/settings/modules/index.tsx
import React from 'react';
import WindowComponent from '@/components/common/Window';
import InputString from '@/components/common/Input/StringInput';
import WindowBlock from '@/components/modules/FormBlock';
import InputSelect from '@/components/common/Input/SelectInput';
import Button from '@/components/common/Button';
import List from '@/components/common/Table/List';

const SettingsAccount: React.FC = () => {
    return (
        <>
            <WindowComponent 
                label={"Personal info"} 
                description={"Customise how your profile information will appear in the network"}
            >   
                <WindowBlock>
                    <div className='flex-row items-center gap-md'>
                        <img className="profile__picture-lg" src="/storage/d70ee478ead2fef85d9a86575b6d0315.webp"></img>
                        <h2>Tatiana Y.</h2>
                    </div>
                    <WindowBlock className={"gap-md"}>
                        <div className='flex-row justify-between items-center'>
                            <div className='gap-sm flex flex-col'>
                                <em className='input__title'>Name</em>
                                <p>Tatiana Yakovleva</p>
                            </div>
                            <Button inline={true} variant='secondary'>Edit</Button>
                        </div>
                        <div className='flex-row justify-between items-center'>
                            <div className='gap-sm flex flex-col'>
                                <em className='input__title'>Email Address</em>
                                <div className='flex-col'>
                                    <p>tyakovleva@b9creators.co.uk</p>
                                    <small className='success'>Email address verified</small>
                                </div>
                            </div>
                            <Button inline={true} variant='secondary'>Edit</Button>
                        </div>
                        <div className='flex-row justify-between items-center'>
                            <div className='gap-sm flex flex-col'>
                                <em className='input__title'>Profile picture</em>
                            </div>
                            <div className='flex-row gap-sm'>
                                <Button inline variant='critical'>Remove</Button>
                                <Button inline variant='secondary'>Edit</Button>
                            </div>
                        </div>
                        <div className='flex-row justify-between items-center'>
                            <div className='gap-sm flex flex-col'>
                                <em className='input__title'>Country</em>
                                <div className='flex-col'>
                                    <p>United Kingdom</p>
                                </div>
                            </div>
                            <Button inline variant='secondary'>Edit</Button>
                        </div>
                        <div className='flex-row justify-between items-center'>
                            <div className='gap-sm flex flex-col'>
                                <em className='input__title'>Timezone</em>
                                <div className='flex-col'>
                                    <p>GMT+0 London, currently 23:37</p>
                                </div>
                            </div>
                            <Button inline={true} variant='secondary'>Edit</Button>
                        </div>
                        <div className='flex-row justify-between items-center'>
                            <div className='gap-sm flex flex-col'>
                                <em className='input__title'>Role</em>
                                <div className='flex-col'>
                                    <p>User</p>
                                </div>
                            </div>
                        </div>
                    </WindowBlock>
                </WindowBlock>
            </WindowComponent>
            <WindowComponent 
                label={"Security & Access"} 
                description={"This is where your account safety information sits — keep it safe!"}
            >   
                <WindowBlock label='Multi-Factor Authentication' description='Setting up an authentication app is a good way to add an extra layer of security to your account to ensure that only you can log in'>
                    <small className='success'>
                        <strong>MFA protection active</strong>
                    </small>
                    <div className='flex-row gap'>
                        <Button label="Show backup codes" variant='secondary'></Button>
                        <Button label="Remove MFA protection" variant='critical'></Button>
                    </div>
                </WindowBlock>
                <WindowBlock label='Passkeys' description='Add an extra layer of security to your account with a security key'>
                    <List items={[
                        {
                            content: "Enlanpass"
                        },
                        {
                            content: "Airdroid"
                        }
                    ]}/>
                </WindowBlock>
                <div className='flex-row gap'>
                    <Button label="Change my password"></Button>
                    <Button label="Delete account" variant="critical"></Button>
                </div>
            </WindowComponent>
        </>
    );
};

export default SettingsAccount;