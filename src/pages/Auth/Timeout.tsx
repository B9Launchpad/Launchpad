import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

const SessionTimeoutPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <>
            <div className="hero__content">
                <div>
                    <h1>{t('login.logout.title')}</h1>
                    <small>{t('login.logout.timeoutInstructions')}</small>
                </div>
            </div>
            <div className="secondary__content">
                <Button onClick={() => navigate("/login")} type="submit">
                    {t('login.logout.backToLogin')}
                </Button>
            </div>
        </>
    )
}

export default SessionTimeoutPage;