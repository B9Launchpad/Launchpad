import { useCookie } from "@/functions/useCookie"


const setLanguage = (locale: string) => {
    const { setCookie } = useCookie();

    setCookie("i18next", locale, 14);
}

export default setLanguage;