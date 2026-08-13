import { fetchStatus } from "./fetchStatus";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL;

interface FetchOptions {
    url: string;
    method?: "POST" | "GET" | "PUT" | "PATCH" | "OPTIONS" | "HEAD" | "DELETE";
    body?: any;
    credentials?: "include" | "omit" | "same-origin";
}

// TO DO: Report if makeFetchRequest is currently awaiting response;

/**
 * 
 * @param url Url where request should be sent. (in the beginning of the url, `host//` implies NextJS server and omitting `http://` or `https://` will send that request to server configured as API)
 * @param method HTTP request method.
 * @param body data to be sent over to the server.
 * @param credentials Include user credentials, such as cookies, etc.
 * @returns a `Promise` of server response.
 */
const makeFetchRequest = async ({ url, method = 'POST', body, credentials }: FetchOptions) => {
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
            credentials: credentials,
        });

        return {
            response: response as Response,
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