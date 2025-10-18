import { ViewProvider } from "@/contexts/ViewContext";
import MainLayoutContent from "./MainLayoutContent";
import { UserProviderServer } from "@/contexts/UserProviderServer";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <UserProviderServer>
            <ViewProvider>
                <MainLayoutContent>{children}</MainLayoutContent>
            </ViewProvider>
        </UserProviderServer>
    );
}

export default MainLayout;