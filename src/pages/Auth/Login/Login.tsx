import InputSmall from "../../../components/common/Input/SmallInput"
import { useRef, useState, useEffect } from "react"
import Button from "../../../components/common/Button"
import PasskeyIcon from "../../../components/icons/Passkey"
import GoogleLogo from "../../../components/icons/Logos/GoogleLogo"
import MicrosoftLogo from "../../../components/icons/Logos/MicrosoftLogo"
import GithubLogo from "../../../components/icons/Logos/GithubLogo"
import { useTranslation } from "react-i18next"
import { useSpring, animated } from "react-spring"
import { NavLink } from "react-router-dom"
import { loginCredentials, useLogin } from "../../../functions/Auth/LoginContext"
import SpringConfig from "../../../utils/SpringConfig"

import { InputSmallRef } from "../../../components/common/Input/SmallInput"

const LoginPromptPage: React.FC = () => {
    const { t } = useTranslation('auth');
    const [additionalOAuthHeight, setAdditionalOAuthHeight] = useState(0);
    const [expandedOAuthOptions, setExpandOAuthOptions] = useState<Boolean>(false);
    const additionalOAuthRef = useRef<HTMLDivElement>(null);
    const loginRef = useRef<InputSmallRef>(null);
    const passwordRef = useRef<InputSmallRef>(null);
    const { handleRequest, status, credentials } = useLogin();
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

    useEffect(() => {
        if(additionalOAuthRef.current) {
            setAdditionalOAuthHeight(additionalOAuthRef.current.scrollHeight);
        }
    })

    useEffect(() => {
        if(status === "isUnauthorised") {
            setErrors({
                username: t('processing.unauthorisedError')
            })
        }
    }, [status, handleRequest])

    const style = useSpring({
      height: expandedOAuthOptions ? additionalOAuthHeight : 0,
      opacity: expandedOAuthOptions ? 1 : 0,
      overflow: 'hidden ',
      config: SpringConfig,
    });

    const handleClick = () => {
        if(!loginRef.current || !passwordRef.current) return;

        const credentials: loginCredentials = {
            username: loginRef.current.value,
            password: passwordRef.current.value
        }

        let newErrors: typeof errors = {};
        
        if(!credentials.username) {
            newErrors.username = t('validation.usernameRequired')
        } else if(credentials.username && !credentials.password) {
            newErrors.password = t('validation.passwordRequired');
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            handleRequest(credentials);
        }
    }


    return (
        <>
            <div className="hero__content">
                <div>
                    <h1>{t('welcome', { ns: 'auth' })}</h1>
                    <small>{t('instructions')}</small>
                </div>
                {/* Login */}
                <InputSmall ref={loginRef} value={credentials?.username} label={t('loginPrompt')} error={errors.username}/>
                {/* Password */}
                <InputSmall ref={passwordRef} error={errors.password} type="password" label={t('passwordPrompt')}><small>{t('forgotPassword')} <NavLink to={'/login/reset'}>{t('resetPrompt')}</NavLink></small></InputSmall>
            </div>
            <div className="secondary__content centre">
                <Button onClick={handleClick}>{t('login')}</Button>
                <em>{t('or')}</em>
                <Button icon={<PasskeyIcon/>} variant='tertiary'>{t('OAuthWith', {method: 'Passkey'})}</Button>
                <Button icon={<GoogleLogo/>} variant='tertiary'>{t('OAuthContinue', {method: 'Google'})}</Button>
                <Button icon={<MicrosoftLogo/>} variant='tertiary'>{t('OAuthContinue', {method: 'Microsoft'})}</Button>
                <animated.div style={style} ref={additionalOAuthRef} className="secondary__content centre">
                    <Button icon={<GithubLogo/>} variant='tertiary'>{t('OAuthContinue', {method: 'GitHub'})}</Button>
                </animated.div>
                { expandedOAuthOptions ? (
                    <a onClick={() => { setExpandOAuthOptions(!expandedOAuthOptions) }} className="access">{t('showLess', { ns: 'general' })}</a> 
                ) : (
                    <a onClick={() => { setExpandOAuthOptions(!expandedOAuthOptions) }} className="access">{t('showMore', { ns: 'general' })}</a> 
                )}
            </div>
        </>
    )
}

export default LoginPromptPage;