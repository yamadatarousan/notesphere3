export const fetchPages = async (token: string) => {
    const response = await fetch('http://localhost:8000/api/pages', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Failed to fetch pages');
    return response.json();
};

export const createPage = async (data: { title: string; content?: string }, token: string) => {
    const response = await fetch('http://localhost:8000/api/pages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create page');
    return response.json();
};

export const updatePage = async (id: number, data: { title: string; content?: string }, token: string) => {
    const response = await fetch(`http://localhost:8000/api/pages/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update page');
    return response.json();
};

export async function deletePage(id: number, token: string) {
    console.log('Sending deletePage request for id:', id, 'with token:', token);
    const response = await fetch(`http://localhost:8000/api/pages/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
    }
    console.log('deletePage response:', response.status);
    return; // 204 No Content なら何も返さない
}