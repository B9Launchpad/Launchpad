import { useView } from "@/functions/ViewContext";
import Button from "../common/Button";
import SettingsSidebar, { SettingsSidebarItems } from "./sidebar/SettingsSidebar";
import { SearchProvider } from "@/functions/SearchContext";
import IconLogout from "../icons/Logout";
import { useSpring, animated } from "react-spring";
import SpringConfig from "@/utils/SpringConfig";
import { useState, useEffect, useRef } from "react";

interface LayoutSettingsProps {
    children?: React.ReactNode;
}

const LayoutSettings: React.FC<LayoutSettingsProps> = ({ children }) => {
    const { showSettings, setShowSettings } = useView();
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Control visibility based on showSettings
    useEffect(() => {
        if (showSettings) {
            setIsVisible(true);
        }
    }, [showSettings]);

    // Focus the container when it becomes visible
    useEffect(() => {
        if (isVisible && containerRef.current) {
            containerRef.current.focus();
        }
    }, [isVisible]);

    const SidebarItems = {
        user: [
            {
                label: "Account",
                type: 'secondary',
                url: '/'
            },
            {
                label: "Personalisation",
                type: 'secondary',
                url: '/'
            },
            {
                label: "Language",
                type: 'secondary',
                url: '/'
            }
        ],
        panel: [
            {
                label: "General",
                type: 'secondary',
                url: '/'
            },
            {
                label: "Accounts",
                type: 'secondary',
                url: '/'
            },
            {
                label: "Teams",
                type: 'secondary',
                url: '/'
            },
            {
                label: "Modules",
                type: 'secondary',
                url: '/'
            },
            {
                label: "Databases",
                type: 'secondary',
                url: '/'
            },
            {
                label: "APIs",
                type: 'secondary',
                url: '/'
            },
            {
                label: "Panel Update",
                type: 'secondary',
                url: '/'
            }
        ],
        misc: [
            {
                label: "About",
                type: 'secondary',
                url: '/'
            },
            {
                label: "Log out",
                icon: <IconLogout/>,
                type: 'primary',
                critical: true,
                url: '/api/logout'
            }
        ],
    } satisfies SettingsSidebarItems;

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

    // Don't render if not showing and not animating out
    if (!showSettings && !isVisible) {
        return null;
    }

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
            tabIndex={-1} // KEEP WITHOUT TAB ORDER
            onKeyDown={handleKeyDown}
        >
            <div className="settings__nav--wrap">
                <Button onClick={handleClose}>OUT!</Button>
                <SearchProvider>
                    <SettingsSidebar items={SidebarItems}/>
                </SearchProvider>
            </div>
            <div className="settings__content">
                content{/* To be rendered without explicitly providing component name or url*/}
            </div>
        </animated.div>
    )
}

export default LayoutSettings;