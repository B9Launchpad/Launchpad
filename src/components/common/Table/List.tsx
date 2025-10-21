import Button, { ButtonProps } from "../Button";

export interface ListProps {
    items: ListItem[];
}

type ListItem = {
    content: React.ReactNode | string;
    action?: ButtonProps[];
}

const List: React.FC<ListProps> = ({ items }) => {

    return (
        <table className="table-list">
            <tbody className="table-list__content">
                {items.map((item, index) => (
                    <tr key={index} className="table-list__row">
                        <td className="">
                            {item.content}
                        </td>
                        {item.action && (
                            <td className="flex-row gap justify-end items-center">
                                {item.action.map((button, index) => (
                                    <Button key={index} {...button} inline/>
                                ))}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default List;