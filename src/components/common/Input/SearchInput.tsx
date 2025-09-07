import { JSX, useEffect, useRef, useState } from "react";
import SearchIcon from "../../icons/Search";
import useLastInteractionKeyboard from "../../../functions/useLastInteractionKeyboard";
import { useSearch } from "../../../functions/SearchContext";

interface SearchInputProps {
    label?: string;
    placeholder?: string;
    //onSearch: (value: string) => void; // Function to be executed on search. removed for SearchContext
    debounce?: boolean; // optional debounce
}

export type searchQuery = string;

const InputSearch = ({
    label,
    placeholder = 'Search',
    //onSearch, removed for SearchContext
    debounce = true
}: SearchInputProps): JSX.Element => {
    const { setQuery } = useSearch()
    const inputRef = useRef<HTMLInputElement>(null)
    const inputContentRef = useRef<HTMLDivElement>(null);
    const [value, setValue] = useState('');
    const lastInteractionWasKeyboard = useLastInteractionKeyboard();
    const debounceDelay = debounce === true ? 300 : 0 

    //debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            //onSearch(value.trim()); removed for SearchContext
            setQuery(value.trim());
        }, debounceDelay);

        return () => {
            clearTimeout(handler);
        }
    }, [value, /*onSearch removed for SearchContext*/, debounceDelay])

    const handleClick = () => {
        if(inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleFocus = () => {
        if(lastInteractionWasKeyboard) {
            inputContentRef.current?.classList.add("focused");
        }
    }

    const handleBlur = () => {
        inputContentRef.current?.classList.remove("focused");
    }

    return (
        <div className="input__small--wrap">
            { label && ( <label onClick={handleClick} className="input__label">{label}</label> )}
            <div ref={inputContentRef} onClick={handleClick} className="input__search--content">
                <SearchIcon/>
                <input autoComplete={"off"} autoCapitalize="off" autoCorrect={"off"} onFocus={handleFocus} onBlur={handleBlur} name="searchbox" aria-label="searchbox" className="input__search" ref={inputRef} placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)}></input>
            </div>
        </div>
    )
}

export default InputSearch;