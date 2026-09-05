const API_COURTS = `${CONFIG.API_BASE_URL}/courts/`;
const API_BOOKINGS = `${CONFIG.API_BASE_URL}/bookings`;

const DEFAULT_HOURS = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00"
];

let allCourts = [], filteredCourts = [], bookedSlots = [];
let currentPage = 1; const courtsPerPage = 4;
let currentSlotInfo = null;

function setDefaultDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('filterDate').value = `${yyyy}-${mm}-${dd}`;
}

async function fetchData() {
    const selectedDate = document.getElementById('filterDate').value;
    try {
        const resCourts = await fetchWithAuth(API_COURTS);
        if (resCourts.ok) allCourts = (await resCourts.json()).filter(c => c.is_active === true);
    } catch (e) {}
debugger;
    if (allCourts.length > 0 && selectedDate) {
        try {
            const resSchedule = await fetchWithAuth(`${API_BOOKINGS}/schedule?date=${selectedDate}`);
            if (resSchedule.ok) bookedSlots = await resSchedule.json();
            else bookedSlots = [];
        } catch (e) { bookedSlots = []; }
    } else bookedSlots = [];
    applyFilters();
}

function applyFilters() {
    const typeFilter = document.getElementById('filterType').value;
    filteredCourts = typeFilter === 'all' ? [...allCourts] : allCourts.filter(c => c.type.toLowerCase().includes(typeFilter.toLowerCase()));
    currentPage = 1;
    renderTable();
}

function nextPage() { if (currentPage < Math.ceil(filteredCourts.length / courtsPerPage)) { currentPage++; renderTable(); } }
function prevPage() { if (currentPage > 1) { currentPage--; renderTable(); } }

function renderTable() {
    const thead = document.getElementById('table-header');
    const tbody = document.getElementById('table-body');
    document.getElementById('pageIndicator').innerText = `Trang ${currentPage} / ${Math.ceil(filteredCourts.length / courtsPerPage) || 1}`;

    const displayCourts = filteredCourts.slice((currentPage - 1) * courtsPerPage, currentPage * courtsPerPage);

    thead.innerHTML = '<th class="py-3 px-4 border-r w-32 sticky left-0 bg-gray-100 z-10 shadow">Khung giờ</th>';
    displayCourts.forEach(court => {
        thead.innerHTML += `<th class="py-3 px-4 border-r text-center w-48">${court.name}<br><span class="text-xs text-gray-500">(${court.type})</span></th>`;
    });

    tbody.innerHTML = '';
    if (displayCourts.length === 0) return;

    const now = new Date();
    const selectedDate = document.getElementById('filterDate').value;
    const [y, m, d] = selectedDate.split('-');

    for (let i = 0; i < DEFAULT_HOURS.length - 1; i++) {
        const startTime = DEFAULT_HOURS[i], endTime = DEFAULT_HOURS[i+1];
        const tr = document.createElement('tr');
        tr.className = 'border-b hover:bg-gray-50';
        tr.innerHTML = `<td class="py-3 px-4 border-r font-semibold text-gray-700 sticky left-0 bg-white z-10 shadow">${startTime} - ${endTime}</td>`;

        const [endHr, endMin] = endTime.split(':');
        const slotEndDateTime = new Date(y, m - 1, d, endHr, endMin);
        const cutoffTime = new Date(slotEndDateTime.getTime() - 10 * 60000);
        const isPastHour = now >= cutoffTime;

        displayCourts.forEach(court => {
            const slotInfo = bookedSlots.find(s => s.court_id === court.id && s.start_time === startTime && s.status !== 'canceled');
            let btnHtml = '';
debugger;
            if (!slotInfo) {
                if (isPastHour) {
                    btnHtml = `<button disabled class="w-full h-10 bg-gray-200 text-gray-400 font-semibold rounded shadow-sm text-sm cursor-not-allowed border border-gray-300">Đã qua giờ</button>`;
                } else {
                    btnHtml = `<button onclick="openBookingModal(${court.id}, '${court.name}', '${startTime} - ${endTime}')" class="w-full h-10 bg-green-500 hover:bg-green-600 text-white font-semibold rounded shadow-sm text-sm">Trống</button>`;
                }
            } else if (slotInfo.status === 'booked') {
                const dataStr = JSON.stringify(slotInfo).replace(/"/g, '&quot;');
                btnHtml = `<button onclick="openDetailModal(${dataStr})" class="w-full h-10 bg-red-500 hover:bg-red-600 text-white font-semibold rounded shadow-sm text-sm truncate px-1">${slotInfo.customer}</button>`;
            } else if (slotInfo.status === 'playing') {
                const dataStr = JSON.stringify(slotInfo).replace(/"/g, '&quot;');
                btnHtml = `<button onclick="openDetailModal(${dataStr})" class="w-full h-10 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded shadow-sm text-sm">Đang chơi</button>`;
            }

            tr.innerHTML += `<td class="p-2 border-r text-center align-middle">${btnHtml}</td>`;
        });
        tbody.appendChild(tr);
    }
}

setInterval(fetchData, 10000);

function openBookingModal(courtId, courtName, timeSlot) {
    document.getElementById('bookingCourt').innerText = courtName;
    document.getElementById('bookingTime').innerText = timeSlot;
    document.getElementById('bookingCourtId').value = courtId;
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingModal').classList.remove('hidden');
}

function closeBookingModal() { 
    document.getElementById('bookingModal').classList.add('hidden'); 
}

async function confirmBooking(event) {
    event.preventDefault();
    const payload = {
        court_id: parseInt(document.getElementById('bookingCourtId').value),
        booking_date: document.getElementById('filterDate').value,
        start_time: document.getElementById('bookingTime').innerText.split(' - ')[0],
        end_time: document.getElementById('bookingTime').innerText.split(' - ')[1],
        customer_name: document.getElementById('customerName').value,
        customer_phone: document.getElementById('customerPhone').value,
        status: document.getElementById('bookingStatus').value
    };

    try {
        const res = await fetchWithAuth(`${API_BOOKINGS}/`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (res.ok) { closeBookingModal(); fetchData(); }
        else alert("Lỗi hệ thống");
    } catch (error) { alert("Lỗi mạng!"); }
}

function openDetailModal(slotInfo) {
    currentSlotInfo = slotInfo;
    document.getElementById('detailCode').innerText = slotInfo.booking_code;
    document.getElementById('detailName').innerText = slotInfo.customer;
    document.getElementById('detailPhone').innerText = slotInfo.phone;

    const typeEl = document.getElementById('detailStatus');
    const btnCheckIn = document.getElementById('btnCheckIn');
    const btnComplete = document.getElementById('btnComplete');
    const btnCancel = document.getElementById('btnCancelBooking');

    btnCheckIn.classList.add('hidden');
    btnComplete.classList.add('hidden');
    btnCancel.classList.add('hidden');

    if (slotInfo.status === 'booked') {
        typeEl.innerText = "Đã đặt trước";
        typeEl.className = "px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700";
        btnCheckIn.classList.remove('hidden');
        btnCancel.classList.remove('hidden');
    } else if (slotInfo.status === 'playing') {
        typeEl.innerText = "Khách đang chơi";
        typeEl.className = "px-2 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-700";
        btnComplete.classList.remove('hidden');
        btnCancel.classList.remove('hidden');
    }

    document.getElementById('detailModal').classList.remove('hidden');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.add('hidden');
    currentSlotInfo = null;
}

async function updateBookingStatus(newStatus) {
    try {
        const res = await fetchWithAuth(`${API_BOOKINGS}/${currentSlotInfo.booking_code}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if(res.ok) { closeDetailModal(); fetchData(); }
        else { alert("Không thể cập nhật trạng thái"); }
    } catch (e) { alert("Lỗi kết nối"); }
}

async function completeBooking() {
    if(confirm("Hoàn thành đơn.")) {
        try {
            const res = await fetchWithAuth(`${API_BOOKINGS}/${currentSlotInfo.booking_code}`, { method: 'DELETE' });
            if(res.ok) { closeDetailModal(); fetchData(); }
        } catch (e) { alert("Lỗi kết nối"); }
    }
}

async function cancelBooking() {
    if(confirm("Xác nhận KHÁCH KHÔNG ĐẾN hoặc HỦY?")) {
        try {
            const res = await fetchWithAuth(`${API_BOOKINGS}/${currentSlotInfo.booking_code}`, { method: 'DELETE' });
            if(res.ok) { closeDetailModal(); fetchData(); }
        } catch (e) { alert("Lỗi mạng!"); }
    }
}

window.onload = () => { setDefaultDate(); fetchData(); };