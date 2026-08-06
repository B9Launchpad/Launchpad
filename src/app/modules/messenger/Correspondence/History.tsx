import { formatRelativeDate } from "@/utils/formatDate";
import MessengerMessage, { Message } from "./Message";
import { useTranslation } from "react-i18next";

type History = Message[]

type BuiltHistoryItem = 
    | {kind: "message"; data: { group: Message[], isOwn: boolean } }
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
    if (history.length === 0) return [];

    const GROUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
    const sorted = [...history].reverse();

    const result: BuiltHistory = [];
    let currentGroup: Message[] = [];
    let previousMessage: Message | null = null; // chronologically previous (overall)
    let previousGroupDate: Date | null = null; // date of the oldest message in previous group

    for (const msg of sorted as Message[]) {
        const isFirstInGroup = currentGroup.length === 0;

        if (!isFirstInGroup) {
            const lastInGroup = currentGroup[currentGroup.length - 1];
            const sameDay = isSameDay(msg.sentOn, lastInGroup.sentOn);
            const sameSender = msg.sender === lastInGroup.sender;
            const withinWindow = (msg.sentOn.getTime() - lastInGroup.sentOn.getTime()) <= GROUP_WINDOW_MS;

            if (!(sameDay && sameSender && withinWindow)) {
                result.push({
                    kind: 'message',
                    data: {
                        group: currentGroup,
                        isOwn: currentGroup[0].isOwn
                    }
                });
                
                previousGroupDate = currentGroup[0].sentOn;
                currentGroup = [];
            }
        }

        if (currentGroup.length === 0) {
            const groupDate = msg.sentOn;
            if (result.length === 0) {
                result.push({
                    kind: 'date',
                    data: groupDate
                });
            } else if (previousGroupDate && !isSameDay(groupDate, previousGroupDate)) {
                result.push({
                    kind: 'date',
                    data: groupDate
                });
            }
            msg.displaySender = true;
        } else {
            msg.displaySender = false;
        }

        if (previousMessage) {
            const sameMinute = isSameMinute(msg.sentOn, previousMessage.sentOn);
            msg.displayTime = !sameMinute;
        } else {
            msg.displayTime = true;
        }

        currentGroup.push(msg);
        previousMessage = msg;
    }

    if (currentGroup.length > 0) {
        result.push({
            kind: 'message',
            data: {
                group: currentGroup,
                isOwn: currentGroup[0].isOwn
            }
        });
    }

    return result;
};

const isSameDay = (a: Date, b: Date): boolean => {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

const isSameMinute = (a: Date, b: Date): boolean => {
    return isSameDay(a, b) &&
        a.getHours() === b.getHours() &&
        a.getMinutes() === b.getMinutes();
}

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
                                    {data.data.group.map((message, index) => {
                                        return (
                                            <MessengerMessage key={index} {...message}/>
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