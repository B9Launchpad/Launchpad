import { useTranslation } from "react-i18next";
import Button from "../Button";
import { useFetchStatus } from "@utils/fetch/useFetchStatus";
import { useEffect, useRef } from "react";

interface FormComponentProps {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    showSubmitButton?: boolean;
    submitText?: string;
}

const Form: React.FC<FormComponentProps> = ({ children, showSubmitButton = true, onSubmit, submitText }) => {
    const { t } = useTranslation('general');
    const fetchStatus = useFetchStatus();
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(fetchStatus) return;
        
        onSubmit(e);
    }

    useEffect(() => {
        if(!formRef.current) return;
        const inputs = formRef.current.querySelectorAll('input');

        if(inputs.length > 0) {
            inputs[0].focus();
        }
        
    }, [formRef.current])

    return (
        <form ref={formRef} onSubmit={handleSubmit}>
            { children }
            {showSubmitButton && ( <div className="hero__content">
                <Button type="submit">
                    { submitText === undefined ? t('submit') : submitText }
                </Button>
            </div> )}
        </form>
    )
}

export default Form;