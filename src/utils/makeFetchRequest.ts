const API_URL = process.env.REACT_APP_API_URL;

interface FetchOptions {
    url: string;
    method?: string;
    body?: any;
    includeCredentials?: boolean;
}

const makeFetchRequest = async ({ url, method = 'POST', body, includeCredentials = false }: FetchOptions) => {
    if(!url.includes('://')) {
        url = API_URL + url;
    }

    try {
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
  }
};

export default makeFetchRequest;