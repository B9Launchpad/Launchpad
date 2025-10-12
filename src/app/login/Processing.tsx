import Link from "next/link";
import { useTranslation } from "react-i18next";


const LoginProcessingPage: React.FC = () => {
    const { t }= useTranslation("auth");

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