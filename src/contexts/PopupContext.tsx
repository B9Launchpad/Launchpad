import { ButtonProps } from "@/components/common/Button";
import WindowComponent from "@/components/common/Window";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";

interface PopupContextProps {
    setPopup: (content: React.ReactNode, action?: ButtonProps[], config?: PopupConfig) => void;
    closePopup: () => void;
    isOpen: boolean;
    config?: PopupConfig;
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
    config?: PopupConfig;
}

export const PopupProvider = ({ children }: {children: React.ReactNode }) => {
    const [popupState, setPopupState] = useState<PopupState>({
        content: null,
        action: [],
        isOpen: false
    })
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const setPopup = useCallback((content: React.ReactNode, action: ButtonProps[] = [{label: "Close", variant: "primary", onClick: closePopup}], config?: PopupConfig) => {
        setPopupState({
            content,
            action,
            isOpen: true,
            config: {
                closeOnBackdrop: true,
                closeOnEscape: true,
                ...config
            }
        });
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
        isOpen: popupState.isOpen,
        config: popupState.config
    };

    return (
        <PopupContext.Provider value={value}>
            {children}
            { popupState.isOpen && (
                <animated.div style={fadeInStyle} className="main-layout__layer modal__wrap">
                    <animated.div ref={contentRef} className="modal__content" style={popupStyle}>
                        <WindowComponent action={popupState.action}>
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