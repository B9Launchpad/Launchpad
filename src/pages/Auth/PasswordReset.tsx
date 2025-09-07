import { useTranslation } from "react-i18next"
import { NavLink, useNavigate } from "react-router-dom";
import InputSmall from "../../components/common/Input/SmallInput";
import Button from "../../components/common/Button";
import { useRef, useState } from "react";
import NewPassword, { NewPasswordRef } from "../../components/common/Input/NewPassword";
import determineCredentials from "../../functions/determineCredentials";

type ChallengeState = [boolean, 'email' | 'username' | ''];
type VerifiedState = [boolean, string, string];
type MatchErrorState = string;
type RequirementsErrorState = string;

const PasswordResetPage: React.FC = () => {
    const newPasswordRef = useRef<NewPasswordRef>(null);
    const [isChallenged, setIsChallenged] = useState<ChallengeState>([false, '']);
    const [isVerified, setIsVerified] = useState<VerifiedState>([false, '', '']);
    const [resetCode, setResetCode] = useState('');
    const loginPrompt = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { t } = useTranslation("auth");

    const [initialDataError, setInitialDataError] = useState('');

    const handleInitialRequest = (e: React.FormEvent) => {
        e.preventDefault();

        // This is where the user data (email or username) is verified and a request to send a challenge code is sent.
        
        if (loginPrompt.current) {
            const value = loginPrompt.current.value;
            const type = determineCredentials(value);
            
            if (type === 'email') {
                setIsChallenged([true, 'email']);
                setInitialDataError('');
            } else if (type === 'username') {
                setIsChallenged([true, 'username']);
                setInitialDataError('');
            } else {
                setInitialDataError(t('reset.initialError'));
            }
        }
    }

    const handleVerificationRequest = (e: React.FormEvent) => {
        e.preventDefault();
        // Here should be the code verificaiton logic
        setIsVerified([true, isChallenged[1], 'token']);
    }

    const handlePasswordReset = (e: React.FormEvent) => {
        e.preventDefault();
        // Here should be the password reset logic


        //if (!validatePassword(newPassword)) {
        //    setMatchError('');
        //    setRequirementsError(t('reset.passwordRequirementsNotMetError'));
        //}
        //else if(newPassword !== confirmPassword) {
        //    setMatchError(t('reset.passwordNoMatchError'));
        //    setRequirementsError('');
        //} else {
        //    alert('success');
        //    navigate("/login")
        //}

        if(!newPasswordRef.current?.validate()) return;
        navigate('/login');
    }

    return (
        <form onSubmit={
            !isChallenged[0] ? handleInitialRequest : 
            !isVerified[0] ? handleVerificationRequest : 
            handlePasswordReset
        }>
            <div className="hero__content">
                {!isChallenged[0] ? (
                    <>
                        <div>
                            <h1>{t('reset.title')}</h1>
                            <small>{t('reset.initialInstructions')}</small>
                        </div>
                        <InputSmall
                            autofocus={true}
                            id="userdata"
                            autoComplete="username email"
                            error={initialDataError}
                            ref={loginPrompt}
                            label={t('loginPrompt')}
                        ><small>{t('reset.rememberPassword')} <NavLink to={'/login'}>{t('reset.backToLogin')}</NavLink></small></InputSmall>
                    </>
                ) : !isVerified[0] ? (
                    <>
                        <div>
                            <h1>{t('reset.challengeMailTitle')}</h1>
                            <small>{t('reset.challengeMailInstructions')}</small>
                        </div>
                        <InputSmall 
                            id="otp"
                            maxLength={6}
                            autoComplete="one-time-code"
                            label={t('reset.resetCode')}
                            value={resetCode}
                            onChange={(e) => setResetCode(e.currentTarget.value)}
                        />
                    </>
                ) : (
                    <>
                        <div>
                            <em>{t('greeting', {name: 'Tatiana', ns: 'general'})}</em>
                            <h1>{t('reset.title')}</h1>
                            <small>
                                {t('reset.passwordResetInstructions')} {/*t('passwordRequirements')*/}
                            </small>
                        </div>
                        <NewPassword ref={newPasswordRef}></NewPassword>
                    </>
                )}
            </div>
            <div className="hero__content">
                <Button type="submit">
                    {!isChallenged[0] ? t('submit', {ns: 'general'}) : 
                     !isVerified[0] ? t('submit', {ns: 'general'}) : 
                     t('reset.resetPassword')}
                </Button>
            </div>
        </form>
    )
}

export default PasswordResetPage;