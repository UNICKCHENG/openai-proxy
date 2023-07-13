
export const fetchTemplate = async(url: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetch(url, init)
    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        throw new Error(data);
    }
}