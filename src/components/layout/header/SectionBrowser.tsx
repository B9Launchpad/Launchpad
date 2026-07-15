import Tag from "@/components/common/Tag";
import useLastInteractionKeyboard from "@/functions/useLastInteractionKeyboard";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export type SectionBrowserItem = {
    label?: string;
    icon?: React.ReactNode;
    id: string;
    onClick: () => void;
}

interface HeaderSectionBrowserProps {
    currentId?: string;
    items: SectionBrowserItem[];
    transparentInactiveItems?: boolean;
    excludeInstructions?: boolean;
}

/**
 * Creates a navigation panel with section switch buttons with assigned `onClick()` actions.
 * @param currentId ID of currently active section, defaults to first provided section.
 * @param items `Array<SectionBrowserItem> of buttons to render (see type `SectionBrowserItem`)
 * @param transparentInactiveItems Sets whether to add a background colour to inactive buttons, defaults to `true`.
 * @param excludeInstructions Specifies whether to exclude `Browse sections` label for the user, defauts to `false`.
 */
const HeaderSectionBrowser: React.FC<HeaderSectionBrowserProps> = ({ items, currentId, transparentInactiveItems = true, excludeInstructions = false }) => {
    const { t } = useTranslation('main')
    const [currentSectionId, setCurrentSectionId] = useState<string>(currentId || items[0]?.id || '');
    const containerRef = useRef<HTMLDivElement>(null);
    const [focusedIndex, setFocusedIndex] = useState<number>(0);
    const [hasFocus, setHasFocus] = useState<boolean>(false)
    const lastInteractionKeyboard = useLastInteractionKeyboard();

    for(let i = 0; i < items.length; i++) {
        if(!items[i].icon && !items[i].label) {
            throw new Error("<HeaderSectionBrowser> requires items to have `label` or `icon` defined, but received `undefined` for both.")
        }
    }

    useEffect(() => {
        if (currentId && currentId !== currentSectionId) {
            setCurrentSectionId(currentId);

            const newIndex = items.findIndex(item => item.id === currentId);
            if (newIndex !== -1) {
                setFocusedIndex(newIndex);
            }
        }
    }, [currentId, currentSectionId, items]);

    useEffect(() => {
        if (!hasFocus) {
            handleBlur();
        }
    }, [hasFocus])

    useEffect(() => {
        if (!lastInteractionKeyboard) {
            setHasFocus(false);
        }
    }, [lastInteractionKeyboard])

    const handleFocus = () => {
        if (lastInteractionKeyboard) {
            setHasFocus(true);
        }
    }

    const handleBlur = () => {
        setHasFocus(false);
        setFocusedIndex(0);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!hasFocus || items.length === 0) return;

        function execute(): void {
            e.preventDefault();
            const focusedItem = items[focusedIndex];
            focusedItem.onClick();
        }

        switch (e.key) {
            case "ArrowRight": {
                e.preventDefault();
                if (focusedIndex + 1 > items.length - 1) return;
                setFocusedIndex((prev) => prev + 1);
                break;
            }
            case "ArrowLeft": {
                e.preventDefault();
                if (focusedIndex - 1 < 0) return;
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
            {!excludeInstructions && <small className="header__section-browser--label">{t('layout.browseSections')}</small>}
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
                            <Tag
                                tabIndex={-1}
                                key={index}
                                isFocused={focusedIndex === index && hasFocus === true}
                                label={item.label}
                                icon={item.icon}
                                color={item.id === currentSectionId ? 'access' : (transparentInactiveItems ? 'transparent' : 'secondary')}
                                onClick={item.onClick}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default HeaderSectionBrowser;