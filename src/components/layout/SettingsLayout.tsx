import React, { useState, useEffect, useRef } from "react";
import { useView } from "@/contexts/ViewContext";
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
import makeFetchRequest from "@/utils/fetch/makeFetchRequest";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface LayoutSettingsProps {
    children?: React.ReactNode;
}

interface ActivePageState {
    page: SettingsPage | LazySettingsPage | null;
    sectionId: string | null;
}

const LayoutSettings: React.FC<LayoutSettingsProps> = () => {
    const { t } = useTranslation('main');
    const router = useRouter();
    const { showSettings, setShowSettings } = useView();
    const [isVisible, setIsVisible] = useState(false);
    const [activePageState, setActivePageState] = useState<ActivePageState>({ 
        page: null, 
        sectionId: null 
    });
    const [activeComponent, setActiveComponent] = useState<React.ComponentType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const { registeredPages, getPagesByCategory, loadComponent, loadedComponents } = useSettingsRegistry();

    // setActivePageState helper
    const setActivePage = (page: SettingsPage | LazySettingsPage | null) => {
        setActiveComponent(null);
        setActivePageState({ 
            page, 
            sectionId: null
        });
    };

    const setActiveSectionId = (sectionId: string | null) => {
        setActivePageState(prev => ({
            ...prev,
            sectionId
        }));
    };

    const logout = async () => {
        const { status } = await makeFetchRequest({
            url: '/logout',
            method: 'GET',
            includeCredentials: true
        })
    
        if(status === 200) {
            router.push('/login');
        }
    }

    useEffect(() => {
        const loadActiveComponent = async () => {
            if (!activePageState.page) {
                setActiveComponent(null);
                return;
            }

            let targetSectionId = activePageState.sectionId;
            const componentKey = `${activePageState.page.id}-${targetSectionId}`;
            
            setIsLoading(!loadedComponents.has(componentKey));
            
            if(!targetSectionId) {
                const defaultSection = activePageState.page.sections.find(s => s.default === true);
                if(!defaultSection) throw new Error(`Default section not found for page id ${activePageState.page.id}`)
                targetSectionId = defaultSection.id;
                setActiveSectionId(targetSectionId); // This will trigger another effect run
                return; // Wait for the state update
            }

            try {
                const component = await loadComponent(activePageState.page.id, targetSectionId);
                setActiveComponent(() => component);
            } catch (error) {
                console.error(`Failed to load component for ${activePageState.page.id}:`, error);
                setActiveComponent(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadActiveComponent();
    }, [activePageState, loadComponent, loadedComponents]);

    // showSettings visibility control
    useEffect(() => {
        if (showSettings) {
            setIsVisible(true);
            if (!activePageState.page && registeredPages.length > 0) {
                const accountPage = registeredPages.find(page => page.id === 'account');
                if (accountPage) {
                    setActivePage(accountPage);
                } else {
                    // Fallback to first page if account not found
                    setActivePage(registeredPages[0]);
                }
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
                    active: page.id === activePageState.page?.id,
                    onClick: () => {
                        if(activePageState.page?.id !== page.id) {
                            setActivePage(page);
                        }
                    }
                }))
            ],
            panel: [
                ...panelPages.map(page => ({
                    label: page.label,
                    active: page.id === activePageState.page?.id,
                    onClick: () => {
                        if(activePageState.page?.id !== page.id) {
                            setActivePage(page);
                        }
                    }
                }))
            ],
            misc: [
                ...miscPages.map(page => ({
                    label: page.label,
                    active: page.id === activePageState.page?.id,
                    onClick: () => {
                        if(activePageState.page?.id !== page.id) {
                            setActivePage(page);
                        }
                    }
                })),
                
                // STATICS
                {
                    label: t('modules.settings.logout'),
                    icon: <IconLogout/>,
                    type: 'primary' as const,
                    critical: true,
                    onClick: () => {
                        logout();
                    }
                }
            ],
        };
    };

    const renderActivePage = () => {
        if (!activePageState.page) {
            return <div>Select a setting from the sidebar</div>;
        }

        // Very fragile loader
        if (isLoading || !activeComponent) {
            return (
                <div className="settings__content--wrap">
                    <PageHeader 
                        title={activePageState.page.label} 
                        settingsPath={true} 
                        path={[{slug: activePageState.page.label}]}
                    />
                    {activePageState.page.sections.length > 1 && (
                        <HeaderSectionBrowser currentId={activePageState.sectionId || undefined} items={
                            activePageState.page.sections.map(section => ({
                                label: section.label,
                                id: section.id,
                                onClick: () => setActiveSectionId(section.id)
                            }))
                        }/>
                    )}
                    <SuspenseLoader/>
                </div>
            );
        }

        // Render dynamic components as imported by settingsScanner.ts
        const PageComponent = activeComponent;
        return (
            <div className="settings__content--wrap">
                <PageHeader 
                    title={activePageState.page.label} 
                    settingsPath={true} 
                    path={[{slug: activePageState.page.label}]}
                />
                {activePageState.page.sections.length > 1 && (
                    <HeaderSectionBrowser currentId={activePageState.sectionId || undefined} items={
                        activePageState.page.sections.map(section => ({
                            label: section.label,
                            id: section.id,
                            onClick: () => setActiveSectionId(section.id)
                        }))
                    }/>
                )}
                <div className="settings__content">
                    <PageComponent />
                </div>
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
                // Reset active page when closing
                setActivePageState({ page: null, sectionId: null });
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

    const sidebarItems = React.useMemo(() => getSidebarItems(), [
        activePageState.page?.id, 
        registeredPages, 
        getPagesByCategory
    ]);

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