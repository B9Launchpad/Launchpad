import { useEffect, useState } from "react";

interface PadOption {
    id: string;
    label: string;
    icon?: React.ReactNode;
    selected?: boolean;
    description?: string;
}

interface PadSelectProps {
    options: PadOption[];
    allowMultiple?: boolean;
    alwaysSelected?: boolean;
    imageMode?: boolean;
    onChange: (selected: string[] | string | null) => void;
}

const PadSelect: React.FC<PadSelectProps> = ({ imageMode = false, options, allowMultiple = false, alwaysSelected = false, onChange}) => {
    const [selected, setSelected] = useState<string[]>(
        options.filter(opt => opt.selected).map(opt => opt.id)
    )

    const toggle = (id: string) => {
        if (allowMultiple) {
            const newSelected = selected.includes(id)
            ? selected.filter((s) => s !== id)
            : [...selected, id]
            setSelected(newSelected);
            onChange(newSelected);
        } else {
            if(!alwaysSelected) {
                const newSelected = selected[0] === id ? [] : [id];
                setSelected(newSelected);
                onChange(newSelected[0] ?? null);
            } else { 
                setSelected([id]);
                onChange(id ?? null);
            }
        }
    }

    useEffect(() => {
        //console.log(selected)
    }, [selected])

    return (
        <div className="pad-select">
            <div className="pad-select__options">
                {options.map((opt) => (
                    <div className={`pad-select__option--wrap ${selected.includes(opt.id) ? "selected" : ""}`}>
                        <div
                            key={opt.id}
                            className={`${imageMode && 'image'} pad-select__option ${selected.includes(opt.id) ? "selected" : ""}`}
                            onClick={() => toggle(opt.id)}
                        >
                            {opt.icon}
                            <div className="pad-select__label">
                                {opt.label}
                                { opt.description && (
                                    <p>{opt.description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PadSelect;