import { NavLink } from "react-router-dom";
import Logo from "../common/Logo";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";

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
    const { t } = useTranslation('general');

    return (
        <div className="guest__layout" style={{backgroundImage: `url(${backgroundURL})`}}>
            <div className="guest__layout--wrap">
                <main className="guest__layout--content">
                    <Logo/>
                    { children }
                </main>
                <footer>
                    <small className="flex flex-col">
                        <NavLink to={"/privacy-policy"}>{t('privacyPolicy')}</NavLink>
                        <NavLink to={"/terms-of-use"}>{t('termsOfUse')}</NavLink>
                        © {getCurrentYear()}, B9 Creators, {t('copyrightNote')}.
                    </small>
                </footer>
            </div>
        </div>
    )
}

export default GuestLayout;