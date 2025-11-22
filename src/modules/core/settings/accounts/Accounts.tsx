import InputSearch from "@/components/common/Input/Search/SearchInput";
import Table, { Column } from "@/components/common/Table/Table";
import Profile, { ProfileProps } from "@/components/common/User/Profile";
import TeamDisplay, { TeamDisplayProps } from "@/components/common/User/Team";
import { SearchProvider } from "@/contexts/SearchContext";
import { ReactElement } from "react";

const SettingsAccounts: React.FC = () => {
    interface AccountsItem {
        user: ProfileProps;
        id: number;
        role: 'user' | 'admin' | 'owner';
        teams?: TeamDisplayProps[];
    }
    
    const columns: Column<AccountsItem>[] = [
        {
            header: "Account",
            accessor: (row) => <Profile displayFullName email={row.user.email} name={row.user.name} />,
            isSearchable: true,
            getSearchValues: (row) => [row.user.name.join(" "), row.user.email].concat(row.user.name)
        },
        {
            header: "ID",
            accessor: (row) => `#${row.id}`,
            isSortable: true,
            isSearchable: true,
            getSearchValues: (row) => `#${row.id}` 
        },
        {
            header: "Role",
            accessor: "role",
            isSearchable: true,
            isSortable: true
        },
        {
            header: "Teams",
            accessor: (row) => row.teams?.map((teamProps, index) => (
                <TeamDisplay key={index} {...teamProps} />
            )),

            isSearchable: true,
            getSearchValues: (row) => row.teams?.map(team => team.label).join(' ') || ""
        }
    ];

    const data: AccountsItem[] = [
        { 
            user: {displayFullName: true, email: "tyakovleva@b9creators.co.uk", name: ["Tatiana", "Yakovleva"]},
            id: 55024,
            role: 'user',
            teams: [{label: "Legislative", color: "brown", inline: true}]
        },
        {
            user: { displayFullName: true, email: "vyanukovych@b9creators.gov.ua", name: ["Viktor", "Yanukovych"] },
            id: 55025,
            role: 'admin',
            teams: [{ label: "Executive", color: "success", inline: true }]
        },
    ]

    return (
        <SearchProvider>
            <InputSearch/>
            <Table columns={columns} data={data} allowSelection footer={<p>Hello world</p>}/>
        </SearchProvider>
    )
}

export default SettingsAccounts;