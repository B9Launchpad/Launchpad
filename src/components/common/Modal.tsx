import React, { useEffect } from "react";
import { ModalConfig, ModalState, useModal } from "@/contexts/ModalContext";
import { ButtonProps } from "./Button";


type ModalProps = Omit<ModalState,
    "content" | "isOpen"> & {
        children: React.ReactNode;
    };

const Modal: React.FC<ModalProps> & {
    Trigger: React.FC<ModalTriggerProps>;
    Action: React.FC<ModalActionsProps>
} = ({ children, label = "", description = "", action = [], config }) => {
        const { setModal, closeModal } = useModal();

        useEffect(() => {
            if (action.length === 0)
                action = [{
                    label: "Close",
                    variant: "primary",
                    onClick: closeModal
                }];

            setModal(children, label, description, action, config);
            return () => {
                closeModal();
            };
        }, []);
        return null;
    };

// ---------- Modal.Trigger ----------
interface ModalTriggerProps {
    label?: string;
    description?: string;
    content: React.ReactNode;
    children: React.ReactElement<{
        onClick?: React.MouseEventHandler
    }>;
    action?: ButtonProps[];
    config?: ModalConfig;
    triggerOnSuccess?: boolean;
}
const ModalTrigger: React.FC<ModalTriggerProps> = ({
    content,
    children,
    label = "",
    description = "",
    /** Properties of action button(s) to be appended into modal window. */
    action = [],
    /** Configuration of modal window */
    config,
    /** sets whether trigger should only work on successful operation within modal (e.g. form).
     * @default false
     */
    triggerOnSuccess = false,
}) => {
    const { setModal, closeModal } = useModal();
    // clone child and add onClick handler

    if (action.length === 0)
        action = [{
            label: "Close",
            variant: "primary",
            onClick: closeModal
        }];

    const triggerElement = React.cloneElement(children, {
        onClick: (e: React.MouseEvent) => {
            switch(triggerOnSuccess) {
                case false:
                    children.props.onClick?.(e);
                    setModal(content, label, description, action, config);
                    break;
                case true:
                    const result = children.props.onClick?.(e);
                    if(!result) return;
                    setModal(content, label, description, action, config);
                    break;
            }
        }
    });
    return triggerElement;
};

export interface ModalActionButtonProps extends ButtonProps {
    /** callback to run when button is clicked */
    onClick?: () => void | boolean | Promise<void> | Promise<boolean>;
    /** sets up trigger to open another modal on button click */
    trigger?: Omit<ModalTriggerProps, "children">;
    /** sets whether trigger should only work on successful operation within modal (e.g. form).  */
    triggerOnSuccess?: boolean;
}

interface ModalActionsProps {
    action: ModalActionButtonProps[];
}

/** Properties of action button(s) to be appended into modal window.
 * 
 * @param onClick callback to run when button is clicked
 * @param trigger sets up trigger to open another modal on button click
 * @param triggerOnSuccess sets whether trigger should only work on successful operation within modal (e.g. form). 
 * @returns modal action buttons
 */
const ModalAction: React.FC<ModalActionsProps> = ({ action }) => {
    const { updateModal } = useModal();

    useEffect(() => {
        if (!action) return;
        updateModal({ action });
    }, []);

    return null;
}

Modal.Action = ModalAction;
Modal.Trigger = ModalTrigger;
export default Modal;