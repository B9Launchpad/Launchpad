import { useView } from "@/contexts/ViewContext";
import Button from "../common/Button";
import SettingsSidebar, { SettingsSidebarItems } from "./sidebar/SettingsSidebar";
import { SearchProvider } from "@/contexts/SearchContext";
import IconLogout from "../icons/Logout";
import { useSpring, animated } from "react-spring";
import SpringConfig from "@/utils/SpringConfig";
import { useState, useEffect, useRef } from "react";
import { useSettingsRegistry } from "@contexts/SettingsRegistryContext";
import '@styles/settings.css'

interface LayoutSettingsProps {
    children?: React.ReactNode;
}

const LayoutSettings: React.FC<LayoutSettingsProps> = ({ children }) => {
    const { showSettings, setShowSettings } = useView();
    const [isVisible, setIsVisible] = useState(false);
    const [activePageId, setActivePageId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const { registeredPages, getPagesByCategory } = useSettingsRegistry();

    // showSettings visibility control
    useEffect(() => {
        if (showSettings) {
            setIsVisible(true);
            if (!activePageId && registeredPages.length > 0) {
                setActivePageId(registeredPages[0].id);
            }
        }
    }, [showSettings, registeredPages]);

    // !! This focuses on the container when it becomes visible GIVES AN ARIA COMPATIBILITY WARNING WHEN UNMOUNTED !!
    useEffect(() => {
        if (isVisible && containerRef.current) {
            containerRef.current.focus();
        }

        return () => {
            if(containerRef.current) {
                containerRef.current.blur()
            } // fix idea for above?
        }
    }, [isVisible]);

    const getSidebarItems = (): SettingsSidebarItems => {
        const userPages = getPagesByCategory('user');
        const panelPages = getPagesByCategory('panel');
        const miscPages = getPagesByCategory('misc');

        console.log(panelPages)
        return {
            user: [
                ...userPages.map(page => ({
                    label: page.label,
                    type: page.type || 'secondary' as const,
                    icon: page.icon,
                    onClick: () => setActivePageId(page.id)
                }))
            ],
            panel: [
                ...panelPages.map(page => ({
                    label: page.label,
                    type: page.type || 'secondary' as const,
                    icon: page.icon,
                    onClick: () => setActivePageId(page.id)
                }))
            ],
            misc: [
                ...miscPages.map(page => ({
                    label: page.label,
                    type: page.type || 'secondary' as const,
                    icon: page.icon,
                    critical: page.critical,
                    onClick: page.critical ? undefined : () => setActivePageId(page.id)
                })),
                
                // STATICS

                {
                    label: "Log out",
                    icon: <IconLogout/>,
                    type: 'primary' as const,
                    critical: true,
                    url: '/api/logout'
                }
            ],
        };
    };

    const renderActivePage = () => {
        if (!activePageId) {
            return <div>Select a setting from the sidebar</div>;
        }

        const activePage = registeredPages.find(page => page.id === activePageId);
        if (!activePage) {
            return <div>Settings page not found</div>;
        }

        const PageComponent = activePage.component;
        return (
            <div className="settings__content--wrap">
                <header className="settings__header">
                    <h1>{activePage.label}</h1>
                </header>
                <PageComponent />
            </div>
        );
    };

    const style = useSpring({
        from: { 
            opacity: 0, 
            transform: 'scale(1.1)',
        },
        to: { 
            opacity: isVisible ? 1 : 0, 
            transform: isVisible ? 'scale(1)' : 'scale(1.2)',
        },
        config: { 
            tension: 200,
            precision: 0.01, 
            velocity: 0.001
        },
        onRest: () => {
            if (!isVisible) {
                setShowSettings(false);
            }
        }
    });

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            handleClose();
        }
    }

    if (!showSettings && !isVisible) {
        return null;
    }

    const sidebarItems = getSidebarItems();

    return (
        <animated.div 
            ref={containerRef}
            style={{
                ...style,
                transformOrigin: 'center center'
            }} 
            aria-hidden={!isVisible} 
            aria-modal={isVisible} 
            className="main-layout__layer settings__main" 
            data-layer={"settings"} 
            role={"dialog"}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
        >
            <div className="settings__nav--wrap">
                <Button onClick={handleClose}>OUT!</Button>
                <SearchProvider>
                    <SettingsSidebar items={sidebarItems}/>
                </SearchProvider>
            </div>
            <div className="settings__content">
                {renderActivePage()}
            </div>
        </animated.div>
    )
}

export default LayoutSettings;