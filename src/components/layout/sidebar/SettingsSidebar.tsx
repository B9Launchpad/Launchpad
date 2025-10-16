import InputSearch from "@/components/common/Input/SearchInput";
import { SidebarItems } from "./Sidebar"
import SidebarItem from "./SidebarItem";
import { useSearch } from "@contexts/SearchContext";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export type SettingsSidebarItems = {
    user: SidebarItems,
    panel: SidebarItems,
    misc: SidebarItems
}

type SidebarBlocks = Array<{ title?: string, items: SidebarItems }>

interface SettingsSidedebarProps {
    items: SettingsSidebarItems;
}

const SettingsSidebar: React.FC<SettingsSidedebarProps> = ({ items }) => {
    const { query } = useSearch();
    const { t } = useTranslation('main')

    const SidebarBlocks = [
        { title: "User Settings", items: items.user },
        { title: "Panel Settings", items: items.panel },
        { items: items.misc },
    ] satisfies SidebarBlocks;

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
                        <div key={blockIndex} className="sidebar-block sidebar__items--wrap">
                            {block.title && (<h3 className="sidebar-block__title">{block.title}</h3>)}
                            {block.items.map((item, itemIndex) => (
                                <SidebarItem 
                                    key={`${blockIndex}-${itemIndex}`}
                                    label={item.label} 
                                    icon={item?.icon} 
                                    type={item.critical === true ? 'primary' : 'secondary'}
                                    url={item?.url}
                                    onClick={item?.onClick}
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