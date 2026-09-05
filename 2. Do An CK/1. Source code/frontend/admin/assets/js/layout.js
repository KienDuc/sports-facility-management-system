class AdminSidebar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <aside id="sidebar" class="w-64 bg-gray-900 text-white flex flex-col shadow-lg sidebar-transition flex-shrink-0 relative z-20 h-screen">
            <a href="/"> 
                <div class="h-16 flex items-center px-4 border-b border-gray-700 overflow-hidden" title="Elite Sport Admin">
                    <div class="w-8 flex justify-center flex-shrink-0">
                        <i class="fa-solid fa-futbol text-emerald-600 text-2xl"></i>
                    </div>
                    <h1 class="text-xl font-bold uppercase tracking-wider text-emerald-600 ml-3 menu-text whitespace-nowrap transition-opacity duration-200">Elite Sport</h1>
                </div>
            </a>
            <nav class="flex-1 py-4 overflow-y-auto overflow-x-hidden">
                <!-- MENU 1 -->
                <div class="px-2 mb-1">
                    <a href="/admin/schedule.html" class="menu-link w-full flex items-center px-2 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors text-left overflow-hidden">
                        <div class="w-8 flex justify-center flex-shrink-0"><i class="fa-solid fa-calendar-days text-xl"></i></div>
                        <span class="text-sm font-medium tracking-wider ml-3 menu-text whitespace-nowrap">Lịch Đặt & Khung Giờ</span>
                    </a>
                </div>

                <!-- MENU 2 -->
                <div class="px-2 mb-1">
                    <a href="/admin/bookings.html" class="menu-link w-full flex items-center px-2 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors text-left overflow-hidden">
                        <div class="w-8 flex justify-center flex-shrink-0"><i class="fa-solid fa-clipboard-list text-xl"></i></div>
                        <span class="text-sm font-medium tracking-wider ml-3 menu-text whitespace-nowrap">Quản lý Đơn Đặt</span>
                    </a>
                </div>

                <!-- MENU 3 -->
                <div class="px-2 mb-1">
                    <button onclick="toggleSubMenu('submenu-courts')" class="w-full flex items-center px-2 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors text-left overflow-hidden">
                        <div class="w-8 flex justify-center flex-shrink-0"><i class="fa-solid fa-layer-group text-xl"></i></div>
                        <div class="flex-1 flex items-center justify-between ml-3 overflow-hidden menu-text">
                            <span class="text-sm font-medium tracking-wider menu-text whitespace-nowrap">Quản lý Sân & Dịch vụ</span>
                            <i class="fa-solid fa-chevron-down text-xs transition-transform duration-300 flex-shrink-0" id="icon-submenu-courts"></i>
                        </div>
                    </button>
                    <div id="submenu-courts" class="submenu-container hidden flex-col pl-10 pr-2 mt-1 space-y-1">
                        <a href="/admin/courts.html" class="menu-link w-full flex items-center px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors text-left overflow-hidden">
                            <div class="w-6 flex justify-center flex-shrink-0"><i class="fa-solid fa-vector-square text-sm"></i></div>
                            <span class="text-sm font-medium tracking-wider ml-3 menu-text whitespace-nowrap">Quản lý sân</span>
                        </a>
                        <a href="/admin/services.html" class="menu-link w-full flex items-center px-2 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors text-left overflow-hidden">
                            <div class="w-6 flex justify-center flex-shrink-0"><i class="fa-solid fa-concierge-bell text-sm"></i></div>
                            <span class="text-sm font-medium tracking-wider ml-3 menu-text whitespace-nowrap">Quản lý dịch vụ</span>
                        </a>
                    </div>
                </div>

                <!-- MENU 4 -->
                <div class="px-2 mb-1">
                    <a href="/admin/statistics.html" class="menu-link w-full flex items-center px-2 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors text-left overflow-hidden">
                        <div class="w-8 flex justify-center flex-shrink-0"><i class="fa-solid fa-chart-line text-xl"></i></div>
                        <span class="text-sm font-medium tracking-wider ml-3 menu-text whitespace-nowrap">Thống kê nhanh</span>
                    </a>
                </div>
            </nav>

            <div class="p-4 border-t border-gray-700 flex items-center overflow-hidden">
                <div class="w-8 flex justify-center flex-shrink-0">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="Avatar" class="w-8 h-8 rounded-full">
                </div>
                <div class="ml-3 menu-text whitespace-nowrap">
                    <p id="sidebar-admin-name" class="text-sm font-semibold">Đang tải...</p>
                    <p id="sidebar-admin-role" class="text-xs text-gray-400">Administrator</p>
                </div>
            </div>
        </aside>
        `;

        // Tự động Active menu khớp với URL trên trình duyệt
        const currentPath = window.location.pathname;
        this.querySelectorAll('.menu-link').forEach(link => {
            if (currentPath.endsWith(link.getAttribute('href'))) {
                link.classList.remove('text-gray-400');
                link.classList.add('bg-gray-800', 'text-white');

                const parentSub = link.closest('.submenu-container');
                if (parentSub) {
                    parentSub.classList.remove('hidden');
                    parentSub.classList.add('flex');
                    const icon = document.getElementById('icon-submenu-courts');
                    if (icon) icon.classList.add('rotate-180');
                }
            }
        });
    }
}

class AdminHeader extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || 'Quản lý';
        this.innerHTML = `
        <header class="h-16 bg-white shadow-sm flex items-center justify-between px-4 z-10 flex-shrink-0">
            <div class="flex items-center">
                <button onclick="toggleSidebar()" class="text-gray-500 hover:text-gray-700 focus:outline-none mr-4 p-2 rounded-md hover:bg-gray-100">
                    <i class="fa-solid fa-bars text-xl"></i>
                </button>
                <div class="text-gray-500 text-sm font-medium truncate" id="page-title">
                    Quản lý / ${title}
                </div>
            </div>

            <div class="flex items-center space-x-4">
                <button class="text-gray-500 hover:text-gray-700 relative">
                    <i class="fa-regular fa-bell text-xl"></i>
                    <span class="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </button>
                <button onclick="logout()" class="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition whitespace-nowrap">
                    Đăng xuất
                </button>
            </div>
        </header>
        `;
    }
}

customElements.define('admin-sidebar', AdminSidebar);
customElements.define('admin-header', AdminHeader);

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuTexts = document.querySelectorAll('.menu-text');
    const submenus = document.querySelectorAll('.submenu-container');

    if (sidebar.classList.contains('w-64')) {
        submenus.forEach(sub => { sub.classList.add('hidden'); sub.classList.remove('flex'); });
        document.querySelectorAll('[id^="icon-submenu"]').forEach(icon => icon.classList.remove('rotate-180'));
        menuTexts.forEach(el => el.style.opacity = '0');
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-16');
        setTimeout(() => menuTexts.forEach(el => el.style.display = 'none'), 150);
    } else {
        sidebar.classList.remove('w-16');
        sidebar.classList.add('w-64');
        menuTexts.forEach(el => el.style.display = 'block');
        setTimeout(() => menuTexts.forEach(el => el.style.opacity = '1'), 50);
    }
}

function toggleSubMenu(menuId) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('w-16')) { toggleSidebar(); }
    setTimeout(() => {
        const submenu = document.getElementById(menuId);
        const icon = document.getElementById('icon-' + menuId);
        if (submenu.classList.contains('hidden')) {
            submenu.classList.remove('hidden'); submenu.classList.add('flex');
            icon.classList.add('rotate-180');
        } else {
            submenu.classList.add('hidden'); submenu.classList.remove('flex');
            icon.classList.remove('rotate-180');
        }
    }, sidebar.classList.contains('w-16') ? 300 : 0);
}

function logout() {
    localStorage.removeItem("elite_sport_token");
    sessionStorage.removeItem("elite_sport_token");
    window.location.href = "/admin/login.html";
}

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Kiểm tra xem có token không?
    const token = localStorage.getItem('elite_sport_token') || sessionStorage.getItem('elite_sport_token');

    // Nếu không có token -> Đá văng ra trang login ngay lập tức
    if (!token) {
        window.location.href = '/admin/login.html';
        return;
    }

    // 2. Nếu có token, gọi API lấy thông tin Admin
    try {
        // Đảm bảo bạn đã nhúng file config.js trước layout.js trong HTML
        const response = await fetch(`${CONFIG.API_BASE_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const user = await response.json();

            // 3. Cập nhật tên vào Sidebar
            // (Lưu ý: Bạn cần thêm id="sidebar-admin-name" vào thẻ <p class="text-sm font-semibold">Admin Sân</p> trong HTML string của AdminSidebar)
            const adminNameEl = document.getElementById('sidebar-admin-name');
            if (adminNameEl) {
                adminNameEl.textContent = user.full_name || user.username;
            }
        } else {
            // Token hết hạn hoặc sai -> Tự động đăng xuất
            logout();
        }
    } catch (error) {
        console.error("Lỗi xác thực hệ thống:", error);
    }
});