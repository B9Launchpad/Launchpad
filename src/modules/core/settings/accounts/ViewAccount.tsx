import SettingsNested, {useSettingsParams } from '@/utils/SettingsNested';

export default function ViewAccount() {
   const params = useSettingsParams<{ userId: number }>();

   return (
      <div>
         <SettingsNested.Back />
         <h1>Editing {params.userId}</h1>
      </div>
   )
}