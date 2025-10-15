import InputSearch from "@/components/common/Input/SearchInput";
import Logo from "@/components/common/Logo";
import Profile, { ProfileProps } from "@/components/common/Profile";
import SidebarItem, { SidebarItemProps } from "./SidebarItem";
import { useSearch } from "@/contexts/SearchContext";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import SettingsIcon from "@/components/icons/Settings";
import IconLogout from "@/components/icons/Logout";
import { useView } from "@/contexts/ViewContext";

interface SidebarComponentProps {
    items?: SidebarItems;
    profile: ProfileProps;
}

export type SidebarItems = SidebarItemProps[]

const SidebarComponent: React.FC<SidebarComponentProps> = ({ items, profile }) => {
    const { query } = useSearch();
    const { t } = useTranslation('main')
    const { setShowSettings } = useView();

    const filteredItems = useMemo(() => {
        if (!items) return [];
        if (!query.trim()) {
            return items;
        }
        const searchTerm = query.toLowerCase().trim();
        return items.filter(item => 
            item.label.toLowerCase().startsWith(searchTerm)
        );
    }, [items, query]);
    const noQueryResults = query.trim() && filteredItems.length === 0;


    return (
        <nav>
            <Logo/>
            <InputSearch debounce={false}/>
            <div className="sidebar__items--wrap">
                {noQueryResults ? (
                    <p>Nothing found (BEAUTIFY!)</p>
                ) : (
                    filteredItems?.map((item, index) => (
                        <SidebarItem 
                            key={index} 
                            label={item.label} 
                            icon={item.icon} 
                            type={item?.type}
                        />
                    ))
                )
                }
            </div>
            <div className="sidebar__items--low">
                <SidebarItem onClick={() => {setShowSettings(true)}} label={t('modules.settings')} type="secondary" icon={<SettingsIcon/>}/>
            </div>
            <Profile name={profile.name} email={profile.email} picture={profile.picture}/>
        </nav>
    )
}

export default SidebarComponent;