import IconArrowRight from "@/components/icons/ArrowRight";
import SettingsIcon from "@/components/icons/Settings";

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
    return (
        <>
            {path.map((item, index) => (
                <div key={index} className="path__wrap">
                        <a className="path__item--root">
                            <SettingsIcon className="icon-small"/>
                            {from}
                        </a>
                        <IconArrowRight className="icon-small"/>
                    {item.url ? (
                        <a href={item.url} className="path__item">
                            {item.slug}
                        </a>
                    ) : (
                        <span className="path__item">{item.slug}</span>
                    )}
                    
                    {/* Стрелка после элемента, кроме последнего */}
                    {index < path.length - 1 && (
                        <span className="mx-2 text-gray-400">→</span>
                    )}
                </div>
            ))}
        </>
    )
}

export default HeaderPath;