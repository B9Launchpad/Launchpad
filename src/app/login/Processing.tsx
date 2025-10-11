import { useTranslations } from "next-intl";
import Link from "next/link";


const LoginProcessingPage: React.FC = () => {
    const t = useTranslations("auth");

    return (
        <>
            <div className="hero__content">
                <div>
                    <h1>{t('processing.working')}</h1>
                    <small>{t('processing.instructions')}</small>
                </div>
            </div>
            <div className="">
                <div className="loading-bar">
                    <div className="loading-bar__progress"></div>
                </div>
                <small>{t('processing.tooLongPrompt')} <Link href={'/help'}>{t('processing.supportPrompt')}</Link></small>
            </div>
        </>
    )
}

export default LoginProcessingPage