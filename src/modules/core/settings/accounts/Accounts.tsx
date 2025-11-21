import InputSearch from "@/components/common/Input/SearchInput";
import Table, { Column } from "@/components/common/Table/Table";
import { TeamDisplayProps } from "@/components/common/User/Team";
import { SearchProvider } from "@/contexts/SearchContext";

const SettingsAccounts: React.FC = () => {
    interface AccountsItem {
        user: {avatar: string, name: string, email: string};
        id: number;
        role: 'user' | 'admin' | 'owner';
        teams: Omit<TeamDisplayProps, 'inline'>[];
    }
    
    const columns: Column<AccountsItem>[] = [
        { header: "Account", accessor: "user" },
        { header: "ID", accessor: "id" },
        { header: "Role", accessor: "role" },
        { header: "Teams", accessor: 'teams'}
    ];

    const data: AccountsItem[] = [
        { 
            user: {avatar: '', email: 'tyakovleva@b9creators.co.uk', name: 'Tatiana Yakovleva'},
            id: 55024,
            role: 'user',
            teams: [{label: 'Executive', color: 'brown'}]
        },
        {
            user: { avatar: '', email: 'dwilenski@b9creators.co.uk', name: 'Dylan Wileński' },
            id: 55025,
            role: 'admin',
            teams: [{ label: 'Waiters', color: 'warning' }]
        }
    ]

    return (
        <SearchProvider>
            <InputSearch/>
            <Table columns={columns} data={data}/>
        </SearchProvider>
    )
}

export default SettingsAccounts;