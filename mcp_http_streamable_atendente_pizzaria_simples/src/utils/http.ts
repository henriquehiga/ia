const apiUrl = `http://localhost:3000`

export const httpPost = async (path: string, payload: object, config?: object) => {
    return fetch(`${apiUrl}${path}`, {
        ...config,
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export const httpGet = async (path: string, config?: object) => {
    const response = await fetch(`${apiUrl}${path}`, {
        ...config,
        method: 'GET'
    });
    const responseJson = await response.json();
    return responseJson;
}