import { DisplayedProfile } from "@/components/common/User/Profile";
import { createStore } from 'zustand'
import { MessengerHistory } from "../correspondence/History";


export type ChatsStore = Array<{
    id: string;
    connection: WebSocket;
    display?: DisplayedProfile; // temporarily marked as "| undefined"
    history?: MessengerHistory;
}>

export const messengerChatsStore = createStore<ChatsStore>((set) => [])