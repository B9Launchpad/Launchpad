import { useTranslation } from "react-i18next";
import Button from "../Button";
import { useFetchStatus } from "../../../utils/fetch/useFetchStatus";

interface FormComponentProps {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    submitText?: string;
}

const FormComponent: React.FC<FormComponentProps> = ({ children, onSubmit, submitText }) => {
    const { t } = useTranslation('general');
    const fetchStatus = useFetchStatus();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if(fetchStatus) return;
        
        onSubmit(e);
    }

    return (
        <form onSubmit={handleSubmit}>
            { children }
            <div className="hero__content">
                <Button type="submit">
                    { submitText === undefined ? t('submit') : submitText }
                </Button>
            </div>
        </form>
    )
}

export default FormComponent;