import { ButtonProps } from "@/components/common/Button";
import HeaderPath, { HeaderPathType } from "./HeaderPath";

export type HeaderAction =
{
    context?: string;
    action: ButtonProps[]
}

interface PageHeaderProps {
    settingsPath: boolean;
    path: HeaderPathType,
    title: string;
    action?: HeaderAction;
}

const PageHeader: React.FC<PageHeaderProps> = ({ settingsPath, path, title, action }) => {
    return(
        <header className="">
            <HeaderPath path={path} from={settingsPath === true ? "settings" : "dashboard"}/>
            <h1>{title}</h1>
        </header>
    )
}

export default PageHeader;