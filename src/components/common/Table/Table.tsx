import React, { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from "react";
import InputCheckbox, {
    CheckboxOption,
    CheckboxSelected,
    CheckboxState
} from "@components/common/Input/Checkbox";
import { useSearch } from "@contexts/SearchContext";

// UPDATED INTERFACE
export interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    align?: "left" | "right" | "center";
    getSearchValues?: (row: T) => string | string[];
    getSortValue?: (row: T) => string | number | Date;
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
    onRowClick?: (row: T) => void;
}

function TableInner<T>(
    {
        columns,
        data,
        footer,
        className,
        label,
        allowSelection = false,
        onRowClick
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
        const effectiveQuery = (query || "").trim();
        if (!effectiveQuery) return data;

        const lowerCaseQuery = effectiveQuery.toLowerCase();

        return data.filter((row) =>
            columns.some((col) => {
                if (!col.isSearchable) return false;

                let rawValue: any;

                if (col.getSearchValues) {
                    rawValue = col.getSearchValues(row);
                } else if (typeof col.accessor !== 'function') {
                    rawValue = row[col.accessor];
                } else {
                    console.warn(`Column "${col.header}" is searchable but has no search helper.`);
                    rawValue = null;
                }

                let searchValues: string[] = [];

                if (Array.isArray(rawValue)) {
                    searchValues = rawValue.map(v => String(v).toLowerCase());
                } else if (rawValue !== null && rawValue !== undefined) {
                    searchValues = [String(rawValue).toLowerCase()];
                }

                return searchValues.some(val => val.startsWith(lowerCaseQuery));
            })
        );
    }, [data, query, columns]);

    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;

        const { columnIndex, direction } = sortConfig;
        const column = columns[columnIndex];

        // sort value retrieval
        const getSortValueForComparison = (row: T): string | number | Date | null => {
            if (!column.isSortable) return null;

            if (column.getSortValue) {
                return column.getSortValue(row);
            }

            // fallback
            if (typeof column.accessor !== 'function') {
                const val = row[column.accessor];
                if (typeof val === 'string' || typeof val === 'number' || val instanceof Date) {
                    return val;
                }
            }

            // Unsortable
            if (typeof column.accessor === 'function') {
                console.warn(`Column "${column.header}" is sortable but has no 'getSortValue' helper.`);
            }
            return null;
        };

        return [...filteredData].sort((a, b) => {
            const aVal = getSortValueForComparison(a);
            const bVal = getSortValueForComparison(b);

            // Stash unsortables at the bottom
            if (aVal == null) return 1;
            if (bVal == null) return -1;

            if (aVal < bVal) return direction === "asc" ? -1 : 1;
            if (aVal > bVal) return direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig, columns]);

    const handleSort = (columnIndex: number) => {
        const column = columns[columnIndex];

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
                            <tr key={i} onClick={() => {if(onRowClick) onRowClick(row)}} className={`table__row ${onRowClick ? "clickable" : ""}`}>
                                {allowSelection && (
                                    <td onClick={(e) => e.stopPropagation()} className="table__checkbox">
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