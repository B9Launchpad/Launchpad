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
import { useModal } from "@/contexts/ModalContext";
import { createFocusTrap } from "focus-trap";
import { SettingsRouterProvider, useSettingsRouter } from "@/contexts/SettingsRouterContext";

interface LayoutSettingsProps {
    children?: React.ReactNode;
}

const LayoutSettingsContent: React.FC = () => {
    const { t } = useTranslation('main');
    const router = useRouter();
    const { showSettings, setShowSettings } = useView();
    const [isVisible, setIsVisible] = useState(false);
    
    const { currentEntry, reset, pop, stack, push } = useSettingsRouter();
    const { registeredPages, getPagesByCategory, loadComponent, loadedComponents } = useSettingsRegistry();

    const [displayedEntry, setDisplayedEntry] = useState<typeof currentEntry>(null);
    const [activeComponent, setActiveComponent] = useState<React.ComponentType | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { isOpen } = useModal();

    useEffect(() => {
        if (showSettings) {
            setIsVisible(true);
            if (!currentEntry && registeredPages.length > 0) {
                const accountPage = registeredPages.find(page => page.id === 'core.launchpad.account');
                const fallbackPage = registeredPages.find(page => !page.isNested);
                const targetPage = accountPage || fallbackPage;
                if (targetPage) reset(targetPage.id);
            }
        }
    }, [showSettings, registeredPages, currentEntry, reset]);

    useEffect(() => {
        const loadActiveComponent = async () => {
            if (!currentEntry) {
                setActiveComponent(null);
                setDisplayedEntry(null);
                return;
            }

            const page = registeredPages.find(p => p.id === currentEntry.pageId);
            if (!page) throw new Error("No page found for id " + currentEntry.pageId);

            let targetSectionId = currentEntry.sectionId;
            if(!targetSectionId) {
                const defaultSection = (page as any).sections?.find((s: any) => s.default === true);
                targetSectionId = defaultSection?.id;
            }

            if (!targetSectionId) return;

            const componentKey = `${page.id}-${targetSectionId}`;
        
            const commitChange = (Comp: React.ComponentType | null) => {
                setActiveComponent(() => Comp);
                setDisplayedEntry(currentEntry);
                setIsLoading(false);
            };

            if (loadedComponents.has(componentKey)) {
                commitChange(loadedComponents.get(componentKey)!);
            } else {
                setIsLoading(true);
                try {
                    const component = await loadComponent(page.id, targetSectionId);
                    commitChange(component);
                } catch (error) {
                    console.error(`Failed to load component for ${page.id}:`, error);
                    setIsLoading(false);
                }
            }
        };

        loadActiveComponent();
    }, [currentEntry, registeredPages, loadComponent, loadedComponents]);

    const logout = async () => {
        const { status } = await makeFetchRequest({ url: '/logout', method: 'GET', credentials: "include" })
        if(status === 200) router.push('/login');
    }

    const getSidebarItems = (): SettingsSidebarItems => {
        const userPages = getPagesByCategory('user').filter(p => !p.isNested);
        const panelPages = getPagesByCategory('panel').filter(p => !p.isNested);
        const miscPages = getPagesByCategory('misc').filter(p => !p.isNested);

        const activePageObj = registeredPages.find(p => p.id === currentEntry?.pageId);

        const createItem = (page: SettingsPage | LazySettingsPage) => ({
            label: page.ns ? t(page.label, { ns: page.ns }) : page.label,
            active: page.id === currentEntry?.pageId || (activePageObj?.parentId === page.id),
            onClick: () => {
                if(currentEntry?.pageId !== page.id) reset(page.id);
            }
        });

        return {
            user: userPages.map(createItem),
            panel: panelPages.map(createItem),
            misc: [...miscPages.map(createItem), { label: t('modules.settings.logout'), icon: <IconLogout/>, type: 'primary', critical: true, onClick: logout }],
        };
    };

    const renderActivePage = () => {
        if (!displayedEntry || !activeComponent) {
            return (
                <div className="settings__content--wrap">
                     <PageHeader 
                        title={"Loading..."} 
                        settingsPath={true} 
                        path={[{ slug: "Loading..." }]}
                    />
                    <SuspenseLoader/>
                </div>
            );
        }

        const currentPage = registeredPages.find(p => p.id === displayedEntry.pageId);
        
        if (isLoading || !activeComponent || !currentPage) {
            return (
                <div className="settings__content--wrap">
                    <PageHeader 
                        title={currentPage ? (currentPage.ns ? t(currentPage.label, { ns: currentPage.ns }) : currentPage.label) : "Loading..."} 
                        settingsPath={true} 
                        path={[{ slug: "Loading..." }]}
                    />
                    <SuspenseLoader/>
                </div>
            );
        }

        if (!currentPage) return null;

        const PageComponent = activeComponent;
        const pageProps = displayedEntry.params || {};
        const sections = (currentPage as any).sections || [];

        //const parentPage = currentPage.parentId 
        //    ? registeredPages.find(p => p.id === currentPage.parentId) 
        //    : null;
        //
        //const pathItems: { slug: string }[] = [];
        //
        //if (parentPage) {
        //    const parentLabel = parentPage.ns ? t(parentPage.label, { ns: parentPage.ns }) : parentPage.label;
        //    pathItems.push({ slug: parentLabel });
        //}
        //
        //const currentLabel = currentPage.ns ? t(currentPage.label, { ns: currentPage.ns }) : currentPage.label;
        //pathItems.push({ slug: currentLabel });

        return (
            <div className="settings__content--wrap" style={{ position: 'relative' }}>
                <PageHeader 
                    title={currentPage.ns ? t(currentPage.label, { ns: currentPage.ns }) : currentPage.label}
                    settingsPath={true} 
                    path={[{ slug: (currentPage.ns ? t(currentPage.label, { ns: currentPage.ns }) : currentPage.label) }]}
                    onBack={stack.length > 1 ? pop : undefined}
                />
                
                {sections.length > 1 && (
                    <HeaderSectionBrowser 
                        currentId={displayedEntry.sectionId || sections.find((s:any) => s.default)?.id} 
                        items={sections.map((section: any) => ({
                            label: currentPage.ns ? t(section.label, { ns: currentPage.ns }) : section.label,
                            id: section.id,
                            onClick: () => push(currentPage.id, section.id, displayedEntry.params)
                        }))}
                    />
                )}
                
                <div className="settings__content">
                    <PageComponent {...pageProps} />
                </div>
            </div>
        );
    };

    const style = useSpring({
        from: { opacity: 0, transform: 'scale(1.1)' },
        to: { opacity: isVisible ? 1 : 0, transform: isVisible ? 'scale(1)' : 'scale(1.2)' },
        config: { tension: 200, precision: 0.01, velocity: 0.001 },
        onRest: () => {
            if (!isVisible) {
                setShowSettings(false);
                reset('');
                setActiveComponent(null);
                setDisplayedEntry(null);
            }
        }
    });

    const handleClose = () => setIsVisible(false);

    useEffect(() => {
        if(!isVisible || !containerRef.current) return;
        const trap = createFocusTrap(containerRef.current);
        if(isOpen) trap.pause(); else trap.activate();
        return () => { trap.deactivate(); }
    }, [isVisible, isOpen]);

    if (!showSettings && !isVisible) return null;

    return (
        <animated.div 
            ref={containerRef}
            style={{ ...style, transformOrigin: 'center center' }} 
            aria-hidden={!isVisible} aria-modal={isVisible} 
            className="settings__main" data-layer={"settings"} role={"dialog"}
        >
            <div className="settings__nav--wrap">
                <div onClick={handleClose} className="setting__nav--controls">
                    <IconBack className="icon"/>
                    <KeyCap keyName="Escape" onKeyPress={handleClose}/>
                </div>
                <SearchProvider>
                    <SettingsSidebar items={getSidebarItems()}/>
                </SearchProvider>
            </div>
            <div className="settings__content-frame">
                {renderActivePage()}
            </div>
        </animated.div>
    );
};

const LayoutSettings: React.FC<LayoutSettingsProps> = () => {
    return (
        <SettingsRouterProvider>
            <LayoutSettingsContent />
        </SettingsRouterProvider>
    );
}

export default LayoutSettings;