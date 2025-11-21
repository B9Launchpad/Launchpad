import React, { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from "react";
import InputCheckbox, {
    CheckboxOption,
    CheckboxSelected,
    CheckboxState
} from "../Input/Checkbox";
import { useSearch } from "../../../contexts/SearchContext";

export interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    align?: "left" | "right" | "center";
}

export interface TableRef<T> {
    getSelected: () => CheckboxSelected | undefined;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    label?: string;
    description?: string;
    allowSelection?: boolean;
    footer?: React.ReactNode;
    className?: string;
    searchQuery?: string;
}



function TableInner<T>(
    {
        columns,
        data,
        footer,
        className,
        label,
        searchQuery,
        allowSelection = false,
    }: TableProps<T>,
    ref: React.Ref<TableRef<T>>
) {
    const [selected, setSelected] = useState<CheckboxSelected>();
    const [allSelected, setAllSelected] = useState<CheckboxState>("i");
    const { query } = useSearch();
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T;
        direction: "asc" | "desc";
    } | null>(null);

    const checkboxOption: CheckboxOption[] = useMemo(
        () => [{ id: "table-main", checked: allSelected }],
        [allSelected]
    );

    useImperativeHandle(ref, () => ({
        getSelected: () => {
            return selected;
        }
    }), [selected, data]);

    const handleMainToggle = (state: CheckboxSelected) => {
        const isChecked = state["table-main"];
        if (isChecked === true) {
            let newSelected: CheckboxSelected = {};
            data.forEach((_, index) => {
                newSelected[index] = true;
            });
            setSelected(newSelected);
        } else {
            setSelected({});
        }
    };

    const handleChildToggle = (state: CheckboxSelected, id: number) => {
        setSelected((prev) => {
            const newSelected = { ...prev };
            if (state[id] === true) {
                newSelected[id] = true;
            } else {
                delete newSelected[id];
            }
            return newSelected;
        });
    };

    useEffect(() => {
        if (selected) {
            const selectedCount = Object.values(selected).filter(
                (value) => value === true
            ).length;
            if (selectedCount === data.length) {
                setAllSelected(true);
            } else if (selectedCount > 0 && data.length > selectedCount) {
                setAllSelected("i");
            } else {
                setAllSelected(false);
            }
        }
    }, [selected, data.length]);

    const filteredData = useMemo(() => {
        if (!query.trim()) return data;
        return data.filter((row) =>
            columns.some((col) => {
                const value =
                    typeof col.accessor === "function"
                        ? col.accessor(row)
                        : row[col.accessor];
                return String(value).toLowerCase().includes(query.toLowerCase());
            })
        );
    }, [data, query, columns]);

    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;
        const { key, direction } = sortConfig;
        return [...filteredData].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            if (aVal < bVal) return direction === "asc" ? -1 : 1;
            if (aVal > bVal) return direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    const handleSort = (key: keyof T) => {
        setSortConfig((prev) => {
            if (prev?.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    };

    return (
        <table className={`table-compact ${className ?? ""}`}>
            <thead>
                <tr>
                    {allowSelection && (
                        <th className="table-compact__checkbox">
                            <InputCheckbox
                                onToggle={handleMainToggle}
                                options={checkboxOption}
                            />
                        </th>
                    )}
                    {columns.map((col, i) => (
                        <th
                            key={i}
                            style={{ textAlign: col.align ?? "left" }}
                            className={"table-compact__sortable"}
                            onClick={() =>
                                typeof col.accessor === "string" && handleSort(col.accessor)
                            }
                        >
                            {col.header}
                            {sortConfig?.key === col.accessor && (
                                <span>{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
                            )}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedData.map((row, i) => {
                    const ChildOption: CheckboxOption[] = [
                        { id: i, checked: selected?.[i] === true }
                    ];
                    return (
                        <tr key={i} className="table-compact__row">
                            {allowSelection && (
                                <td className="table-compact__checkbox">
                                    <InputCheckbox
                                        onToggle={(state) => handleChildToggle(state, i)}
                                        options={ChildOption}
                                    />
                                </td>
                            )}
                            {columns.map((col, j) => (
                                <td key={j} style={{ textAlign: col.align ?? "left" }}>
                                    {typeof col.accessor === "function"
                                        ? col.accessor(row)
                                        : (row as any)[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
            {footer && (
                <tfoot>
                    <tr>
                        <td
                            colSpan={columns.length + (allowSelection ? 1 : 0)}
                            className=""
                        >
                            {footer}
                        </td>
                    </tr>
                </tfoot>
            )}
        </table>
    );
}

// ForwardRef wrapper with generic inference
export default forwardRef(TableInner) as <T>(
    props: TableProps<T> & React.RefAttributes<TableRef<T>>
) => React.ReactElement | null;
