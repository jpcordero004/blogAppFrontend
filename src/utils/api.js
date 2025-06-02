const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const apiFetch = async (url, method = 'GET', data = null, token = null) => {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (data) options.body = JSON.stringify(data);
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${url}`, options);
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'API request failed');
    }
    return res.json();
};
