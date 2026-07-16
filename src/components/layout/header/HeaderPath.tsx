import IconArrowRight from "@/components/icons/ArrowRight";
import SettingsIcon from "@/components/icons/Settings";
import { useTranslation } from "react-i18next";

export type HeaderPathType = 
    Array<{
        slug: string,
        url?: string,
    }>

interface HeaderPathProps {
    from: 'settings' | 'dashboard';
    root?: boolean;
    path: HeaderPathType;
}

const HeaderPath: React.FC<HeaderPathProps> = ({ path, from = 'dashboard' }) => {
    const { t } = useTranslation('main') 

    return (
        <>
            {path.map((item, index) => (
                <div key={index} className="path__wrap">
                        <a className="path__item--root">
                            <SettingsIcon className="icon-sm"/>
                            {t('modules.' + from + '.label')}
                        </a>
                        <IconArrowRight className="icon-sm"/>
                    {item.url ? (
                        <a href={item.url} className="path__item">
                            {item.slug}
                        </a>
                    ) : (
                        <span className="path__item">{item.slug}</span>
                    )}
                    
                    {index < path.length - 1 && (
                        <IconArrowRight className="icon-sm"/>
                    )}
                </div>
            ))}
        </>
    )
}

export default HeaderPath;