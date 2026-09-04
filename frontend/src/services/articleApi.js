const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080";

async function parseResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(
            data.error || "Request failed"
        );

        error.details = data.errors || {};

        throw error;
    }

    return data;
}

export async function getArticles(limit = 10, offset = 0) {
    const response = await fetch(
        `${API_URL}/article/${limit}/${offset}`
    );

    return parseResponse(response);
}

export async function getArticle(id) {
    const response = await fetch(
        `${API_URL}/article/${id}`
    );

    return parseResponse(response);
}

export async function createArticle(data) {
    const response = await fetch(
        `${API_URL}/article`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    return parseResponse(response);
}

export async function updateArticle(id, data) {
    const response = await fetch(
        `${API_URL}/article/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    return parseResponse(response);
}

export async function deleteArticle(id) {
    const response = await fetch(
        `${API_URL}/article/${id}`, {
            method: "DELETE",
        }
    );

    return parseResponse(response);
}