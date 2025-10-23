import { ButtonProps } from "@/components/common/Button";
import { createContext, useCallback, useContext, useState } from "react";

interface PopupContextProps {
    setPopup: (content: React.ReactNode, action?: ButtonProps[], config?: PopupConfig) => void;
    closePopup: () => void;
    isOpen: boolean;
}

interface PopupConfig {
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean
}

const PopupContext = createContext<PopupContextProps | undefined>(undefined);

interface PopupState {
    content: React.ReactNode;
    action?: ButtonProps[];
    isOpen: boolean;
}

export const PopupProvider = ({ children }: {children: React.ReactNode }) => {
    const [popupState, setPopupState] = useState<PopupState>({
        content: null,
        action: [],
        isOpen: false
    })

    const setPopup = useCallback((content: React.ReactNode, action: ButtonProps[] = [{label: "Close", variant: "primary"}]) => {
        setPopupState({
            content,
            action,
            isOpen: true
        });
    }, []);

    const closePopup = useCallback(() => {
        setPopupState(prev => ({
            ...prev,
            isOpen: false
        }));
    }, []);

    const value: PopupContextProps = {
        setPopup,
        closePopup,
        isOpen: popupState.isOpen
    };

    return (
        <PopupContext.Provider value={value}>
            {children}
        </PopupContext.Provider>
    )
}

export const usePopup = (): PopupContextProps => {
    const context = useContext(PopupContext);
    if(context === undefined) {
        throw new Error("usePopup must be used within a PopupProvider");
    }
    return context;
}