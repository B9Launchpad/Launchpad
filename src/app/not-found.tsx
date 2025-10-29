'use client'
import Button from "@/components/common/Button"
import GuestLayout from "@/components/layout/GuestLayout"
import WindowBlock from "@/components/modules/FormBlock"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"



const NotFoundPage: React.FC = () => {
    const router = useRouter();
    const { t } = useTranslation('main');

    return (
        <GuestLayout backgroundURL="/static/guest-layout/dusseldorf.webp">
            <div className="hero__content">
                <h1 className="hero-heading">{t('errors.404.title')}</h1>
                <WindowBlock>
                    <h2>{t('errors.404.subtitle')}</h2>
                    <small>{t('errors.404.description')}</small>
                </WindowBlock>

                <Button label={t('errors.back')} onClick={() => {router.push('/')}}></Button>
            </div>
        </GuestLayout>
    )
}

export default NotFoundPage;