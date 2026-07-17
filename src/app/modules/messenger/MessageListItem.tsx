import { DisplayedProfile } from "@/components/common/User/Profile";
import ProfilePicture from "@/components/common/User/ProfilePicture";
import { Message } from "./Correspondence/Message";
import { isValidElement, useMemo } from "react";
import IconImage from "@/components/icons/Files/Image";

/**
 * Extracts only text as `string` from a rich text message (e.g. with formatting)
 * @param node rich message text contents as `React.ReactNode`
 * @returns `string` of text contents of rich message.
 */
const extractTextFromRichMessage = (node: React.ReactNode): string => {
    if (node == null || typeof node === 'boolean') return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    
    if (Array.isArray(node)) {
      return node.map(extractTextFromRichMessage).join('');
    }

    if (isValidElement<{ children?: React.ReactNode }>(node)) {
      return extractTextFromRichMessage(node.props.children);
    }

    return '';

}

type GetMessagePreview = (
    message: Omit<Message, "editedOn" | "sender">,
    lastOpened: Date
) => {
    preview: string;
    includesImages: boolean;
    unread: boolean;
}

const getMessagePreview: GetMessagePreview = (message, lastOpened) => {
    const text = extractTextFromRichMessage(message.content.text);
    const includesImages: boolean = (message.content.images?.length ?? 0) > 0;
    const unread = lastOpened < message.sentOn;

    if(text.length > 0) {
        return {
            preview: text,
            includesImages,
            unread
        }
    }

    return {
        preview: `${message.content.images!.length} images`,
        includesImages,
        unread
    }
}

interface MessengerMessageListItemProps {
    user: Omit<DisplayedProfile, "email">,
    lastMessage: Omit<Message, "editedOn" | "sender">
    lastOpened: Date;
}

const MessengerMessageListItem: React.FC<MessengerMessageListItemProps> = ({ user, lastMessage, lastOpened }) => {
    const preview = useMemo(() => {
        return getMessagePreview(lastMessage, lastOpened);
    }, [lastMessage, lastOpened])
    
    return (
        <div className="flex-row gap message-list__item">
            <ProfilePicture displayName={user.name} url={user.pictureUrl} size="md"/>
            <div className={`message-list__item-info--wrap ${preview.unread ? "active" : ""}`}>
                <div className="flex-col">
                    <p className="message-list__item--name">{user.name.join(" ")}</p>
                    <small className="message-list__item--message-content flex-row gap-sm align-center">
                        {preview.includesImages && <IconImage className="icon-md"/>} 
                        <span className="message-list__item--message-text">{preview.preview}</span>
                    </small>
                </div>
                <div className="flex-row message-list__item--message-details">
                    <p className={`message-list__item--date`}>{lastMessage.sentOn.getDate()}</p>
                    {preview.unread && <div className={`message-list__item--unread`}/>}
                </div>
            </div>
        </div>
    )
}

export default MessengerMessageListItem;