import { ModalActionButtonProps } from "@/components/common/Modal";
import Window from "@components/common/Window";
import { createFocusTrap } from "focus-trap";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useTransition, animated } from "react-spring";

interface ModalContextProps {
    setModal: (content: React.ReactNode, label: string, description?: string, action?: ModalActionButtonProps[], config?: ModalConfig) => void;
    closeModal: () => void;
    resetModal: () => void;
    updateModal: (patch: Partial<ModalState>) => void;
    isOpen: boolean;
    config?: ModalConfig;
}

export interface ModalConfig {
    /** If set to `true`, modal window will close upon a click outside of this window */
    closeOnBackdrop?: boolean;
    /** If set to `true`, modal window will close upon pressing "Escape" */
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
    const [currentModal, setCurrentModal] = useState<ModalState | null>(null);
    const [modalStack, setModalStack] = useState<ModalState[]>([]);
    const [leavingModal, setLeavingModal] = useState<ModalState | null>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    const isOpen = currentModal !== null;

    const setModal = useCallback((content: React.ReactNode, label: string, description?: string, action?: ModalActionButtonProps[], config?: ModalConfig) => {
        setCurrentModal(prev => {
            if (prev !== null) {
                setModalStack(stack => [...stack, prev]);
            }
            setLeavingModal(null);
            return {
                content,
                label,
                description,
                action,
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
        setCurrentModal(prev => {
            if (prev === null) return null;
            return { ...prev, ...patch };
        });
    }, []);

    /** Closes the most recent modal window */
    const closeModal = useCallback(() => {
        setModalStack(prev => {
            if (prev.length > 0) {
                const previousModal = prev[prev.length - 1];
                setLeavingModal(null);
                setCurrentModal(previousModal);
                return prev.slice(0, -1);
            } else {
                setLeavingModal(currentModal);
                setCurrentModal(null);
                return prev;
            }
        });
    }, [currentModal]);

    const resetModal = useCallback(() => {
        setModalStack([]);
        setCurrentModal(null);
        setLeavingModal(null);
    }, []);

    /** Sets up event listeners for "Escape" and backdrop click. */
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && currentModal?.config?.closeOnEscape) {
                closeModal();
            }
        };

        const handleClick = (e: MouseEvent) => {
            if (
                backdropRef.current &&
                e.target === backdropRef.current &&
                currentModal?.config?.closeOnBackdrop
            ) {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('click', handleClick);
        };
    }, [isOpen, currentModal, closeModal]);

    /** Focus trap */
    useEffect(() => {
        if (!isOpen || !backdropRef.current) return;
        const trap = createFocusTrap(backdropRef.current);
        trap.activate();

        return () => {
            trap.deactivate();
        };
    }, [isOpen]);

    /** Animate mount and unmount, previously onRest() was used for this. */
    const transitions = useTransition(isOpen, {
        from: { opacity: 0, transform: 'scale(0.8)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0.7)' },
        config: { tension: 400, friction: 30, precision: 0.001 },
        onRest: () => {
            if (!isOpen && leavingModal) {
                setLeavingModal(null);
            }
        }
    });

    const value: ModalContextProps = {
        setModal,
        closeModal,
        updateModal,
        resetModal,
        isOpen,
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
            {transitions((style, item) => {
                if (!item) return null;
                const modal = currentModal ?? leavingModal;
                if (!modal) return null;

                return (
                    <animated.div
                        ref={backdropRef}
                        style={{ opacity: style.opacity }}
                        className="main-layout__layer modal__wrap"
                    >
                        <animated.div
                            className="modal__content"
                            role="dialog"
                            aria-modal={true}
                            style={{ transform: style.transform }}
                        >
                            <Window
                                label={modal.label}
                                description={modal.description}
                                action={modal.action}
                            >
                                {modal.content}
                            </Window>
                        </animated.div>
                    </animated.div>
                );
            })}
        </ModalContext.Provider>
    );
};

export const useModal = (): ModalContextProps => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error("useModal must be used within a PopupProvider");
    }
    return context;
};