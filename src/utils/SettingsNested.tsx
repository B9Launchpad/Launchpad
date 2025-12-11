import React from 'react';
import { useSettingsRouter } from '@/contexts/SettingsRouterContext';
import IconBack from '@icons/Input/Back';

interface SettingsTriggerProps {
    targetId: string;
    sectionId?: string;
    data?: any;
    children: React.ReactElement<{
            onClick?: React.MouseEventHandler;
            className?: string;
        }>;
    className?: string;
}

const SettingsNested: React.FC & {
    Trigger: React.FC<SettingsTriggerProps>;
    Back: React.FC<SettingsBackProps>
} = () => {
    return null;
}

const SettingsTrigger: React.FC<SettingsTriggerProps> = ({ targetId, sectionId, data, children, className }) => {
    const { push } = useSettingsRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // call child onClick()
        if (children.props.onClick) {
            children.props.onClick(e);
        }
        push(targetId, sectionId || null, data);
    };

    return React.cloneElement(children, { 
        onClick: handleClick,
        className: `${children.props.className || ''} ${className || ''}`.trim()
    });
};

interface SettingsBackProps {
    children?: React.ReactNode;
    className?: string;
}

const SettingsBack: React.FC<SettingsBackProps> = ({ children, className }) => {
    const { pop } = useSettingsRouter();

    return (
        <div 
            onClick={pop} 
            className={className || "settings__back-btn"} 
            role="button" 
            tabIndex={0}
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
            {children || (
                <>
                    <IconBack className="icon"/>
                    <span>Back</span>
                </>
            )}
        </div>
    );
};

SettingsNested.Trigger = SettingsTrigger;
SettingsNested.Back = SettingsBack;

export default SettingsNested;

export const useSettingsParams = <T,>() => {
    const { getParams } = useSettingsRouter();
    return getParams<T>();
};