// TO DO: i18n localise

import React, { useRef } from 'react';
import WindowComponent from '@/components/common/Window';
import WindowBlock from '@/components/modules/FormBlock';
import Button from '@/components/common/Button';
import List from '@/components/common/Table/List';
import InputString, { InputStringRef } from '@/components/common/Input/StringInput';
import Form from '@/components/common/Input/Form';
import Modal from '@/components/common/Modal';
import { useModal } from '@/contexts/ModalContext';
import FileUpload from '@/components/common/Input/FileUpload/FileUpload';
import { supportedCountries } from "@functions/SupportedCountries";
import { useTranslation } from 'react-i18next';
import InputSelect from '@/components/common/Input/SelectInput';

const SettingsAccount: React.FC = () => {
    const { t } = useTranslation('module-core');

    return (
        <>
            <WindowComponent 
                label={t('account.sections.account.personalInfo.label')} 
                description={t('account.sections.account.personalInfo.description')}
            >   
                <WindowBlock>
                    <div className='flex-row items-center gap-md'>
                        <img className="profile__picture-lg" src="/storage/d70ee478ead2fef85d9a86575b6d0315.webp"></img>
                        <h2>Tatiana Y.</h2>
                    </div>
                    <WindowBlock className={"gap-md"}>
                        <div className='flex-row justify-between items-center'>
                            <div className='gap-sm flex flex-col'>
                                <em className='input__title'>{t('account.sections.account.personalInfo.name')}</em>
                                <p>Tatiana Yakovleva</p>
                            </div>
                            <Modal.Trigger content={<NamePopup/>} label='Edit name'>
                                <Button inline={true} variant='secondary'>{t('edit', { ns: "general" })}</Button>
                            </Modal.Trigger>
                        </div>
                        <div className='flex-row justify-between items-center'>
                            <div className='gap-sm flex flex-col'>
                                <em className='input__title'>{t('account.sections.account.personalInfo.email')}</em>
                                <div className='flex-col'>
                                    <p>tyakovleva@b9creators.co.uk</p>
                                    <small className='success'>Email address verified</small>
                                </div>
                            </div>
                            <Button inline variant='secondary'>{t('edit', {ns: "general"})}</Button>
                        </div>
                        <div className='flex-row justify-between items-center'>
                            <div className='gap-sm flex flex-col'>
                                <em className='input__title'>{t('account.sections.account.personalInfo.profilePicture')}</em>
                            </div>
                            <div className='flex-row gap-sm'>
                                <Button inline variant='critical'>{t('remove', { ns: "general" })}</Button>
                                <Modal.Trigger label="Editing profile picture" content={<PictureModal/>}>
                                    <Button inline variant='secondary'>{t('edit', { ns: "general" })}</Button>
                                </Modal.Trigger>
                            </div>
                        </div>
                        <div className='flex-row justify-between items-center'>
                            <div className='gap-sm flex flex-col'>
                                <em className='input__title'>{t('account.sections.account.personalInfo.country')}</em>
                                <div className='flex-col'>
                                    <p>United Kingdom</p>
                                </div>
                            </div>
                            <Modal.Trigger content={<CountriesModal/>} label='Editing country...'>
                                <Button inline variant='secondary'>{t('edit', { ns: "general" })}</Button>
                            </Modal.Trigger>
                        </div>
                        <div className='flex-row justify-between items-center'>
                            <div className='gap-sm flex flex-col'>
                                <em className='input__title'>{t('account.sections.account.personalInfo.timezone')}</em>
                                <div className='flex-col'>
                                    <p>GMT+0 London, currently 23:37</p>
                                </div>
                            </div>
                            <Button inline={true} variant='secondary'>{t('edit', { ns: "general" })}</Button>
                        </div>
                        <div className='flex-row justify-between items-center'>
                            <div className='gap-sm flex flex-col'>
                                <em className='input__title'>{t('account.sections.account.personalInfo.role')}</em>
                                <div className='flex-col'>
                                    <p>User</p>
                                </div>
                            </div>
                        </div>
                    </WindowBlock>
                </WindowBlock>
            </WindowComponent>
            <WindowComponent 
                label={t('account.sections.account.security.label')} 
                description={t('account.sections.account.security.description')}
            >   
                <WindowBlock label={t('account.sections.account.security.MFA')} description={t('account.sections.account.security.MFAdescription')}>
                    <small className='success'>
                        <strong>MFA protection active</strong>
                    </small>
                    <div className='flex-row gap'>
                        <Button label={t('account.sections.account.security.showCodes')} variant='secondary'></Button>
                        <Button label={t('account.sections.account.security.removeMFA')} variant='critical'></Button>
                    </div>
                </WindowBlock>
                <WindowBlock label={t('account.sections.account.security.passkeys')} description={t('account.sections.account.security.passkeysDescription')}>
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
                    <Button label={t('account.sections.account.security.changePassword')}></Button>
                    <Button label={t('account.sections.account.security.deleteAccount')} variant="critical"></Button>
                </div>
            </WindowComponent>
        </>
    );
};

export default SettingsAccount;

const NamePopup: React.FC = () => {
    const { closeModal } = useModal();
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
        }

        //closeModal();
        //return splitName(nameRef.current.value as string);
    }

    return (
        <Form onSubmit={handleSubmit} showSubmitButton={false}>
            <InputString ref={nameRef} title='New name' isMandatory type='string'></InputString>
            <Modal.Action action={[
                {label: "Cancel", variant: "secondary", onClick: closeModal},
                {label: "Submit", onClick: handleSubmit}]}>    
            </Modal.Action>
        </Form>
    )
}

const PictureModal: React.FC = () => {
    const { closeModal } = useModal();

    const handleSubmit = () => {
        return;
    }

    return (
        <Form onSubmit={handleSubmit} showSubmitButton={false}>
            <FileUpload accept='.png .webp .jpg'/>
        
            <Modal.Action action={[
                { label: "Cancel", variant: "secondary", onClick: closeModal },
                { label: "Submit", type: "submit", onClick: handleSubmit }]}>
            </Modal.Action>
        </Form>
    )
}

const CountriesModal: React.FC = () => {
    const { closeModal } = useModal();
    const { t } = useTranslation();

    const regionOptions =
        supportedCountries.map((country: string) => ({
            value: country,
            label: t(country, { ns: "countries" })
        }))
        .sort((a, b) => a.label.localeCompare(b.label))

    const handleSubmit = () => {
        return true;
    }

    return (
        <Form onSubmit={handleSubmit} showSubmitButton={false}>
            <InputSelect title={"Select new country"} options={regionOptions}/>

            <Modal.Action action={[
                { label: "Cancel", variant: "secondary", onClick: closeModal },
                { label: "Submit", trigger: {content: <p>Hello world!</p>}, triggerOnSuccess: true, onClick: handleSubmit }]}>
            </Modal.Action>
        </Form>
    )
}