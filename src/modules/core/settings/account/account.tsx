// TO DO: i18n localise

import React, { useRef, useState } from 'react';
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
import { useUser } from '@/contexts/UserContext';
import NewPassword, { NewPasswordRef } from '@/components/common/Input/NewPassword';
import makeFetchRequest from '@/utils/fetch/makeFetchRequest';
import ProfilePicturePlaceholder from '@/components/common/User/PicturePlaceholder';

const SettingsAccount: React.FC = () => {
    const { t } = useTranslation('module-core');
    const user = useUser();

    return (
        <>
            <WindowComponent 
                label={t('account.sections.account.personalInfo.label')} 
                description={t('account.sections.account.personalInfo.description')}
            >   
                <WindowBlock>
                    <div className='flex-row items-center gap-md'>
                        {user.picture.length !== 0 ? (
                            <img className="profile__picture-lg" src="/storage/d70ee478ead2fef85d9a86575b6d0315.webp"></img>
                        ) : (
                            <ProfilePicturePlaceholder size='lg' label={user.name} color={'secondary'}/>
                        )}
                        <h2>{user.name}</h2>
                    </div>
                    <WindowBlock className={"gap-md"}>
                        <div className='flex-row justify-between items-center'>
                            <div className='gap-sm flex flex-col'>
                                <em className='input__title'>{t('account.sections.account.personalInfo.name')}</em>
                                <p>{user.name}</p>
                            </div>
                            <Modal.Trigger content={<NamePopup/>} label='Edit name'>
                                <Button inline={true} variant='secondary'>{t('edit', { ns: "general" })}</Button>
                            </Modal.Trigger>
                        </div>
                        <div className='flex-row justify-between items-center'>
                            <div className='gap-sm flex flex-col'>
                                <em className='input__title'>{t('account.sections.account.personalInfo.email')}</em>
                                <div className='flex-col'>
                                    <p>{user.email}</p>
                                    {user.isVerified === true ? (
                                        <small className='success'>{t('account.sections.account.personalInfo.emailVerified')}</small>
                                    ) : (
                                        <small className='critical'>{t('account.sections.account.personalInfo.emailNotVerified')}.
                                            <Modal.Trigger label='Verify your email' description={`We've sent you a verification code to ${user.email}. Please type it in to continue`} content={<VerifyEmailPopup/>}>
                                                <a> {t('account.sections.account.personalInfo.verifyEmail')}.</a>
                                            </Modal.Trigger>
                                        </small>
                                    )}
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
                                    <p>{t(user.country, {ns: 'countries'})}</p>
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
                    <Modal.Trigger label='Change password' content={<NewPasswordModal/>}>
                        <Button label={t('account.sections.account.security.changePassword')}></Button>
                    </Modal.Trigger>
                    <Button label={t('account.sections.account.security.deleteAccount')} variant="critical"></Button>
                </div>
            </WindowComponent>
        </>
    );
};

export default SettingsAccount;

const NamePopup: React.FC = () => {
    const { t } = useTranslation('module-core')
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
            <InputString ref={nameRef} label='New name' isMandatory type='string'></InputString>
            <Modal.Action action={[
                { label: t('cancel', { ns: "general" }), variant: "secondary", onClick: closeModal},
                { label: t('submit', { ns: "general" }), onClick: handleSubmit}]}>    
            </Modal.Action>
        </Form>
    )
}

const PictureModal: React.FC = () => {
    const { closeModal } = useModal();
    const { t } = useTranslation('module-core')

    const handleSubmit = () => {
        return;
    }

    return (
        <Form onSubmit={handleSubmit} showSubmitButton={false}>
            <FileUpload accept='.png .webp .jpg'/>
        
            <Modal.Action action={[
                { label: t('cancel', {ns: "general"}), variant: "secondary", onClick: closeModal },
                { label: t('submit', { ns: "general" }), type: "submit", onClick: handleSubmit }]}>
            </Modal.Action>
        </Form>
    )
}

const CountriesModal: React.FC = () => {
    const { closeModal } = useModal();
    const { t } = useTranslation();
    const { country } = useUser();

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
            <InputSelect value={country} label={"Select new country"} options={regionOptions}/>

            <Modal.Action action={[
                { label: t('cancel', { ns: "general" }), variant: "secondary", onClick: closeModal },
                { label: t('submit', { ns: "general" }), trigger: {content: <p>Hello world!</p>}, triggerOnSuccess: true, onClick: handleSubmit }]}>
            </Modal.Action>
        </Form>
    )
}

const VerifyEmailPopup = () => {
    const { closeModal } = useModal();
    const { t } = useTranslation('module-core');
    const { email } = useUser();

    const handleSubmit = async () => {
        return;
    }

    return (
        <Form onSubmit={handleSubmit} showSubmitButton={false}>
            <InputString label={`6-digit verification code`} isMandatory type='string'></InputString>
            <Modal.Action action={[
                { label: t('cancel', { ns: 'general' }), onClick: closeModal, variant: 'secondary' },
                { label: t('submit', { ns: 'general' }), type: 'submit', onClick: handleSubmit }
            ]}></Modal.Action>
        </Form>
    )
}

const NewPasswordModal = () => {
    const { closeModal } = useModal();
    const newPasswordRef = useRef<NewPasswordRef>(null);
    const oldPasswordRef = useRef<InputStringRef>(null);
    const [error, setError] = useState<false | string>(false);
    const { t } = useTranslation('module-core');

    const handleSubmit = async () => {
        if(!oldPasswordRef.current || !newPasswordRef.current) return;
        const oldPassword = oldPasswordRef.current;
        const newPasswordInput = newPasswordRef.current;

        if(oldPassword.value.length < 8) {
            oldPassword.error('Invalid old password, please try again');
            return;
        }

        const newPassword = newPasswordInput.validate();
        if(newPassword === false) return;

        const { status } = await makeFetchRequest({
            url: '/profile/change-password',
            method: "POST",
            body: {current_password: oldPassword.value, new_password: newPassword},
            credentials: 'include'
        })

        switch(status) {
            case 422: {
                setError('New password cannot be the same as old password.');
                break;
            }
            case 401: {
                oldPassword.error('Incorrect password, please try again.')
                setError(false);
                break;
            }
            case 200: {
                closeModal();
            }
        }

        return;
    }

    return (
        <Form onSubmit={handleSubmit} showSubmitButton={false}>
            <WindowBlock>
                <InputString ref={oldPasswordRef} label='Old password' isMandatory type='password'></InputString>
                <NewPassword ref={newPasswordRef}></NewPassword>
                {error !== false && (
                    <p className="input__error-message">{error}</p>
                )}
            </WindowBlock>
            <Modal.Action action={[
                { label: t('cancel', {ns: 'general'}), onClick: closeModal, variant: 'secondary'},
                { label: t('submit', { ns: 'general'}), type: 'submit', onClick: handleSubmit}
            ]}></Modal.Action>
        </Form>
    )
}