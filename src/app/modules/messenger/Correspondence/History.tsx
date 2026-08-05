import { formatRelativeDate } from "@/utils/formatDate";
import MessengerMessage, { Message } from "./Message";
import { useTranslation } from "react-i18next";

type History = Message[]
interface BuiltHistoryMessage extends Message {
    displayTime: boolean;
}
type BuiltHistoryItem = 
    | {kind: "message"; data: { group: BuiltHistoryMessage[], isOwn: boolean } }
    | {kind: "date"; data: Date}
type BuiltHistory = BuiltHistoryItem[];

interface MessengerMessageHistoryProps {
    history: History;
}
/**
 * Groups and divides messages based on date and time between them, adds date separator entries.
 * **Rules for grouping (all must apply):**
 * 1. Sent by the same sender;
 * 2. Sent on the same day; and
 * 3. Sent within 5 minutes of each other.
 * 
 * Applies `displayTime` property if messages were not within the same minute.
 * 
 * @param history Array of messages sorted from newest to oldest.
 * @returns mappable message history of type `BuiltHistory` for use in render.
 */
const historyBuilder = (history: History): BuiltHistory => {
    const GROUP_TIME_WINDOW_MS = 5 * 60 * 1000;
    if (history.length === 0) return [];

    const builtHistory: BuiltHistory = [];
    let currentGroup: BuiltHistoryMessage[] = [];

    for (let i = 0; i < history.length; i++) {
        const message = history[i];

        if(builtHistory.length === 0) {
            builtHistory.push({ kind: "date", data: history[history.length - 1].sentOn})
        }

        if (currentGroup.length === 0) {
            currentGroup.push({...message, displayTime: true}); // set to true for now, re-think how to actually know based on the rules.
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

        const isOwn = currentGroup[0].isOwn;
        const sentWithinSameMinute = 
            isSameDay &&
            prevDate.getHours() === currDate.getHours() &&
            prevDate.getMinutes() === currDate.getMinutes();

        if (!isSameDay) {
            builtHistory.push({ kind: "message", data: {group: currentGroup, isOwn } });
            builtHistory.push({ kind: "date", data: message.sentOn });

            currentGroup = [{...message, displayTime: sentWithinSameMinute}];
            continue;
        }

        if (previous.sender !== message.sender) {
            builtHistory.push({ kind: "message", data: {group: currentGroup, isOwn } });

            currentGroup = [{...message, displayTime: sentWithinSameMinute}];
            continue;
        }

        if (timeDiff > GROUP_TIME_WINDOW_MS) {
            builtHistory.push({ kind: "message", data: {group: currentGroup, isOwn } });

            currentGroup = [{...message, displayTime: sentWithinSameMinute}];
            continue;
        }

        currentGroup.push({...message, displayTime: sentWithinSameMinute});
    }

    if (currentGroup.length > 0) {
        builtHistory.push({ kind: "message", data: {group: currentGroup, isOwn: currentGroup[0].isOwn} });
    }

    return builtHistory;
};

const MessengerMessageHistory: React.FC<MessengerMessageHistoryProps> = ({history}) => {
    const builtHistory = historyBuilder(history);
    const { t } = useTranslation("main")

    return (
        <div className="messenger__history--wrap">
            {
                builtHistory ? (
                    builtHistory.map((data, index) => {
                        if(data.kind === "date") {
                            return (
                                <div className="messenger__history--date" key={index}>
                                    {formatRelativeDate(data.data, t)}
                                </div>
                            )
                        } else {
                            return (
                                <div className="messenger__history--group" data-isown={data.data.isOwn} key={index}>
                                    <span className="messenger__history--group-label">You</span>
                                    {data.data.group.map((message, index) => {
                                        return (
                                            <div className="messenger__history--group-item" key={index}>
                                                <MessengerMessage {...message}/>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        }
                    })
                ) : (
                    <div>Nothing to show</div>
                )
            }
            <div className="messenger__history--message-group">
                
            </div>
        </div>
    )
}

export default MessengerMessageHistory;