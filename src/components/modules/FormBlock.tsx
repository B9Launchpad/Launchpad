
interface FormBlockProps extends React.HTMLAttributes<HTMLDivElement> {
    label?: string;
    description?: string;
    children: React.ReactNode;
    direction?: 'col' | 'row';
}

const WindowBlock: React.FC<FormBlockProps> = ({ label, description, direction = "col", children, className = "", ...props }) => {

    return (
        <div {...props} className={`${className} ${direction === 'col' ? 'flex-col' : 'flex-row'} section__block`}>
            {label && (
                <div>
                    <h4>{label}</h4>
                    {description && (<small>{description}</small>)}
                </div>
            )}
            {children}
        </div>
    )
}

export default WindowBlock;