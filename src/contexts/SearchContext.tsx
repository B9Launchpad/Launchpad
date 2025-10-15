import { createContext, useContext, useState } from "react";
import { searchQuery } from "../components/common/Input/SearchInput";

const SearchContext = createContext<{
    query: searchQuery;
    setQuery: (q: searchQuery) => void;
}>({query: "", setQuery: () => {}});


export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({children}: {children: React.ReactNode}) => {
    const [query, setQuery] = useState<searchQuery>("");

    return (
        <SearchContext.Provider value={{ query, setQuery }}>
            {children}
        </SearchContext.Provider>
    )
}

export default SearchContext;