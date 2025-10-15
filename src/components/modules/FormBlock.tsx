
interface FormBlockProps {
    children: React.ReactNode;
    direction?: 'col' | 'row'
}

const WindowBlock: React.FC<FormBlockProps> = ({ direction = "col", children }) => {
    return (
        <div className={`${direction === 'col' ? 'flex-col' : 'flex-row'} section__block`}>
            {children}
        </div>
    )
}

export default WindowBlock;