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
    action = [],
    config,
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
    onClick?: () => void | boolean | Promise<void> | Promise<boolean>;
    trigger?: Omit<ModalTriggerProps, "children">;
    triggerOnSuccess?: boolean;
}

interface ModalActionsProps {
    action: ModalActionButtonProps[];
}

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