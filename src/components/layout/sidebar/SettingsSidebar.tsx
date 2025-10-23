import InputSearch from "@/components/common/Input/SearchInput";
import { SidebarItems } from "./Sidebar"
import SidebarItem from "./SidebarItem";
import { useSearch } from "@contexts/SearchContext";
import { useTranslation } from "react-i18next";
import { useMemo, useEffect, useRef, useState } from "react";
import useLastInteractionKeyboard from "@/functions/useLastInteractionKeyboard";
import { useRouter } from "next/navigation";

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
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [hasFocus, setHasFocus] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const lastInteractionWasKeyboard = useLastInteractionKeyboard();
    const router = useRouter();

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
        })).filter(block => block.items.length > 0);
    }, [items, query]);

    // Navigation elements
    const allItems = useMemo(() => {
        return filteredBlocks.flatMap(block => block.items);
    }, [filteredBlocks]);

    const noQueryResults = query.trim() && filteredBlocks.length === 0;

    // Reset focus on search results & focus status change.
    useEffect(() => {
        setFocusedIndex(0);
    }, [allItems.length, query, hasFocus]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!hasFocus || allItems.length === 0) return;

        function execute(): void {
            e.preventDefault();
            const focusedItem = allItems[focusedIndex];
            if (focusedItem?.onClick) {
                focusedItem.onClick();
            } else if(focusedItem?.url) {
                router.push(focusedItem.url);
            }
        }

        switch(e.key) {
            case "ArrowDown": {
                e.preventDefault();
                if(focusedIndex + 1 > allItems.length - 1) return;
                setFocusedIndex((prev) => prev + 1);
                break;
            }
            case "ArrowUp": {
                e.preventDefault();
                if(focusedIndex - 1 < 0) return;
                setFocusedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
                break;
            }
            case "Enter": {
                execute()
                break;
            }
            case " ": {
                execute();
                break;
            }
        }

    };

    const handleFocus = () => {
        if (lastInteractionWasKeyboard) {
            setHasFocus(true);
        }
    };

    useEffect(() => {
        if(!lastInteractionWasKeyboard) {
            setHasFocus(false);
        }
    }, [lastInteractionWasKeyboard])

    const handleBlur = () => {
        setHasFocus(false);
    };

    // Helper function to get element index in global array
    const getGlobalIndex = (blockIndex: number, itemIndex: number): number => {
        let globalIndex = 0;
        for (let i = 0; i < blockIndex; i++) {
            globalIndex += filteredBlocks[i].items.length;
        }
        return globalIndex + itemIndex;
    };

    return (
        <nav>
            <InputSearch debounce={false}/>
            <div 
                ref={sidebarRef}
                role="navigation"
                tabIndex={0}
                className="sidebar__items--wrap sidebar__items--blocks"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                aria-activedescendant={allItems.length > 0 ? `sidebar-item-${focusedIndex}` : undefined}
            >
                {noQueryResults ? (
                    <p className="sidebar__no-results">Nothing found (BEAUTIFY!)</p>
                ) : (
                    filteredBlocks.map((block, blockIndex) => (
                        <div key={blockIndex} className="sidebar-block sidebar__items--wrap">
                            {block.title && (<h3 className="sidebar-block__title">{block.title}</h3>)}
                            {block.items.map((item, itemIndex) => {
                                const globalIndex = getGlobalIndex(blockIndex, itemIndex);
                                return (
                                    <SidebarItem 
                                        key={`${blockIndex}-${itemIndex}`}
                                        id={`sidebar-item-${globalIndex}`}
                                        label={item.label} 
                                        icon={item?.icon} 
                                        type={item.critical === true ? 'primary' : 'secondary'}
                                        url={item?.url}
                                        active={item?.active}
                                        onClick={item?.onClick}
                                        critical={item.critical}
                                        isFocused={hasFocus && focusedIndex === globalIndex}
                                    />
                                );
                            })}
                        </div>
                    ))
                )}
            </div>
        </nav>
    )
}

export default SettingsSidebar;