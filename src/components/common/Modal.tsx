import React, { useEffect } from "react";
import { PopupState, usePopup } from "@/contexts/PopupContext";
import { ButtonProps } from "./Button";


type ModalProps = Omit<PopupState,
    "content" | "isOpen"> & {
        children: React.ReactNode;
    };

const Modal: React.FC<ModalProps> & {
    Trigger: React.FC<ModalTriggerProps>;
    Action: React.FC<ModalActionsProps>
} = ({ children, label = "", description = "", action = [], config }) => {
        const { setPopup, closePopup } = usePopup();

        useEffect(() => {
            if (action.length === 0)
                action = [{
                    label: "Close",
                    variant: "primary",
                    onClick: closePopup
                }];

            setPopup(children, label, description, action, config);
            return () => {
                closePopup();
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
    config?: any;
}
const ModalTrigger: React.FC<ModalTriggerProps> = ({
    content,
    children,
    label = "",
    description = "",
    action = [],
    config
}) => {
    const { setPopup, closePopup } = usePopup();
    // Клонируем child элемент и добавляем ему onClick handler

    if (action.length === 0)
        action = [{
            label: "Close",
            variant: "primary",
            onClick: closePopup
        }];

    const triggerElement = React.cloneElement(children, {
        onClick: (e: React.MouseEvent) => { // Вызываем оригинальный onClick если он есть
            children.props.onClick?.(e);
            // Открываем модалку с переданным контентом
            setPopup(content, label, description, action, config);
        }
    });
    return triggerElement;
};

interface ModalActionsProps {
    action: ButtonProps[];
}

const ModalAction: React.FC<ModalActionsProps> = ({ action }) => {
    const { updatePopup } = usePopup();

    useEffect(() => {
        if (!action) return;
        updatePopup({ action });
    }, []);

    return null;
}

Modal.Action = ModalAction;
Modal.Trigger = ModalTrigger;
export default Modal;