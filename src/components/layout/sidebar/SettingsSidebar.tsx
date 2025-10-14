import InputSearch from "@/components/common/Input/SearchInput";
import { SidebarItems } from "./Sidebar"
import SidebarItem from "./SidebarItem";
import { useSearch } from "@/functions/SearchContext";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import IconLogout from "@/components/icons/Logout";

export type SettingsSidebarItems = {
    user: SidebarItems,
    panel: SidebarItems,
    misc: SidebarItems
}

interface SettingsSidedebarProps {
    items: SettingsSidebarItems;
}

const SettingsSidebar: React.FC<SettingsSidedebarProps> = ({ items }) => {
    const { query } = useSearch();
    const { t } = useTranslation('main')

    const SidebarBlocks = [
        { title: "User", items: items.user },
        { title: "Panel", items: items.panel },
        { title: "Misc", items: items.misc },
    ] as const;

    const filteredBlocks = useMemo(() => {
        if (!query.trim()) {
            return SidebarBlocks;
        }

        const searchTerm = query.toLowerCase().trim();
        
        return SidebarBlocks.map(block => ({
            ...block,
            items: block.items.filter(item => 
                item.label.toLowerCase().includes(searchTerm)
            )
        })).filter(block => block.items.length > 0); // Only keep blocks with results
    }, [items, query]);

    const noQueryResults = query.trim() && filteredBlocks.length === 0;

    return (
        <nav>
            <InputSearch debounce={false}/>
            <div className="sidebar__items--wrap sidebar__items--blocks">
                {noQueryResults ? (
                    <p className="sidebar__no-results">Nothing found (BEAUTIFY!)</p>
                ) : (
                    filteredBlocks.map((block, blockIndex) => (
                        <div key={block.title} className="sidebar-block sidebar__items--wrap">
                            <h3 className="sidebar-block__title">{block.title}</h3>
                            {block.items.map((item, itemIndex) => (
                                <SidebarItem 
                                    key={`${block.title}-${itemIndex}`}
                                    label={item.label} 
                                    icon={item?.icon} 
                                    type={item?.type}
                                    url={item.url}
                                    critical={item.critical}
                                />
                            ))}
                        </div>
                    ))
                )}
            </div>
        </nav>
    )
}

export default SettingsSidebar;