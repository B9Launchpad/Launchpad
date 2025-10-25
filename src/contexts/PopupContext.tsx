import { ButtonProps } from "@/components/common/Button";
import WindowComponent from "@/components/common/Window";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";

interface PopupContextProps {
    setPopup: (content: React.ReactNode, label: string, description?: string, action?: ButtonProps[], config?: PopupConfig) => void;
    closePopup: () => void;
    updatePopup: (patch: Partial<PopupState>) => void;
    isOpen: boolean;
    config?: PopupConfig;
}

interface PopupConfig {
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean
}

const PopupContext = createContext<PopupContextProps | undefined>(undefined);

export interface PopupState {
    content: React.ReactNode;
    label: string;
    description?: string
    action?: ButtonProps[];
    isOpen: boolean;
    config?: PopupConfig;
}

export const PopupProvider = ({ children }: {children: React.ReactNode }) => {
    const [popupState, setPopupState] = useState<PopupState>({
        content: null,
        label: "",
        description: "",
        action: [],
        isOpen: false
    })
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const setPopup = useCallback((content: React.ReactNode, label: string, description?: string, action?: ButtonProps[], config?: PopupConfig) => {
        setPopupState({
            content,
            action,
            label,
            description,
            isOpen: true,
            config: {
                closeOnBackdrop: true,
                closeOnEscape: true,
                ...config
            }
        });
    }, []);

    const updatePopup = useCallback((patch: Partial<PopupState>) => {
        setPopupState(prev => ({
            ...prev,
            ...patch
        }));
    }, []);

    const closePopup = useCallback(() => {
        setIsVisible(false);
    }, []);

    useEffect(() => {
        if(!popupState.isOpen) return;
        if(popupState.isOpen) setIsVisible(true);

        const handleKeyDown = (e: KeyboardEvent) => {
            if(e.key === "Escape") {
                closePopup();
            }
        }

        const handleClick = (e: MouseEvent) => {
            if(contentRef.current && !contentRef.current.contains(e.target as Node) && popupState.config?.closeOnBackdrop) {
                closePopup();
            }
        }

        document.addEventListener('keyup', handleKeyDown);
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('keyup', handleKeyDown);
            document.removeEventListener('click', handleClick);
        };
    }, [popupState.isOpen])


    const fadeInStyle = useSpring({
        from: {
            opacity: 0,
        },
        to: {
            opacity: isVisible ? 1 : 0,
        },
        config: {
            tension: 400,
            precision: 0.01,
            velocity: 0.001
        },
        onRest: () => {
            if(!isVisible) {
                setPopupState(prev => ({
                    ...prev,
                    isOpen: false
                }));
            }
        }
    })

    const popupStyle = useSpring({
        from: {
            scale: 0.7,
        },
        to: {
            scale: isVisible ? 1 : 0.7
        },
        config: {
            friction: 31,
            tension: 400,
            precision: 0.001,
            velocity: 0.001
        },
    })

    const value: PopupContextProps = {
        setPopup,
        closePopup,
        updatePopup,
        isOpen: popupState.isOpen
    };

    return (
        <PopupContext.Provider value={value}>
            {children}
            { popupState.isOpen && (
                <animated.div style={fadeInStyle} className="main-layout__layer modal__wrap">
                    <animated.div ref={contentRef} className="modal__content" style={popupStyle}>
                        <WindowComponent label={popupState.label} description={popupState?.description} action={popupState.action}>
                            {popupState.content}
                        </WindowComponent>
                    </animated.div>
                </animated.div>
            )}
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