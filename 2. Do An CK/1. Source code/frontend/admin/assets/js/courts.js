const API_URL = `${CONFIG.API_BASE_URL}/courts/`;
let allCourtsData = [];
let currentPage = 1;
const rowsPerPage = 8;

function openAddModal() { 
    document.getElementById('addCourtModal').classList.remove('hidden'); 
}

function closeAddModal() {
    document.getElementById('addCourtModal').classList.add('hidden');
    document.getElementById('addCourtForm').reset();
}

function openEditModal(id, name, type, price) {
    document.getElementById('editCourtId').value = id;
    document.getElementById('editCourtName').value = name;
    document.getElementById('editCourtType').value = type;
    document.getElementById('editCourtPrice').value = price;
    document.getElementById('editCourtModal').classList.remove('hidden');
}

function closeEditModal() { 
    document.getElementById('editCourtModal').classList.add('hidden'); 
}

async function fetchAndRenderCourts() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            allCourtsData = await response.json();
            renderTable();
        }
    } catch (error) {
        console.error("Lỗi lấy danh sách sân: ", error);
    }
}

function renderTable() {
    const tbody = document.getElementById('court-list');
    tbody.innerHTML = '';

    if (allCourtsData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500">Chưa có dữ liệu sân.</td></tr>`;
        document.getElementById('page-info').innerText = `Không có dữ liệu`;
        return;
    }

    const totalPages = Math.ceil(allCourtsData.length / rowsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const displayCourts = allCourtsData.slice(startIndex, startIndex + rowsPerPage);

    const endIndex = Math.min(startIndex + rowsPerPage, allCourtsData.length);
    document.getElementById('page-info').innerText = `Hiển thị ${startIndex + 1} - ${endIndex} / Tổng ${allCourtsData.length} sân (Trang ${currentPage}/${totalPages})`;

    displayCourts.forEach(court => {
        const typeColor = court.type.toLowerCase().includes('bóng đá') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';
        const isChecked = court.is_active ? 'checked' : '';
        const formatPrice = new Intl.NumberFormat('vi-VN').format(court.price_per_hour) + ' đ';

        const tr = document.createElement('tr');
        tr.className = 'border-b hover:bg-gray-50 transition';
        tr.innerHTML = `
            <td class="py-3 px-4 text-gray-500 font-medium">${court.id}</td>
            <td class="py-3 px-6 font-semibold text-gray-900">${court.name}</td>
            <td class="py-3 px-6"><span class="${typeColor} px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">${court.type}</span></td>
            <td class="py-3 px-6 font-semibold text-red-500">${formatPrice}</td>
            <td class="py-3 px-6 text-center">
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" ${isChecked} onchange="toggleActive(${court.id}, this)">
                    <div class="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500 shadow-sm"></div>
                </label>
            </td>
            <td class="py-3 px-6 text-center text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition"
                onclick="openEditModal(${court.id}, '${court.name}', '${court.type}', ${court.price_per_hour})">
                <i class="fa-solid fa-pen-to-square"></i> Sửa
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
    const totalPages = Math.ceil(allCourtsData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

async function submitNewCourt(event) {
    event.preventDefault();
    const data = {
        name: document.getElementById('addCourtName').value,
        type: document.getElementById('addCourtType').value,
        price_per_hour: parseFloat(document.getElementById('addCourtPrice').value),
        is_active: true
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            alert("Đã thêm sân mới thành công!");
            closeAddModal();
            fetchAndRenderCourts();
        } else alert("Lỗi khi thêm");
    } catch (error) { alert("Lỗi mạng!"); }
}

async function submitEditCourt(event) {
    event.preventDefault();
    const courtId = document.getElementById('editCourtId').value;
    const data = {
        name: document.getElementById('editCourtName').value,
        type: document.getElementById('editCourtType').value,
        price_per_hour: parseFloat(document.getElementById('editCourtPrice').value)
    };

    try {
        const response = await fetch(`${API_URL}${courtId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            alert("Đã cập nhật thông tin sân thành công!");
            closeEditModal();
            fetchAndRenderCourts();
        } else alert("Lỗi khi cập nhật");
    } catch (error) { alert("Lỗi mạng!"); }
}

async function toggleActive(courtId, checkbox) {
    try {
        const response = await fetch(`${API_URL}${courtId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active: checkbox.checked })
        });

        if (response.ok) {
            fetchAndRenderCourts();
        } else {
            checkbox.checked = !checkbox.checked;
            alert("Không thể cập nhật trạng thái");
        }
    } catch (error) {
        checkbox.checked = !checkbox.checked;
        alert("Lỗi kết nối");
    }
}

window.onload = () => {
    fetchAndRenderCourts();
};