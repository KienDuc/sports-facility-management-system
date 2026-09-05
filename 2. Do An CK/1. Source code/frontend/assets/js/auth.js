function getToken() {
    return localStorage.getItem('elite_sport_token') || sessionStorage.getItem('elite_sport_token');
}

async function fetchWithAuth(url, options = {}) {
    const token = getToken();

    if (!options.headers) {
        options.headers = {};
    }

    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, options);

    if (response.status === 401) {
        console.warn("Token hết hạn hoặc không hợp lệ, đang đăng xuất...");
        localStorage.removeItem('elite_sport_token');
        sessionStorage.removeItem('elite_sport_token');
        window.location.href = '/admin/login.html';
    }

    return response;
}