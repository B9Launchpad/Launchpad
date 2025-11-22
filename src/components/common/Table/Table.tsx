import React, { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from "react";
import InputCheckbox, {
    CheckboxOption,
    CheckboxSelected,
    CheckboxState
} from "@components/common/Input/Checkbox";
import { useSearch } from "@contexts/SearchContext";

export interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    align?: "left" | "right" | "center";

    /**
     * Optional function to get a primitive value for sorting and searching.
     * Required if 'accessor' returns a ReactNode and you want
     * 'isSearchable' or 'isSortable' to be true.
     */
    getSortSearchValue?: (row: T) => string | number | Date;

    /** Flag to enable searching on this column. Defaults to false. */
    isSearchable?: boolean;

    /** Flag to enable sorting on this column. Defaults to false. */
    isSortable?: boolean;
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
    searchQuery?: string; // This prop seems redundant... remove?
}

function TableInner<T>(
    {
        columns,
        data,
        footer,
        className,
        label,
        searchQuery, // redunant? see above
        allowSelection = false,
    }: TableProps<T>,
    ref: React.Ref<TableRef<T>>
) {
    const [selected, setSelected] = useState<CheckboxSelected>();
    const [allSelected, setAllSelected] = useState<CheckboxState>("i");
    const { query } = useSearch();
    const [sortConfig, setSortConfig] = useState<{
        columnIndex: number;
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
            if (selectedCount === data.length && data.length > 0) {
                setAllSelected(true);
            } else if (selectedCount > 0 && data.length > selectedCount) {
                setAllSelected("i");
            } else {
                setAllSelected(false);
            }
        }
    }, [selected, data.length]);

    const filteredData = useMemo(() => {
        // fallback to searchquery
        const effectiveQuery = (query || searchQuery || "").trim();
        if (!effectiveQuery) return data;

        const lowerCaseQuery = effectiveQuery.toLowerCase();

        return data.filter((row) =>
            columns.some((col) => {
                // flag check
                if (!col.isSearchable) return false;

                let rawValue: any;
                if (col.getSortSearchValue) {
                    rawValue = col.getSortSearchValue(row);
                } else if (typeof col.accessor !== 'function') {
                    rawValue = row[col.accessor];
                } else {
                    console.warn(`Column "${col.header}" is searchable but has no 'getSortSearchValue' helper.`);
                    rawValue = null;
                }

                let stringValue = "";
                if (rawValue === null || rawValue === undefined) {
                    stringValue = "";
                } else if (typeof rawValue === 'string' || typeof rawValue === 'number' || typeof rawValue === 'boolean') {
                    stringValue = String(rawValue);
                }

                return stringValue.toLowerCase().includes(lowerCaseQuery);
            })
        );
    }, [data, query, searchQuery, columns]);

    // sortedData helper
    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;

        const { columnIndex, direction } = sortConfig;
        const column = columns[columnIndex];

        // Get string value for sort
        const getSortValue = (row: T): string | number | Date | null => {
            if (!column.isSortable) return null;

            if (column.getSortSearchValue) {
                return column.getSortSearchValue(row);
            }

            if (typeof column.accessor !== 'function') {
                const val = row[column.accessor];
                if (typeof val === 'string' || typeof val === 'number' || val instanceof Date) {
                    return val;
                }
            }

            // Unsortable
            if (typeof column.accessor === 'function') {
                console.warn(`Column "${column.header}" is sortable but has no 'getSortSearchValue' helper.`);
            }
            return null;
        };

        return [...filteredData].sort((a, b) => {
            const aVal = getSortValue(a);
            const bVal = getSortValue(b);

            // Put nulls/unsortables at the bottom
            if (aVal == null) return 1;
            if (bVal == null) return -1;

            if (aVal < bVal) return direction === "asc" ? -1 : 1;
            if (aVal > bVal) return direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig, columns]);

    const handleSort = (columnIndex: number) => {
        const column = columns[columnIndex];

        // check flag
        if (!column.isSortable) return;

        setSortConfig((prev) => {
            if (prev?.columnIndex === columnIndex) {
                return { columnIndex, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { columnIndex, direction: "asc" };
        });
    };

    return (
        <div className="table__wrap">
            <table className={`table ${className ?? ""}`}>
                <thead>
                    <tr>
                        {allowSelection && (
                            <th className="table__checkbox">
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
                                className={col.isSortable ? "table-compact__sortable" : ""}
                                onClick={() => handleSort(i)}
                            >
                                {col.header}
                                {col.isSortable && sortConfig?.columnIndex === i && (
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
                            <tr key={i} className="table__row">
                                {allowSelection && (
                                    <td className="table__checkbox">
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
        </div>
    );
}

export default forwardRef(TableInner) as <T>(
    props: TableProps<T> & React.RefAttributes<TableRef<T>>
) => React.ReactElement | null;