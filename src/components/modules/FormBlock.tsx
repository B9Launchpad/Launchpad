
interface FormBlockProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    direction?: 'col' | 'row';
}

const WindowBlock: React.FC<FormBlockProps> = ({ direction = "col", children, className = "", ...props }) => {

    console.log(props)
    return (
        <div {...props} className={`${className} ${direction === 'col' ? 'flex-col' : 'flex-row'} section__block`}>
            {children}
        </div>
    )
}

export default WindowBlock;