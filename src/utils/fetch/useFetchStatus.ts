import { useEffect, useState } from "react";
import { fetchStatus } from "./fetchStatus";

export const useFetchStatus = () => {
    const [loading, setLoading] = useState(fetchStatus.get());

    useEffect(() => {
        return fetchStatus.subscribe(setLoading);
    }, [])

    return loading;
};