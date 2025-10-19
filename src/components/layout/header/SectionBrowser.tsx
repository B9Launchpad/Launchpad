import Tag from "@/components/common/Tag";
import { useEffect, useState } from "react";

type SectionBrowserItem = {
    label: string;
    id: string;
    onClick: () => void;
}

interface HeaderSectionBrowserProps {
    currentId?: string;
    items: SectionBrowserItem[]
}

const HeaderSectionBrowser: React.FC<HeaderSectionBrowserProps> = ({ items, currentId }) => {
    const [currentSectionId, setCurrentSectionId] = useState<string>(currentId || items[0].id);

    return (
        <div className="header__section-browser">
            <small className="header__section-browser--label">Browse sections</small>
            <div className="header__section-browser--items">
                {
                    items.map((item, index) => {
                        return (
                            <Tag key={index} label={item.label} color={item.id === currentSectionId ? 'access' : 'transparent'} onClick={() => {item.onClick(); setCurrentSectionId(item.id)}}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default HeaderSectionBrowser;