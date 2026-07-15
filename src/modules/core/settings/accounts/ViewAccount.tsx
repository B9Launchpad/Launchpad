import SuspenseLoader from '@/components/common/Loader';
import TableCompact, { Column } from '@/components/common/Table/TableCompact';
import Profile from '@/components/common/User/Profile';
import Window from '@/components/common/Window';
import { parseUserData, UserProps } from '@/contexts/UserContext';
import makeFetchRequest from '@/utils/fetch/makeFetchRequest';
import SettingsNested, {useSettingsParams } from '@/utils/SettingsNested';
import { useEffect, useState } from 'react';
import SettingsAccountData from '../account/components/AccountData';
import WindowBlock from '@/components/modules/FormBlock';
import ProfilePicturePlaceholder from '@/components/common/User/PicturePlaceholder';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button';
import List from '@/components/common/Table/List';

export default function ViewAccount() {
   const params = useSettingsParams<{id: number}>();
   const [user, setUserData] = useState<Omit<UserProps, "os">>();
   const { t } = useTranslation(['module-core', 'general', 'countries']);
   
   useEffect(() => {
      async function getUserData() {
        if(!params.id) return;
         const res = await makeFetchRequest({
            method: "POST",
            credentials: "include",
            url: "/user/get",
            body: {id: params.id}
         })

         if(res.status !== 200) {
            console.error("Failed fetching user data with HTTP code " + res.status);
            return;
         }

         const body = await res.response.json();
         setUserData(parseUserData(body))
      }

      getUserData();
   }, [params])

   if(!user) return <SuspenseLoader/>

   interface UserDataItem {
      property: string;
      value: string;
   }

   const UserDataColumns: Column<UserDataItem>[] = [
      { header: "Property", accessor: "property" },
      { header: "Value", accessor: "value" }
   ]

   const UserTableData: UserDataItem[] = [
      { property: "First, last name", value: user.name.join(" ") },
      { property: "Email", value: user.email },
      { property: "Email verification", value: user.isVerified ? "Verified" : "Not verified" },
      { property: "User ID", value: String(user.id) },
      { property: "Role", value: user.role },
      { property: "Country", value: user.country}
   ]

   return (
        <>
            <SettingsNested.Back/>
            <Window label={"Account overview"}>
               <Profile picture={user.picture} name={user.name} email={user.email}></Profile>
               <TableCompact data={UserTableData} columns={UserDataColumns}></TableCompact>
            </Window>
            <Window label="Change personal info" description='Changes will be applied to this profile throughout the system'>
                <WindowBlock className={"gap-md"}>
                    <div className='flex-row items-center gap-md'>
                        {user.picture.length !== 0 ? (
                            <img className="profile__picture-lg" src="/storage/d70ee478ead2fef85d9a86575b6d0315.webp" alt="profile" />
                        ) : (
                            <ProfilePicturePlaceholder size='lg' label={user.name[0]} color={'secondary'}/>
                        )}
                        <h2>{user.name.join(" ")}</h2>
                    </div>
                    {/* Name */}
                    <SettingsAccountData 
                        label={t('account.sections.account.personalInfo.name')}
                        value={user.name.join(" ")}
                        action={[{
                            label: t('edit', { ns: "general" }),
                            variant: 'secondary',
                            inline: true,
                            /*trigger: { content: <NamePopup />, label: 'Edit name' }*/
                        }]}
                    />
                    {/* Email */}
                    <SettingsAccountData
                        label={t('account.sections.account.personalInfo.email')}
                        value={user.email}
                        action={[
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
                            /*trigger: { content: <CountriesModal />, label: 'Editing country...' }*/
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
                        action={[{
                            label: t('edit', { ns: "general" }),
                            inline: true,
                            variant: 'secondary'
                        }]}
                    />
                </WindowBlock>
            </Window>
            <Window label="Authentication and Account">
                <WindowBlock label='Multi-Factor Authentication'>
                    <div className='flex-row gap'>
                        <Button label={t('account.sections.account.security.removeMFA')} variant='critical'></Button>
                    </div>
                </WindowBlock>
                <WindowBlock label={t('account.sections.account.security.passkeys')}>
                    <List items={[{ content: "2 passkeys registered" } ]}/>
                </WindowBlock>
                <div className='flex-row gap'>
                    {/*<Modal.Trigger label='Change password' content={<NewPasswordModal/>}>*/}
                        <Button label={t('account.sections.account.security.changePassword')}></Button>
                    {/*</div></Modal.Trigger>*/}
                    <Button label={t('account.sections.account.security.deleteAccount')} variant="critical"></Button>
                </div>
            </Window>
        </>
   )
}