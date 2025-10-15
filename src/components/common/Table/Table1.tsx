import { useEffect, useMemo, useState } from "react";
import InputCheckbox, { CheckboxOption, CheckboxSelected, CheckboxState } from "../Input/Checkbox";
import { useSearch } from "../../../contexts/SearchContext";

export interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode)
    align?: 'left' | 'right' | 'center';
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
    allowSorting?: boolean;
}

export default function SmallTable<T>({ columns, data, footer, className, label, searchQuery, allowSelection = false, allowSorting = false }: TableProps<T>) {
    const [selected, setSelected] = useState<CheckboxSelected>();
    const [allSelected, setAllSelected] = useState<CheckboxState>('i');
    const { query } = useSearch();
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);


    const checkboxOption: CheckboxOption[] = useMemo(() => [
        { id: "table-main", checked: allSelected }
    ], [allSelected]);

    const handleMainToggle = (state: CheckboxSelected) => {
      const isChecked = state["table-main"];
    
      if (isChecked === true) {
        // Select all rows
        let newSelected: CheckboxSelected = {};
        data.forEach((_, index) => {
          newSelected[index] = true;
        });
        setSelected(newSelected);
      } else {
        // Deselect all
        setSelected({});
      }
    };

    const handleChildToggle = (state: CheckboxSelected, id: number) => {
        setSelected(prev => {
            const newSelected = { ...prev };
            if (state[id] === true) {
              newSelected[id] = true; // Add when selected
            } else {
              delete newSelected[id]; // Remove when deselected
            }
            return newSelected;
        });
    };

    useEffect(() => {
        if(selected) {
            const selectedCount = Object.values(selected).filter(value => value === true).length;
            if(selectedCount == data.length) {
                setAllSelected(true);
            } else if (selectedCount > 0 && data.length > selectedCount) {
                setAllSelected('i');
            } else {
                setAllSelected(false)
            }
        } 
    }, [selected])

    // Filtered data for search-compatibility
    const filteredData = useMemo(() => {
      if (!query.trim()) return data;
      return data.filter(row =>
        columns.some(col => {
          const value = typeof col.accessor === 'function'
            ? col.accessor(row)
            : row[col.accessor];
          return String(value).toLowerCase().includes(query.toLowerCase());
        })
      );
    }, [data, query]);


    // Sorted data for sorting-compatibility
    const sortedData = useMemo(() => {
      if (!allowSorting || !sortConfig) return filteredData;
      const { key, direction } = sortConfig;
      return [...filteredData].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }, [filteredData, sortConfig, allowSorting]);

    const handleSort = (key: keyof T) => {
      if (!allowSorting) return;
      setSortConfig(prev => {
        if (prev?.key === key) {
          return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
        }
        return { key, direction: 'asc' };
      });
    };

    return (
      <>
        <table className={`table-compact ${className ?? ''}`}>
          <thead>
            <tr>
                {allowSelection && (
                  <th className="table-compact__checkbox">
                    <InputCheckbox onToggle={handleMainToggle} options={checkboxOption}></InputCheckbox>
                  </th>
                )}
              {columns.map((col, i) => (
                <th
                  key={i}
                  style={{ textAlign: col.align ?? 'left' }}
                  className={allowSorting ? 'table-compact__sortable' : ''}
                  onClick={() => typeof col.accessor === 'string' && handleSort(col.accessor)}
                >
                  {col.header}
                  {allowSorting && sortConfig?.key === col.accessor && (
                    <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, i) => {
                const ChildOption: CheckboxOption[] = [
                    {id: i, checked: (selected && selected[i] === true) ? true : false}
                ]
                return (
                <tr key={i} className="table-compact__row">
                  {allowSelection && (
                    <td className="table-compact__checkbox">
                        <InputCheckbox onToggle={(selected) => handleChildToggle(selected, i)} options={ChildOption}></InputCheckbox>
                    </td>
                  )}
                  {columns.map((col, j) => (
                    <td key={j} style={{ textAlign: col.align ?? 'left' }} className="">
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : (row as any)[col.accessor]}
                    </td>
                  ))}
                </tr>
            )})}
          </tbody>
          {footer && (
            <tfoot>
              <tr>
                <td colSpan={columns.length + (allowSelection ? 1 : 0)} className="">{footer}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </>
    )
}
