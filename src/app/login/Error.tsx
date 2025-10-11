import Button from "@components/common/Button"
import { useLogin } from "@functions/Auth/LoginContext";
import Link from "next/link";
import { useTranslations } from "next-intl";

const LoginErrorPage: React.FC = () => {
    const t = useTranslations('auth');
    const tg = useTranslations('general');
    const { setLoginStatus, handleRetry } = useLogin();

    return (
        <>
            <div className="hero__content">
                <div>
                    <h1>{t('processing.processingError')}</h1>
                    <small>{t('processing.processingErrorInstructions')}</small>
                </div>
            </div>
            <div className="secondary__content">
                <Button onClick={handleRetry} type="submit">
                    {tg('tryAgain')}
                </Button>
                <small>{t('processing.stillNotWorking')} <Link onClick={() => setLoginStatus("isIdle")} href={''}>{t('processing.tryAnotherWay')}</Link></small>
            </div>
        </>
    )
}

export default LoginErrorPage;