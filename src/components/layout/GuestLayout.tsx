import { useTranslations } from "next-intl";
import Logo from "../common/Logo";
import Link from "next/link";

interface GuestLayoutProps {
    children: React.ReactNode;
    backgroundURL?: string;
}

const getCurrentYear = () => {
    const d: Date = new Date();
    let year = d.getFullYear();
    return year;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children, backgroundURL = '/static/guest-spacious.webp' }) => {
    const t = useTranslations('general');

    return (
        <div className="guest__layout" style={{backgroundImage: `url(${backgroundURL})`}}>
            <div className="guest__layout--wrap">
                <main className="guest__layout--content">
                    <Logo/>
                    { children }
                </main>
                <footer>
                    <small className="flex flex-col">
                        <Link href={"/privacy-policy"}>{t('privacyPolicy')}</Link>
                        <Link href={"/terms-of-use"}>{t('termsOfUse')}</Link>
                        © {getCurrentYear()}, B9 Creators, {t('copyrightNote')}.
                    </small>
                </footer>
            </div>
        </div>
    )
}

export default GuestLayout;