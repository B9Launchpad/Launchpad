import Tag from "@/components/common/Tag";
import useLastInteractionKeyboard from "@/functions/useLastInteractionKeyboard";
import { useEffect, useRef, useState } from "react";

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
    const containerRef = useRef<HTMLDivElement>(null);
    const [focusedIndex, setFocusedIndex] = useState<number>(0);
    const [hasFocus, setHasFocus] = useState<boolean>(false)
    const lastInteractionKeyboard = useLastInteractionKeyboard();

    useEffect(() => {
        if(!hasFocus) {
            handleBlur();
        }
    }, [hasFocus])

    useEffect(() => {
        if(!lastInteractionKeyboard) {
            setHasFocus(false);
        }
    }, [lastInteractionKeyboard])

    const handleFocus = () => {
        if(lastInteractionKeyboard) {
            setHasFocus(true);
        }
    }

    const handleBlur = () => {
        setHasFocus(false);
        setFocusedIndex(0);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if(!hasFocus || items.length === 0) return;

        function execute(): void {
            e.preventDefault();
            const focusedItem = items[focusedIndex];
            focusedItem.onClick();
            setCurrentSectionId(focusedItem.id);
        }

        switch(e.key) {
            case "ArrowRight": {
                e.preventDefault();
                if(focusedIndex + 1 > items.length - 1) return;
                setFocusedIndex((prev) => prev + 1);
                break;
            }
            case "ArrowLeft": {
                e.preventDefault();
                if(focusedIndex - 1 < 0) return;
                setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
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
    }

    return (
        <div className="header__section-browser">
            <small className="header__section-browser--label">Browse sections</small>
            <div 
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                ref={containerRef} 
                tabIndex={0} 
                className="header__section-browser--items">
                {
                    items.map((item, index) => {
                        return (
                            <Tag tabIndex={-1} key={index} isFocused={focusedIndex === index && hasFocus === true} label={item.label} color={item.id === currentSectionId ? 'access' : 'transparent'} onClick={() => {item.onClick(); setCurrentSectionId(item.id)}}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default HeaderSectionBrowser;