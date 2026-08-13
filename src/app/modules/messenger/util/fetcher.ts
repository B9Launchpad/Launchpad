import { MessengerHistory } from "../correspondence/History";
import { ChatsStore, messengerChatsStore } from "./store";

type ChatId = ChatsStore[number]['id'];

const APIError = new Error("API_URL undefind or otherwise invalid as a string. Please check data in your `.env` file is correct.");
const WebSocketError = new Error("WEBSOCKET_API_URL undefined or otherwise invalid as a string. Please check data in your `.env` file is correct.");

const WEBSOCKET_API_URL = process.env.NEXT_PUBLIC_WEBSOCKET_API_URL;
    if(!WEBSOCKET_API_URL || typeof WEBSOCKET_API_URL !== "string") 
        throw WebSocketError;

const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if(!API_URL || typeof API_URL !== "string") 
        throw APIError;

export const messengerInitChats = async (): Promise<ChatsStore> => {
    let chats: ChatsStore = messengerChatsStore.getInitialState();

    const dynamicUpdatesConnection = new WebSocket(`${WEBSOCKET_API_URL}/chat/dynamic`);
    dynamicUpdatesConnection.addEventListener("message", receiveDynamicUpdate);

    chats.concat(await fetchChats());

    messengerChatsStore.setState((state) => [
        ...state,
        ...chats
    ])

    return chats;
}

const fetchChats = async (): Promise<ChatsStore> => {
    const chatFetchRequest = new Request(`${API_URL}/chat`, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        redirect: "error",
        keepalive: false
    })

    let chats: ChatsStore = []

    fetch(chatFetchRequest)
        .then((response) => response.json())
        .then((data) => {
            for(const chat of data) {
                if(!chat.id) continue;
                const connection = establishSocketWithChat(chat.id satisfies ChatId);
                if(connection.readyState === WebSocket.CLOSED) continue;

                connection.addEventListener("message", receiveMessage);

                chats.push({
                    id: chat.id,
                    display: chat.profile,
                    connection,
                    history: chat.history
                });
            }
        })
        .catch((e) => {
            throw new Error("Error whilst fetching chats: " + e);
        });
    
    return chats;
}

const establishSocketWithChat = (chatId: ChatId): WebSocket => {
    const connection = new WebSocket(`${WEBSOCKET_API_URL}/chat/${chatId}`);

    return connection;
}

const receiveMessage = (msg: MessageEvent<any>) => {
    console.log("Received message: ", msg);
}

type DynamicUpdateData = {
    action: "create_chat" | "delete_chat";
    payload: {
        targetChat: {
            id: ChatId;
            display: ChatsStore[number]['display'];
        }[]
    }
}

const receiveDynamicUpdate = (msg: MessageEvent<any>): void => {
    const data: DynamicUpdateData = JSON.parse(msg.data.blob);

    if(data.action !== "create_chat" && data.action !== "delete_chat" 
        || !data.payload 
        || !data.payload.targetChat
        || !Array.isArray(data.payload.targetChat)
        || data.payload.targetChat.length === 0) return;


    switch(data.action) {
        case "create_chat": {
            let chats: ChatsStore = [];

            for(const chat of data.payload.targetChat) {
                if(!chat.id || !chat.display) continue;
                const connection = establishSocketWithChat(chat.id);

                chats.push({
                    id: chat.id,
                    connection,
                    display: chat.display
                })
            }

            if(chats.length === 0) break;

            messengerChatsStore.setState((state) => [
                ...state,
                ...chats
            ])

            break;
        }
        case "delete_chat": {
            let deletedIds: string[] = [];
            const chats = messengerChatsStore.getState()

            for(const chat of data.payload.targetChat) {

                const deletableChat = chats.find(c => c.id === chat.id)

                if(!deletableChat) continue;
                deletableChat.connection.close();

                deletedIds.push(deletableChat.id);
            }

            messengerChatsStore.setState((state) => [
                ...state.filter(c => !deletedIds.includes(c.id))
            ])

            break;
        }
    }
}

export const fetchHistory = (id: ChatId) => {
    const request = new Request(`${API_URL}/chat/${id}/history`, {
        method: "GET",
        mode: "cors",
        credentials: "include",
        redirect: "error",
        keepalive: false,
    })

    fetch(request)
        .then((response) => response.json())
        .then((data: MessengerHistory) => {
            messengerChatsStore.setState((state) => 
                state.map((chat) => {
                    if (chat.id !== id) return chat;
                    return {
                        ...chat,
                        history: [...(chat.history || []), ...data]
                    };
                })
            );
        })
        .catch((e) => {
            console.error("Error whilst fetching history: ", e);
        });
}