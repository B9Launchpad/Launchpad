'use client'
import { SearchProvider } from "@/contexts/SearchContext";
import { useView } from "@/contexts/ViewContext";
import { ProfileProps } from "../common/User/Profile";
import IconSecurity from "../icons/Security";
import SettingsIcon from "../icons/Settings";
import SidebarComponent, { SidebarItems } from "./sidebar/Sidebar";
import LayoutSettings from "./SettingsLayout";
import { SettingsRegistryProvider } from "@/contexts/SettingsRegistryContext";
import { PopupProvider } from "@/contexts/PopupContext";

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayoutContent({ children }: MainLayoutProps) {
    const { showSettings } = useView();

    const profile = {
        name: ["Tatiana", "Yakovleva"],
        email: "tyakovleva@b9creators.co.uk",
        picture: "/storage/d70ee478ead2fef85d9a86575b6d0315.webp"
    } satisfies ProfileProps;

    const SidebarItems = [
        {
            label: "Settings",
            type: 'secondary',
            icon: <SettingsIcon></SettingsIcon>,
            url: '/'
        },
        {
            label: "Safety",
            type: 'primary',
            icon: <IconSecurity/>,
            url: '/'
        }
    ] satisfies SidebarItems;

    return (
            <div className="main-layout__wrap">
                <PopupProvider>
                    <div className={"main-layout__layer"} aria-hidden={showSettings} aria-modal={!showSettings} data-layer={"base"}>
                        <SearchProvider>
                            <SidebarComponent
                                items={SidebarItems} 
                                profile={profile}
                            />
                        </SearchProvider>
                        <main className="main-layout__content">
                            {children}
                        </main>
                    </div>
                    <SettingsRegistryProvider>
                        {showSettings && (
                            <LayoutSettings></LayoutSettings>
                        )}
                    </SettingsRegistryProvider>
                </PopupProvider>
            </div>
    )
}