import Button from '../../components/common/Button';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

const SessionTimeoutPage: React.FC = () => {
    const t = useTranslations("auth");
    const router = useRouter();

    return (
        <>
            <div className="hero__content">
                <div>
                    <h1>{t('logout.title')}</h1>
                    <small>{t('logout.timeoutInstructions')}</small>
                </div>
            </div>
            <div className="secondary__content">
                <Button onClick={() => router.push("/login")} type="submit">
                    {t('logout.backToLogin')}
                </Button>
            </div>
        </>
    )
}

export default SessionTimeoutPage;