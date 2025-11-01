import { ModalActionButtonProps } from "@/components/common/Modal";
import { ButtonProps } from "@components/common/Button";
import WindowComponent from "@components/common/Window";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";

interface ModalContextProps {
    setModal: (content: React.ReactNode, label: string, description?: string, action?: ModalActionButtonProps[], config?: ModalConfig) => void;
    closeModal: () => void;
    updateModal: (patch: Partial<ModalState>) => void;
    isOpen: boolean;
    config?: ModalConfig;
}

export interface ModalConfig {
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export interface ModalState {
    content: React.ReactNode;
    label: string;
    description?: string
    action?: ModalActionButtonProps[];
    isOpen: boolean;
    config?: ModalConfig;
}

export const PopupProvider = ({ children }: {children: React.ReactNode }) => {
    const [modalState, setModalState] = useState<ModalState>({
        content: null,
        label: "",
        description: "",
        action: [],
        isOpen: false
    });
    const [modalStack, setModalStack] = useState<ModalState[]>([]);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const backdropRef = useRef<HTMLDivElement>(null);
    const [isTransition, setIsTransition] = useState<boolean>(false);

    const setModal = useCallback((content: React.ReactNode, label: string, description?: string, action?: ModalActionButtonProps[], config?: ModalConfig) => {
        setModalState(prevState => {
            if (prevState.content !== null) {
                setModalStack(prevStack => [...prevStack, prevState]);
                setIsTransition(true);
            }

            return {
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
            };
        });
    }, []);

    const updateModal = useCallback((patch: Partial<ModalState>) => {
        setModalState(prev => ({
            ...prev,
            ...patch
        }));
    }, []);

    const closeModal = useCallback(() => {
        setModalStack(prev => {
            if (prev.length > 0) {
                const previousModal = prev[prev.length - 1];
                setIsTransition(true);
                setModalState(previousModal);
                return prev.slice(0, -1);
            } else {
                setIsVisible(false);
                return prev;
            }
        });
    }, []);

    useEffect(() => {
        if(!modalState.isOpen) return;
        setIsVisible(true);

        const handleKeyDown = (e: KeyboardEvent) => {
            if(e.key === "Escape") {
                closeModal();
            }
        }

        const handleClick = (e: MouseEvent) => {
            if(backdropRef.current && e.target === backdropRef.current && modalState.config?.closeOnBackdrop) {
                closeModal();
            }
        }

        document.addEventListener('keyup', handleKeyDown);
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('keyup', handleKeyDown);
            document.removeEventListener('click', handleClick);
        };
    }, [modalState.isOpen])


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
                setModalState(prev => ({
                    ...prev,
                    content: null,
                    isOpen: false
                }));
            }
        }
    })

    const popupStyle = useSpring({
        from: {
            scale: isTransition ? 1 : 0.8,
        },
        to: {
            scale: isVisible ? (isTransition ? 0.8 : 1) : 0.7
        },
        config: {
            friction: 31,
            tension: 400,
            precision: 0.001,
            velocity: 0.001
        },
        immediate: isTransition,
        onRest: () => { if(isTransition) setIsTransition(false)}
    })

    const value: ModalContextProps = {
        setModal,
        closeModal,
        updateModal,
        isOpen: modalState.isOpen
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
            { modalState.isOpen && (
                <animated.div ref={backdropRef} style={fadeInStyle} className="main-layout__layer modal__wrap">
                    <animated.div className="modal__content" role={"dialog"} aria-modal={true} style={popupStyle}>
                        <WindowComponent label={modalState.label} description={modalState?.description} action={modalState.action}>
                            {modalState.content}
                        </WindowComponent>
                    </animated.div>
                </animated.div>
            )}
        </ModalContext.Provider>
    )
}

export const useModal = (): ModalContextProps => {
    const context = useContext(ModalContext);
    if(context === undefined) {
        throw new Error("useModal must be used within a PopupProvider");
    }
    return context;
}