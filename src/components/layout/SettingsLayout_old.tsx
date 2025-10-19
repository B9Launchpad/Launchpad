import React, { useState, useEffect, useRef } from "react";
import { useView } from "@/contexts/ViewContext";
import Button from "../common/Button";
import SettingsSidebar, { SettingsSidebarItems } from "./sidebar/SettingsSidebar";
import { SearchProvider } from "@/contexts/SearchContext";
import IconLogout from "../icons/Logout";
import { useSpring, animated } from "react-spring";
import { LazySettingsPage, SettingsPage, useSettingsRegistry } from "@contexts/SettingsRegistryContext";
import '@styles/settings.css'
import PageHeader from "./header/PageHeader";
import KeyCap from "../misc/KeyCap";
import IconBack from "../icons/Input/Back";
import SuspenseLoader from "../common/Loader";
import HeaderSectionBrowser from "./header/SectionBrowser";

interface LayoutSettingsProps {
    children?: React.ReactNode;
}

const LayoutSettings: React.FC<LayoutSettingsProps> = () => {
    const { showSettings, setShowSettings } = useView();
    const [isVisible, setIsVisible] = useState(false);
    const [activePage, setActivePage] = useState<SettingsPage | LazySettingsPage | null>(null);
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [activeComponent, setActiveComponent] = useState<React.ComponentType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    
    
    const { registeredPages, getPagesByCategory, loadComponent, loadedComponents } = useSettingsRegistry();

    // Load component when active page changes
    useEffect(() => {
        const loadActiveComponent = async () => {
            if (!activePage) {
                setActiveComponent(null);
                return;
            }

            let targetSectionId = activeSectionId;
            setIsLoading(!loadedComponents.has(`${activePage.id}-${targetSectionId}`))
            if(!targetSectionId) {
                const defaultSection = activePage.sections.find(s => s.default === true);
                if(!defaultSection) throw new Error(`Default section not found for page id ${activePage.id}`)
                targetSectionId = defaultSection.id;
            }

            try {
                const component = await loadComponent(activePage.id, targetSectionId);
                setActiveComponent(() => component); // Apparently helps ensure this is a component and not a module.
            } catch (error) {
                console.error(`Failed to load component for ${activePage.id}:`, error);
                setActiveComponent(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadActiveComponent();
    }, [activePage, activeSectionId, loadComponent]);

    // showSettings visibility control
    useEffect(() => {
        if (showSettings) {
            setIsVisible(true);
            if (!activePage && registeredPages.length > 0) {
                setActivePage(registeredPages[0]);
            }
        }
    }, [showSettings, registeredPages]);

    const getSidebarItems = (): SettingsSidebarItems => {
        const userPages = getPagesByCategory('user');
        const panelPages = getPagesByCategory('panel');
        const miscPages = getPagesByCategory('misc');

        return {
            user: [
                ...userPages.map(page => ({
                    label: page.label,
                    onClick: () => setActivePage(page)
                }))
            ],
            panel: [
                ...panelPages.map(page => ({
                    label: page.label,
                    onClick: () => setActivePage(page)
                }))
            ],
            misc: [
                ...miscPages.map(page => ({
                    label: page.label,
                    onClick: () => setActivePage(page)
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
        if (!activePage) {
            return <div>Select a setting from the sidebar</div>;
        }

        if (!activePage.id) {
            return <div>Settings page not found</div>;
        }

        // Render dynamic components as imported by settingsScanner.ts
        if (activeComponent) {
            const PageComponent = activeComponent;
            return (
                <div className="settings__content--wrap">
                    <PageHeader 
                        title={activePage.label} 
                        settingsPath={true} 
                        path={[{slug: activePage.label}]}
                    />
                    {activePage.sections.length > 1 && (
                        <HeaderSectionBrowser currentId={activeSectionId || undefined} items={
                            activePage.sections.map(section => ({
                                label: section.label,
                                id: section.id,
                                onClick: () => setActiveSectionId(section.id)
                            }))
                        }/>
                    )}
                    {isLoading ? ( <SuspenseLoader/>)
                    : (
                        <div className="settings__content">
                            <PageComponent />
                        </div>
                    )}
                </div>
            );
        }

        return <div>Failed to load settings page</div>;
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
                // Reset active page when closing
                setActivePage(null);
                setActiveComponent(null);
            }
        }
    });

    const handleClose = () => {
        setIsVisible(false);
    };

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
            className="settings__main" 
            data-layer={"settings"} 
            role={"dialog"}
        >
            <div className="settings__nav--wrap">
                <div onClick={handleClose} className="setting__nav--controls">
                    <IconBack className="icon"/>
                    <KeyCap keyName="Escape" onKeyPress={handleClose}/>
                </div>
                <SearchProvider>
                    <SettingsSidebar items={sidebarItems}/>
                </SearchProvider>
            </div>
            <div className="settings__content-frame">
                {renderActivePage()}
            </div>
        </animated.div>
    )
}

export default LayoutSettings;