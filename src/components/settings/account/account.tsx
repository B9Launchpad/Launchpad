// TO DO: i18n localise

import React, { useRef } from 'react';
import WindowComponent from '@/components/common/Window';
import WindowBlock from '@/components/modules/FormBlock';
import Button from '@/components/common/Button';
import List from '@/components/common/Table/List';
import InputString, { InputStringRef } from '@/components/common/Input/StringInput';
import Form from '@/components/common/Input/Form';
import Modal from '@/components/common/Modal';
import { usePopup } from '@/contexts/PopupContext';

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
                            <Modal.Trigger content={<NamePopup/>} label='Edit name'>
                                <Button inline={true} variant='secondary'>Edit</Button>
                            </Modal.Trigger>
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

const NamePopup: React.FC = () => {
    const { closePopup } = usePopup();
    const nameRef = useRef<InputStringRef>(null);
    

    function splitName(name: string): string[] {
        let splitName = name.split(' ')

        splitName.forEach((s, i) => splitName[i] = s.charAt(0).toUpperCase() + s.slice(1));

        if(splitName.length > 1) {
            return [splitName[0], splitName[splitName.length -1 ]];
        } else {
            return [splitName[0]];
        }
    }

    const handleSubmit = () => {
        if(!nameRef.current) return;

        if(nameRef.current.value.length < 1) {
            nameRef.current.error("Please enter a value")
            return;
        }

        alert("Your new name is... " + splitName(nameRef.current.value as string));
    }

    return (
        <Form onSubmit={handleSubmit} showSubmitButton={false}>
            <InputString ref={nameRef} title='New name' isMandatory type='string'></InputString>
            <Modal.Action action={[
                {label: "Cancel", variant: "secondary", onClick: closePopup},
                {label: "Submit", onClick: handleSubmit}]}>    
            </Modal.Action>
        </Form>
    )
}