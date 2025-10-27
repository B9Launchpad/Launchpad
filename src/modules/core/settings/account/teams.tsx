// TO DO: i18n localise

import React from 'react';
import WindowComponent from '@/components/common/Window';
import List, { ListProps } from '@/components/common/Table/List';
import TeamDisplay from '@/components/common/User/Team';
import WindowBlock from '@/components/modules/FormBlock';


const SettingsAccountTeams: React.FC = () => {
    const listItems: ListProps = {
        items: [
            {
                content: <TeamDisplay label={"Designers"} color={"pink"} role={"admin"}/>
            },
            {
                content: <TeamDisplay label={"Executive"} color={"blue"} role={"user"}/>
            },
            {
                content: <TeamDisplay label={"Support"} color={"orange"} role={"user"}/>
            }
        ]
    }

    const listInviteItems: ListProps = {
        items: [
            {
                content: <TeamDisplay label={"Accounting"} color={"brown"} role={"user"}/>,
                action: [{label: "Decline", variant: "secondary"}, {label: "Accept"}]
            }
        ]
    }

    return (
        <>
            <WindowComponent 
                label='Your teams'
                description='Teams are subdivisions within your organisation, only the teams you are in will be shown here. Team membership is managed by your IT administrator.' 
                action={[{label: "Join team with code"}]}
            >
                <WindowBlock label='Joined teams'>
                    <List items={listItems.items}/>
                </WindowBlock>
                <WindowBlock label='Pending invites' description='Teams you have been invited to join'>
                    <List items={listInviteItems.items}/>
                </WindowBlock>
            </WindowComponent>
        </>
    );
};

export default SettingsAccountTeams;