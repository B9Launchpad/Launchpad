// TO DO: i18n localise

import React, { useRef, useState } from 'react';
import Window from '@/components/common/Window';
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
import { UserProps, useUser } from '@/contexts/UserContext';
import NewPassword, { NewPasswordRef } from '@/components/common/Input/NewPassword';
import makeFetchRequest from '@/utils/fetch/makeFetchRequest';
import ProfilePicturePlaceholder from '@/components/common/User/PicturePlaceholder';
import SettingsAccountData from './components/AccountData';

const SettingsAccount: React.FC = () => {
    const { t } = useTranslation(['module-core', 'general', 'countries']);
    const user = useUser();

    return (
        <>
            <Window 
                label={t('account.sections.account.personalInfo.label')} 
                description={t('account.sections.account.personalInfo.description')}
            >   
                <WindowBlock>
                    <div className='flex-row items-center gap-md'>
                        {user.picture.length !== 0 ? (
                            <img className="profile__picture-lg" src="/storage/d70ee478ead2fef85d9a86575b6d0315.webp" alt="profile" />
                        ) : (
                            <ProfilePicturePlaceholder size='lg' label={user.name[0]} color={'secondary'}/>
                        )}
                        <h2>{user.name.join(" ")}</h2>
                    </div>

                    <WindowBlock className={"gap-md"}>
                        {/* Name */}
                        <SettingsAccountData 
                            label={t('account.sections.account.personalInfo.name')}
                            value={user.name.join(" ")}
                            action={[{
                                label: t('edit', { ns: "general" }),
                                variant: 'secondary',
                                inline: true,
                                trigger: { content: <NamePopup />, label: 'Edit name' }
                            }]}
                        />

                        {/* Email */}
                        <SettingsAccountData
                            label={t('account.sections.account.personalInfo.email')}
                            value={user.email}
                            action={[
                                {
                                    label: t('account.sections.account.personalInfo.verifyEmail'),
                                    variant: 'access',
                                    inline: true,
                                    disabled: (user.isVerified),
                                    trigger: {
                                        label: 'Verify your email',
                                        description: `We've sent you a verification code to ${user.email}.`,
                                        content: <VerifyEmailPopup />
                                    }
                                },
                                {
                                    label: t('edit', { ns: "general" }),
                                    variant: 'secondary',
                                    inline: true
                                }
                            ]}
                        >
                            {user.isVerified ? (
                                <small className='success'>{t('account.sections.account.personalInfo.emailVerified')}</small>
                            ) : (
                                <small className='critical'>{t('account.sections.account.personalInfo.emailNotVerified')}</small>
                            )}
                        </SettingsAccountData>

                        {/* Profile Picture */}
                        <SettingsAccountData 
                            label={t('account.sections.account.personalInfo.profilePicture')}
                            value=""
                            action={[
                                {
                                    label: t('remove', { ns: "general" }),
                                    variant: 'critical',
                                    inline: true,
                                    onClick: () => console.log('Remove picture')
                                },
                                {
                                    label: t('edit', { ns: "general" }),
                                    variant: 'secondary',
                                    inline: true,
                                    trigger: { label: "Editing profile picture", content: <PictureModal /> }
                                }
                            ]}
                        />

                        {/* Country */}
                        <SettingsAccountData 
                            label={t('account.sections.account.personalInfo.country')}
                            value={t(user.country, { ns: 'countries' })}
                            action={[{
                                label: t('edit', { ns: "general" }),
                                variant: 'secondary',
                                inline: true,
                                trigger: { content: <CountriesModal />, label: 'Editing country...' }
                            }]}
                        />

                        {/* Timezone */}
                        <SettingsAccountData 
                            label={t('account.sections.account.personalInfo.timezone')}
                            value="GMT+0 London, currently 23:37"
                            action={[{
                                label: t('edit', { ns: "general" }),
                                variant: 'secondary',
                                inline: true
                            }]}
                        />

                        {/* Role */}
                        <SettingsAccountData 
                            label={t('account.sections.account.personalInfo.role')}
                            value={user.role}
                        />
                    </WindowBlock>
                </WindowBlock>
            </Window>

            <Window 
                label={t('account.sections.account.security.label')} 
                description={t('account.sections.account.security.description')}
            >   
                <WindowBlock label={t('account.sections.account.security.MFA')} description={t('account.sections.account.security.MFAdescription')}>
                    <small className='success'>
                        <strong>MFA protection active</strong>
                    </small>
                    <div className='flex-row gap'>
                        <Button label={t('account.sections.account.security.showCodes')} variant='secondary'/>
                        <Button label={t('account.sections.account.security.removeMFA')} variant='critical'/>
                    </div>
                </WindowBlock>

                <WindowBlock label={t('account.sections.account.security.passkeys')} description={t('account.sections.account.security.passkeysDescription')}>
                    <List items={[{ content: "Enlanpass" }, { content: "Airdroid" }]}/>
                </WindowBlock>

                <div className='flex-row gap'>
                    <Modal.Trigger label='Change password' content={<NewPasswordModal/>}>
                        <Button label={t('account.sections.account.security.changePassword')}/>
                    </Modal.Trigger>
                    <Button label={t('account.sections.account.security.deleteAccount')} variant="critical"/>
                </div>
            </Window>
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
            <InputString ref={nameRef} label='New name' required type='string'></InputString>
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
            <InputString label={`6-digit verification code`} required type='string'></InputString>
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
                <InputString ref={oldPasswordRef} label='Old password' required type='password'></InputString>
                <NewPassword ref={newPasswordRef}></NewPassword>
                {error !== false && (
                    <p className="input__error-message">{error}</p>
                )}
            </WindowBlock>
            <Modal.Action action={[
                { label: t('cancel', { ns: 'general' }), onClick: closeModal, variant: 'secondary'},
                { label: t('submit', { ns: 'general' }), type: 'submit', onClick: handleSubmit}
            ]}></Modal.Action>
        </Form>
    )
}