import { SearchProvider } from "@/functions/SearchContext";
import { ViewProvider, useView } from "@functions/ViewContext";
import { ProfileProps } from "../common/Profile";
import IconSecurity from "../icons/Security";
import SettingsIcon from "../icons/Settings";
import SidebarComponent, { SidebarItems } from "./sidebar/Sidebar";
import LayoutSettings from "./SettingsLayout";

interface MainLayoutProps {
    children: React.ReactNode;
}

// Inner component that uses the hook
function MainLayoutContent({ children }: MainLayoutProps) {
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
            <div className={"main-layout__layer"} aria-hidden={showSettings} aria-modal={!showSettings} data-layer={"base"}>
                <SearchProvider>
                    <SidebarComponent
                        items={SidebarItems} 
                        profile={profile}
                    />
                </SearchProvider>
                {children}
            </div>
            {showSettings && (
                <LayoutSettings>children</LayoutSettings>
            )}
        </div>
    )
}

// Outer provider wrapper
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <ViewProvider>
            <MainLayoutContent>{children}</MainLayoutContent>
        </ViewProvider>
    );
}

export default MainLayout;