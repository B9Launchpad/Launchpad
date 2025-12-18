import SuspenseLoader from '@/components/common/Loader';
import Profile from '@/components/common/User/Profile';
import Window from '@/components/common/Window';
import { parseUserData, UserProps } from '@/contexts/UserContext';
import makeFetchRequest from '@/utils/fetch/makeFetchRequest';
import SettingsNested, {useSettingsParams } from '@/utils/SettingsNested';
import { useEffect, useState } from 'react';

export default function ViewAccount() {
   const params = useSettingsParams<{id: number}>();
   const [userData, setUserData] = useState<Omit<UserProps, "os">>();
   
   useEffect(() => {
      async function getUserData() {
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

   if(!userData) return <SuspenseLoader/>
   return (
      <>
         <SettingsNested.Back/>
         <Window label={"Account overview"}>
            <Profile picture={userData.picture} name={userData.name} email={userData.email}></Profile>
         </Window>
      </>
   )
}