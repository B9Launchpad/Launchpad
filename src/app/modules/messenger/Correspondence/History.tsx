import { Message } from "./Message";

type History = Message[]
type BuiltHistoryItem = 
    | {kind: "message"; data: Message[] }
    | {kind: "date"; data: Date}
type BuiltHistory = BuiltHistoryItem[];

interface MessengerMessageHistoryProps {
    history: History;
}
/**
 * Groups and divides messages based on date and time between them, adds date separator entries.
 * @param history Array of messages sorted from newest to oldest.
 * @returns mappable message history of type `BuiltHistory` for use in render.
 */
const historyBuilder = (history: History): BuiltHistory => {
    const GROUP_TIME_WINDOW_MS = 5 * 60 * 1000;
    if (history.length === 0) return [];

    const builtHistory: BuiltHistory = [];
    let currentGroup: Message[] = [];

    for (let i = 0; i < history.length; i++) {
        const message = history[i];

        if (currentGroup.length === 0) {
            currentGroup.push(message);
            continue;
        }

        const previous = currentGroup[currentGroup.length - 1];
        const timeDiff = previous.sentOn.getTime() - message.sentOn.getTime();

        const prevDate = previous.sentOn;
        const currDate = message.sentOn;
        const isSameDay = 
            prevDate.getFullYear() === currDate.getFullYear() &&
            prevDate.getMonth() === currDate.getMonth() &&
            prevDate.getDate() === currDate.getDate();

        if (!isSameDay) {
            builtHistory.push({ kind: "message", data: currentGroup });
            builtHistory.push({ kind: "date", data: message.sentOn });

            currentGroup = [message];
            continue;
        }

        if (previous.sender !== message.sender) {
            builtHistory.push({ kind: "message", data: currentGroup });
            
            currentGroup = [message];
            continue;
        }

        if (timeDiff > GROUP_TIME_WINDOW_MS) {
            builtHistory.push({ kind: "message", data: currentGroup });

            currentGroup = [message];
            continue;
        }

        currentGroup.push(message);
    }

    if (currentGroup.length > 0) {
        builtHistory.push({ kind: "message", data: currentGroup });
    }

    return builtHistory;
};

const MessengerMessageHistory: React.FC<MessengerMessageHistoryProps> = ({history}) => {

    return (
        <div className="messenger__history--wrap">
            {
                history.map((message, index) => {
                    return ( <div key={index}>{message.content.text}</div> )
                })
            }
            <div className="messenger__history--message-group">
                
            </div>
        </div>
    )
}

export default MessengerMessageHistory;