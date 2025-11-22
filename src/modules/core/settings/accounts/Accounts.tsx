import InputSearch from "@/components/common/Input/SearchInput";
import Table, { Column } from "@/components/common/Table/Table";
import Profile from "@/components/common/User/Profile";
import TeamDisplay, { TeamDisplayProps } from "@/components/common/User/Team";
import { SearchProvider } from "@/contexts/SearchContext";
import { ReactElement } from "react";

const SettingsAccounts: React.FC = () => {
    interface AccountsItem {
        user: ReactElement;
        id: number;
        role: 'user' | 'admin' | 'owner';
        teams: ReactElement;
    }
    
    const columns: Column<AccountsItem>[] = [
        { header: "Account", accessor: "user", isSearchable: true },
        { header: "ID", accessor: "id" },
        { header: "Role", accessor: "role" },
        { header: "Teams", accessor: 'teams'}
    ];

    const data: AccountsItem[] = [
        { 
            user: <Profile displayFullName email="tyakovleva@b9creators.co.uk" name={["Tatiana", "Yakovleva"]}/>,
            id: 55024,
            role: 'user',
            teams: <TeamDisplay label="Executive" color="brown" inline></TeamDisplay>
        },
    ]

    return (
        <SearchProvider>
            <InputSearch/>
            <Table columns={columns} data={data} allowSelection/>
        </SearchProvider>
    )
}

export default SettingsAccounts;