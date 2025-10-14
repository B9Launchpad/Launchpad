import { SearchProvider } from "@/functions/SearchContext";
import { ProfileProps } from "../common/Profile";
import IconSecurity from "../icons/Security";
import SettingsIcon from "../icons/Settings";
import SidebarComponent, { SidebarItems } from "./sidebar/Sidebar";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {

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
        <SearchProvider>
            <SidebarComponent
                items={SidebarItems} 
                profile={profile}
            />
        </SearchProvider>
    )
}

export default MainLayout;