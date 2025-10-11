import { fetchStatus } from "./fetchStatus";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL;

interface FetchOptions {
    url: string;
    method?: "POST" | "GET" | "PUT" | "PATCH" | "OPTIONS" | "HEAD" | "DELETE";
    body?: any;
    includeCredentials?: boolean;
}

// TO DO: Report if makeFetchRequest is currently awaiting response;

const makeFetchRequest = async ({ url, method = 'POST', body, includeCredentials = false }: FetchOptions) => {
    if (url.startsWith("host//", 0)) {
        url = HOST_URL + url.replace("host//", "/");   
    }
    else if(!url.includes('://')) {
        url = API_URL + url;
    }

    try {
        fetchStatus.set(true);

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
            mode: 'cors',
            credentials: includeCredentials === true ? 'include' : 'omit'
        });

        return {
            response: response,
            status: response.status,
            success: true
        };
    } catch (error: any) {
        console.log(error);
        throw error;
    } finally {
        fetchStatus.set(false);
    }
};

export default makeFetchRequest;