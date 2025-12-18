import InputSearch from "@/components/common/Input/Search/SearchInput";
import Table, { Column } from "@/components/common/Table/Table";
import Profile, { ProfileProps } from "@/components/common/User/Profile";
import TeamDisplay, { TeamDisplayProps } from "@/components/common/User/Team";
import { SearchProvider } from "@/contexts/SearchContext";
import { useSettingsRouter } from "@/contexts/SettingsRouterContext";
import { UserDataProps } from "@/contexts/UserContext";
import makeFetchRequest from "@/utils/fetch/makeFetchRequest";
import SettingsNested from "@/utils/SettingsNested";
import { ReactElement, useEffect, useState } from "react";

const SettingsAccounts: React.FC = () => {
    const [users, setUsers] = useState<UserDataProps[]>([]);
    interface AccountsItem {
        user: ProfileProps;
        id: number;
        role: 'user' | 'admin' | 'owner';
        teams?: TeamDisplayProps[];
    }
    const SettingsRouter = useSettingsRouter();
    
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

    useEffect(() => {
        async function getAllUsers(): Promise<void> {
            const { response } = await makeFetchRequest({
                url: "/user/all",
                method: "GET",
                credentials: "include"
            })

            setUsers(await response.json());
        }

        getAllUsers();
    }, [])

    const data: AccountsItem[] = users.map(user => (
        {
            user: {displayFullName: true, email: user.email, name: user.username.split(" ")},
            id: user.id,
            role: user.role,
            teams: []
        }
    ));
    //[
    //    { 
    //        user: {displayFullName: true, email: "tyakovleva@b9creators.co.uk", name: ["Tatiana", "Yakovleva"]},
    //        id: 55024,
    //        role: 'user',
    //        teams: [{label: "Legislative", color: "brown", inline: true}]
    //    },
    //    {
    //        user: { displayFullName: true, email: "vyanukovych@b9creators.gov.ua", name: ["Viktor", "Yanukovych"] },
    //        id: 55025,
    //        role: 'admin',
    //        teams: []
    //    },
    //]

    const handleClick = (row: AccountsItem) => {
        SettingsRouter.push("core.launchpad.accounts.view", null, { id: row.id })
    }

    return (
        <SearchProvider>
            <InputSearch/>
            <Table columns={columns} onRowClick={handleClick} data={data} allowSelection footer={<p>Hello world</p>}/>
            <SettingsNested.Trigger targetId="core.launchpad.accounts.view" data={{ userId: 123 }}><p>Click me</p></SettingsNested.Trigger>
        </SearchProvider>
    )
}

export default SettingsAccounts;