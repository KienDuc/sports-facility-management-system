const API_URL = `${CONFIG.API_BASE_URL}/bookings/`;

let allBookingsData = [];
let currentPage = 1;
const rowsPerPage = 8;

async function fetchAndRenderBookings() {
    const params = new URLSearchParams();
    const keyword = document.getElementById('filterKeyword').value.trim();
    const statusVal = document.getElementById('filterStatus').value;
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;

    if (keyword) params.append('keyword', keyword);
    if (statusVal && statusVal !== 'all') params.append('status', statusVal);
    if (dateFrom) params.append('date_from', dateFrom);
    if (dateTo) params.append('date_to', dateTo);

    try {
        const response = await fetch(`${API_URL}?${params.toString()}`);
        if (response.ok) {
            allBookingsData = await response.json();
            currentPage = 1;
            renderTable();
        } else {
            alert("Lỗi khi tải danh sách đơn đặt");
        }
    } catch (error) {
        console.error("Lỗi lấy danh sách đơn đặt: ", error);
    }
}

function searchBookings(event) {
    event.preventDefault();
    fetchAndRenderBookings();
}

function resetFilters() {
    document.getElementById('searchForm').reset();
    fetchAndRenderBookings();
}

function statusBadge(status) {
    const map = {
        booked: { text: 'Đã đặt trước', cls: 'bg-red-100 text-red-700' },
        playing: { text: 'Đang chơi', cls: 'bg-yellow-100 text-yellow-700' },
        canceled: { text: 'Đã hủy / Hoàn tất', cls: 'bg-gray-200 text-gray-600' },
        cancelled: { text: 'Đã hủy / Hoàn tất', cls: 'bg-gray-200 text-gray-600' },
        completed: { text: 'Hoàn tất', cls: 'bg-green-100 text-green-700' },
        confirmed: { text: 'Đã xác nhận', cls: 'bg-blue-100 text-blue-700' },
    };
    return map[status] || { text: status, cls: 'bg-gray-100 text-gray-600' };
}

function formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN').format(value || 0) + ' đ';
}

function renderTable() {
    const tbody = document.getElementById('booking-list');
    tbody.innerHTML = '';

    if (allBookingsData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-gray-500">Không tìm thấy đơn đặt nào.</td></tr>`;
        document.getElementById('page-info').innerText = `Không có dữ liệu`;
        return;
    }

    const totalPages = Math.ceil(allBookingsData.length / rowsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const displayBookings = allBookingsData.slice(startIndex, startIndex + rowsPerPage);

    const endIndex = Math.min(startIndex + rowsPerPage, allBookingsData.length);
    document.getElementById('page-info').innerText = `Hiển thị ${startIndex + 1} - ${endIndex} / Tổng ${allBookingsData.length} đơn (Trang ${currentPage}/${totalPages})`;

    displayBookings.forEach(booking => {
        const badge = statusBadge(booking.status);
        const slotsText = (booking.slots || []).map(s => `${s.court_name || ''} (${s.start_time}-${s.end_time})`).join(', ') || '—';

        const tr = document.createElement('tr');
        tr.className = 'border-b hover:bg-gray-50 transition';
        tr.innerHTML = `
            <td class="py-3 px-4 text-gray-500 font-medium">${booking.id}</td>
            <td class="py-3 px-6 font-bold text-blue-600">${booking.booking_code}</td>
            <td class="py-3 px-6 font-semibold text-gray-900">${booking.customer_name}</td>
            <td class="py-3 px-6 text-gray-700">${booking.customer_phone}</td>
            <td class="py-3 px-6 text-gray-700">${booking.booking_date}</td>
            <td class="py-3 px-6 text-gray-700 max-w-[220px] truncate" title="${slotsText}">${slotsText}</td>
            <td class="py-3 px-6 font-semibold text-red-500">${formatCurrency(booking.total_price)}</td>
            <td class="py-3 px-6 text-center"><span class="${badge.cls} px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">${badge.text}</span></td>
            <td class="py-3 px-6 text-center text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition"
                onclick='openDetailModal(${JSON.stringify(booking).replace(/'/g, "&#39;")})'>
                <i class="fa-solid fa-eye"></i> Xem
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(allBookingsData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

function openDetailModal(booking) {
    document.getElementById('detailCode').innerText = booking.booking_code;
    document.getElementById('detailName').innerText = booking.customer_name;
    document.getElementById('detailPhone').innerText = booking.customer_phone;
    document.getElementById('detailDate').innerText = booking.booking_date;
    document.getElementById('detailCreatedAt').innerText = booking.created_at ? new Date(booking.created_at).toLocaleString('vi-VN') : '—';
    document.getElementById('detailTotal').innerText = formatCurrency(booking.total_price);

    const badge = statusBadge(booking.status);
    const statusEl = document.getElementById('detailStatus');
    statusEl.innerText = badge.text;
    statusEl.className = `px-2 py-0.5 rounded text-xs font-bold ${badge.cls}`;

    const noteWrap = document.getElementById('detailNoteWrap');
    if (booking.note) {
        noteWrap.classList.remove('hidden');
        document.getElementById('detailNote').innerText = booking.note;
    } else {
        noteWrap.classList.add('hidden');
    }

    const slotsBody = document.getElementById('detailSlots');
    slotsBody.innerHTML = (booking.slots && booking.slots.length > 0)
        ? booking.slots.map(s => `
            <tr class="border-t">
                <td class="py-2 px-2">${s.court_name || '—'} <span class="text-gray-400">(${s.court_type || ''})</span></td>
                <td class="py-2 px-2">${s.start_time} - ${s.end_time}</td>
                <td class="py-2 px-2 text-right">${formatCurrency(s.price)}</td>
            </tr>`).join('')
        : `<tr><td colspan="3" class="py-2 px-2 text-center text-gray-400">Không có dữ liệu</td></tr>`;

    const servicesBody = document.getElementById('detailServices');
    servicesBody.innerHTML = (booking.services && booking.services.length > 0)
        ? booking.services.map(sv => `
            <tr class="border-t">
                <td class="py-2 px-2">${sv.service_name || '—'}</td>
                <td class="py-2 px-2 text-center">${sv.quantity}</td>
                <td class="py-2 px-2 text-right">${formatCurrency(sv.total_price)}</td>
            </tr>`).join('')
        : `<tr><td colspan="3" class="py-2 px-2 text-center text-gray-400">Không có dịch vụ đi kèm</td></tr>`;

    document.getElementById('detailModal').classList.remove('hidden');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.add('hidden');
}

window.onload = () => {
    fetchAndRenderBookings();
};