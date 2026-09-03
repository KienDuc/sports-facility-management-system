const API_BASE_URL = `${CONFIG.API_BASE_URL}/statistics`;
const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });
const statusLabels = { pending: 'Chờ xác nhận', booked: 'Đã đặt', confirmed: 'Đã xác nhận', playing: 'Đang chơi', completed: 'Hoàn thành', canceled: 'Đã hủy', cancelled: 'Đã hủy' };
const statusColors = { pending: 'bg-amber-500', booked: 'bg-blue-500', confirmed: 'bg-green-500', playing: 'bg-purple-500', completed: 'bg-emerald-500', canceled: 'bg-red-500', cancelled: 'bg-red-500' };

async function fetchJson(path) {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) throw new Error(`API trả về lỗi ${response.status}`);
    return response.json();
}

function showError(error) {
    const box = document.getElementById('errorMessage');
    box.textContent = `Không tải được dữ liệu thống kê: ${error.message}. Hãy kiểm tra FastAPI đang chạy tại cổng 8000.`;
    box.classList.remove('hidden');
}

async function loadOverview() {
    const data = await fetchJson('/overview');
    document.getElementById('totalCourts').textContent = data.total_courts;
    document.getElementById('activeCourts').textContent = `${data.active_courts} sân đang hoạt động`;
    document.getElementById('todayBookings').textContent = data.today_bookings;
    document.getElementById('totalBookings').textContent = `${data.total_bookings} đơn trong hệ thống`;
    document.getElementById('todayRevenue').textContent = money.format(data.today_revenue);
    document.getElementById('pendingBookings').textContent = data.pending_bookings;
    document.getElementById('bookingSummary').textContent = `${data.playing_bookings} đang chơi · ${data.cancelled_bookings} đã hủy`;
}

async function loadRevenue() {
    try {
        const days = document.getElementById('revenueDays').value;
        const data = await fetchJson(`/revenue?days=${days}`);
        const chart = document.getElementById('revenueChart');
        const maxValue = Math.max(...data.map(item => item.revenue), 1);
        const showEvery = data.length > 14 ? 5 : data.length > 7 ? 2 : 1;
        chart.innerHTML = data.map((item, index) => {
            const height = item.revenue === 0 ? 2 : Math.max((item.revenue / maxValue) * 90, 5);
            const label = index % showEvery === 0 ? item.date.slice(5).split('-').reverse().join('/') : '';
            return `<div class="flex-1 h-full flex flex-col justify-end items-center min-w-0 group" title="${item.date}: ${money.format(item.revenue)}"><div class="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 whitespace-nowrap mb-1">${money.format(item.revenue)}</div><div class="w-full max-w-10 bg-green-500 hover:bg-green-600 rounded-t transition-all" style="height:${height}%"></div><span class="h-5 text-[10px] text-gray-500 mt-1 whitespace-nowrap">${label}</span></div>`;
        }).join('');
        document.getElementById('periodRevenue').textContent = money.format(data.reduce((sum, item) => sum + item.revenue, 0));
    } catch (error) { showError(error); }
}

async function loadStatuses() {
    const data = await fetchJson('/booking-status');
    const total = data.reduce((sum, item) => sum + item.count, 0) || 1;
    document.getElementById('statusList').innerHTML = data.length ? data.map(item => `<div><div class="flex justify-between text-sm mb-1"><span>${statusLabels[item.status] || item.status}</span><strong>${item.count}</strong></div><div class="h-2 bg-gray-100 rounded-full overflow-hidden"><div class="h-full ${statusColors[item.status] || 'bg-gray-500'}" style="width:${item.count / total * 100}%"></div></div></div>`).join('') : '<p class="text-sm text-gray-400">Chưa có đơn đặt sân.</p>';
}

async function loadTopCourts() {
    const data = await fetchJson('/top-courts');
    document.getElementById('topCourts').innerHTML = data.length ? data.map(item => `<tr class="border-t border-gray-100 hover:bg-gray-50"><td class="px-5 py-4 font-semibold">${item.court_name}</td><td class="px-5 py-4 text-gray-500">${item.court_type}</td><td class="px-5 py-4 text-center">${item.booking_count}</td><td class="px-5 py-4 text-right font-medium">${money.format(item.revenue)}</td></tr>`).join('') : '<tr><td colspan="4" class="px-5 py-6 text-center text-gray-400">Chưa có dữ liệu đặt sân.</td></tr>';
}

async function loadTopServices() {
    const data = await fetchJson('/top-services');
    document.getElementById('topServices').innerHTML = data.length ? data.map(item => `<tr class="border-t border-gray-100 hover:bg-gray-50"><td class="px-5 py-4 font-semibold">${item.service_name}</td><td class="px-5 py-4 text-center">${item.quantity}</td><td class="px-5 py-4 text-right font-medium">${money.format(item.revenue)}</td></tr>`).join('') : '<tr><td colspan="3" class="px-5 py-6 text-center text-gray-400">Chưa có dữ liệu dịch vụ.</td></tr>';
}

async function loadDashboard() {
    document.getElementById('errorMessage').classList.add('hidden');
    const tasks = [loadOverview(), loadRevenue(), loadStatuses(), loadTopCourts(), loadTopServices()];
    const results = await Promise.allSettled(tasks);
    const failed = results.find(result => result.status === 'rejected');
    if (failed) showError(failed.reason);
}

loadDashboard();