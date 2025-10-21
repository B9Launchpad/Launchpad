import InputSmall from "@components/common/Input/SmallInput"
import { useRef, useState, useEffect } from "react"
import Button from "@components/common/Button"
import PasskeyIcon from "@components/icons/Passkey"
import GoogleLogo from "@/components/icons/Logos/GoogleLogo"
import MicrosoftLogo from "@/components/icons/Logos/MicrosoftLogo"
import GithubLogo from "@components/icons/Logos/GithubLogo"
import { useSpring, animated } from "react-spring"
import { loginCredentials, useLogin } from "@/contexts/LoginContext"
import SpringConfig from "@utils/SpringConfig"

import { InputSmallRef } from "@components/common/Input/SmallInput"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import validateEmail from "@/functions/validateEmail"

type loginErrors = { username: string; password: string };
const errorsInit = {
    username: "",
    password: ""
}


const LoginPromptPage: React.FC = () => {
    const { t } = useTranslation('auth');
    const [additionalOAuthHeight, setAdditionalOAuthHeight] = useState(0);
    const [expandedOAuthOptions, setExpandOAuthOptions] = useState<Boolean>(false);
    const additionalOAuthRef = useRef<HTMLDivElement>(null);
    const loginRef = useRef<InputSmallRef>(null);
    const passwordRef = useRef<InputSmallRef>(null);
    const { handleRequest, loginStatus, credentials } = useLogin();
    const [errors, setErrors] = useState<loginErrors>(errorsInit);

    useEffect(() => {
        if(additionalOAuthRef.current) {
            setAdditionalOAuthHeight(additionalOAuthRef.current.scrollHeight);
        }
    })

    useEffect(() => {
        if(loginStatus === "isUnauthorised") {
            setErrors((prev) => ({
                ...prev,
                password: t('processing.unauthorisedError')
            }))
        }
    }, [loginStatus, handleRequest])

    useEffect(() => {
        if(!loginRef.current || !passwordRef.current) return;

        loginRef.current.error(errors.username);
        passwordRef.current.error(errors.password);

    }, [errors])

    const style = useSpring({
      height: expandedOAuthOptions ? additionalOAuthHeight : 0,
      opacity: expandedOAuthOptions ? 1 : 0,
      overflow: 'hidden ',
      config: SpringConfig,
    });

    const handleClick = (e?: any) => {
        e?.preventDefault();
        if(!loginRef.current || !passwordRef.current) return;

        const credentials: loginCredentials = {
            email: loginRef.current.value,
            password: passwordRef.current.value
        }

        let newErrors: loginErrors = {...errorsInit};

        if(!credentials.email) {
            newErrors.username = t('validation.usernameRequired')
        } else if(credentials.email && !credentials.password) {
            newErrors.password = t('validation.passwordRequired');
        }

        setErrors(newErrors);

        if (Object.values(newErrors).every(val => val === "")) {
            handleRequest(credentials);
        }
    }


    return (
        <form onSubmit={handleClick}>
            <div className="hero__content">
                <div>
                    <h1>{t('welcome')}</h1>
                    <small>{t('instructions')}</small>
                </div>
                {/* Login */}
                <InputSmall ref={loginRef} value={credentials?.email} label={t('loginPrompt')}/>
                {/* Password */}
                <InputSmall ref={passwordRef} type="password" label={t('passwordPrompt')}>
                    <small>{t('forgotPassword')}
                        <Link href={'/login/reset'}> {t('resetPrompt')}</Link>
                    </small>
                </InputSmall>
            </div>
            <div className="secondary__content centre">
                <Button type="submit" onClick={handleClick}>{t('login')}</Button>
                <em>{t('or')}</em>
                <Button icon={<PasskeyIcon/>} variant='tertiary'>{t('OAuthWith', {method: 'Passkey'})}</Button>
                <Button icon={<GoogleLogo/>} variant='tertiary'>{t('OAuthContinue', {method: 'Google'})}</Button>
                <Button icon={<MicrosoftLogo/>} variant='tertiary'>{t('OAuthContinue', {method: 'Microsoft'})}</Button>
                <animated.div style={style} ref={additionalOAuthRef} className="secondary__content centre">
                    <Button icon={<GithubLogo/>} variant='tertiary'>{t('OAuthContinue', {method: 'GitHub'})}</Button>
                </animated.div>
                { expandedOAuthOptions ? (
                    <a onClick={() => { setExpandOAuthOptions(!expandedOAuthOptions) }} className="access">{t('showLess', {ns: "general"})}</a> 
                ) : (
                    <a onClick={() => { setExpandOAuthOptions(!expandedOAuthOptions) }} className="access">{t('showMore', {ns: "general"})}</a> 
                )}
            </div>
        </form>
    )
}

export default LoginPromptPage;