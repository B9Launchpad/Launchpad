import Button from "./Button";
import type { ModalActionButtonProps } from "./Modal";
import Modal from "./Modal";

interface WindowProps extends React.ComponentPropsWithoutRef<'div'> {
    label?: string;
    description?: string;
    children: React.ReactNode;
    action?: ModalActionButtonProps[],
}

const Window: React.FC<WindowProps> = ({ label, description, children, action, ...props}) => {
    const { className, ...rest} = props;

    return (
        <div className={"content-window " + (className || "")} {...rest}>
            {label && ( <div>
                {label && (<h2 className="content-window__label">{label}</h2>)}
                {description && (<small className="content-window__description">{description}</small>)}
            </div> )}
            {children}
            {action && ( 
                <div className="content__window--action">
                    {action.map((item, index) => {
                    if(item.trigger) {
                        return (
                            <Modal.Trigger key={index} {...item.trigger} triggerOnSuccess={item.triggerOnSuccess}>
                                <Button {...item}/>
                            </Modal.Trigger>
                        )
                    } else {
                        return (
                            <Button key={index} {...item} />
                        )
                    }
                    })}
                </div>
            )}
        </div>
    )
}

export default Window;