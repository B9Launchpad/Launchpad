import Button from "@/components/common/Button";
import Modal, { ModalActionButtonProps } from "@/components/common/Modal";


interface SettingsAccountDataProps {
    label: string;
    value: string | number;
    children?: React.ReactNode;
    action?: ModalActionButtonProps[];
}

const SettingsAccountData: React.FC<SettingsAccountDataProps> = ({label, value, action, children}) => {
    return (
        <div className='flex-row justify-between items-center'>
            <div className='gap-sm flex flex-col'>
                <em className='input__title'>{label}</em>
                <div className='flex-col'>
                    <p>{value}</p>
                    {children}
                </div>
            </div>
            <div className='flex-row gap'>
                {action?.map((act, index) => {
                    if(act.trigger) {
                        return (
                            <Modal.Trigger 
                                key={index}
                                content={act.trigger.content}
                                label={act.trigger.label}
                                description={act.trigger.description}
                                action={act.trigger.action}
                                config={act.trigger.config}
                                triggerOnSuccess={act.trigger.triggerOnSuccess}
                            >
                                <Button
                                    variant={act.variant}
                                    onClick={act.onClick}
                                    label={act.label}
                                    disabled={act.disabled}
                                    tabIndex={act.tabIndex}
                                    className={act.className}
                                    type={act.type}
                                    icon={act.icon}
                                    inline={act.inline}
                                />
                            </Modal.Trigger>
                        )
                    } else {
                        return (
                            <Button key={index}
                                variant={act.variant}
                                onClick={act.onClick}
                                label={act.label}
                                disabled={act.disabled}
                                tabIndex={act.tabIndex}
                                className={act.className}
                                type={act.type}
                                icon={act.icon}
                                inline={act.inline}
                            />
                        )
                    }
                })}
            </div>
        </div>
    )
}

export default SettingsAccountData;