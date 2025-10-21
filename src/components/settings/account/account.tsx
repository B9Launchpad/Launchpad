// src/components/settings/modules/index.tsx
import React from 'react';
import WindowComponent from '@/components/common/Window';
import InputString from '@/components/common/Input/StringInput';
import WindowBlock from '@/components/modules/FormBlock';
import InputSelect from '@/components/common/Input/SelectInput';
import Button from '@/components/common/Button';

const SettingsAccount: React.FC = () => {
    return (
        <>
            <WindowComponent 
                label={"Personal info"} 
                description={"Customise how your profile information will appear in the network"}
            >   
                <WindowBlock>
                    <div className='flex-row items-center gap-md'>
                        <img className="profile__picture--large" src="/storage/d70ee478ead2fef85d9a86575b6d0315.webp"></img>
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
                                <Button inline={true} variant='critical'>Remove</Button>
                                <Button inline={true} variant='secondary'>Edit</Button>
                            </div>
                        </div>
                        <div className='flex-row justify-between items-center'>
                            <div className='gap-sm flex flex-col'>
                                <em className='input__title'>Country</em>
                                <div className='flex-col'>
                                    <p>United Kingdom</p>
                                </div>
                            </div>
                            <Button inline={true} variant='secondary'>Edit</Button>
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

export default SettingsAccount;