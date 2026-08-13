import React from 'react';
import { DisplayedProfile } from '@/components/common/User/Profile';
import { formatTime } from '@/utils/formatDate';

export type MessageContent = {
    text?: string | React.ReactNode;
    images?: Array<{ url: string; alt?: string }>;
};

export type MessengerMessageProps = {
    content: MessageContent;
    sender: Omit<DisplayedProfile, "email">;
    sentOn: Date;
    editedOn?: Date;
    isOwn: boolean;
    displaySender: boolean;
    displayTime: boolean;
};

/**
 * AI-generated for testing purposes.
 */
const mockSender: DisplayedProfile = {
    name: [['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'][Math.floor(Math.random() * 5)], ['Stamm', 'Tauss', 'Nadsor', 'Levitt', 'Yakovleva'][Math.floor(Math.random() * 5)]],
    email: ['astamm', 'btauss', 'cnadsor', 'dlevitt', 'eyakovleva'][Math.floor(Math.random() * 5)] + "@b9creators.co.uk",
    pictureUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
};

const imageUrls = [
    { url: 'https://picsum.photos/seed/1/400/300', alt: 'Mountain landscape' },
    { url: 'https://picsum.photos/seed/2/400/300', alt: 'City skyline' },
    { url: 'https://picsum.photos/seed/3/400/300', alt: 'Ocean sunset' },
];

const textSamples = [
    'Hey, check this out!',
    'Just came back from vacation 🏖️',
    <span>Look at this <strong>beautiful</strong> view!</span>,
    <div>Here's a <code>code snippet</code> and some <i>italic</i> text.</div>,
    'Can you believe this weather?',
    <p>👉 <b>Important:</b> Don't forget to review the docs.</p>,
];

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomMessage(): MessengerMessageProps {
    const includeImages = Math.random() > 0.3; // 70% chance of having images
    const images = includeImages
        ? Array.from(
              { length: Math.floor(Math.random() * 3) + 1 },
              () => getRandomItem(imageUrls)
          )
        : undefined;

    return {
        content: {
            text: getRandomItem(textSamples),
            images,
        },
        sender: {
            ...mockSender,
        },
        sentOn: new Date(Date.now() - Math.random() * 86400000 * 7), // random time within last 7 days
        editedOn: Math.random() > 0.5 ? new Date() : undefined, // 50% chance of being edited
        isOwn: Math.random() > 0.5 ? true : false,
        displaySender: false,
        displayTime: false
    };
}

// ----- Create your variable -----
export const generatedMessage: MessengerMessageProps = generateRandomMessage();

const MessengerMessage: React.FC<MessengerMessageProps> = ({ content, sender, sentOn, editedOn, isOwn, displaySender, displayTime }) => {
    console.log(displaySender, displayTime)
    const displayLabel = displaySender || displayTime;

    return (
        <div className='messenger__history--group-item'>
            { displayLabel && ( 
                <span className='messenger__history--label'>
                    { displaySender && (isOwn ? "You" : sender.name.join(" "))}
                    { displayLabel && 
                        <span className='messenger__history--label-time'>
                            {formatTime(sentOn)}
                        </span>
                    }
                </span> 
            )}
            <div className="messenger__history--group-item__rich">
                {content.text}
            </div>
        </div>
    )
}

export default MessengerMessage;