const API_URL = `${CONFIG.API_BASE_URL}/services/`;
let allServicesData = [];
let currentPage = 1;
const rowsPerPage = 8;

function openAddModal() { 
    document.getElementById('addServiceModal').classList.remove('hidden'); 
}

function closeAddModal() {
    document.getElementById('addServiceModal').classList.add('hidden');
    document.getElementById('addServiceForm').reset();
}

function openEditModal(id, name, unit, price) {
    document.getElementById('editServiceId').value = id;
    document.getElementById('editServiceName').value = name;
    document.getElementById('editServiceUnit').value = unit;
    document.getElementById('editServicePrice').value = price;
    document.getElementById('editServiceModal').classList.remove('hidden');
}

function closeEditModal() { 
    document.getElementById('editServiceModal').classList.add('hidden'); 
}

async function fetchAndRenderServices() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            allServicesData = await response.json();
            renderTable();
        }
    } catch (error) {
        console.error("Lỗi lấy danh sách dịch vụ: ", error);
    }
}

function renderTable() {
    const tbody = document.getElementById('service-list');
    tbody.innerHTML = '';

    if (allServicesData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500">Chưa có dữ liệu dịch vụ.</td></tr>`;
        document.getElementById('page-info').innerText = `Không có dữ liệu`;
        return;
    }

    const totalPages = Math.ceil(allServicesData.length / rowsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const displayServices = allServicesData.slice(startIndex, startIndex + rowsPerPage);

    const endIndex = Math.min(startIndex + rowsPerPage, allServicesData.length);
    document.getElementById('page-info').innerText = `Hiển thị ${startIndex + 1} - ${endIndex} / Tổng ${allServicesData.length} dịch vụ (Trang ${currentPage}/${totalPages})`;

    displayServices.forEach(service => {
        const isChecked = service.is_available ? 'checked' : '';
        const formatPrice = new Intl.NumberFormat('vi-VN').format(service.price) + ' đ';
        const safeName = service.name.replace(/'/g, "\\'");

        const tr = document.createElement('tr');
        tr.className = 'border-b hover:bg-gray-50 transition';
        tr.innerHTML = `
            <td class="py-3 px-4 text-gray-500 font-medium">${service.id}</td>
            <td class="py-3 px-6 font-semibold text-gray-900">${service.name}</td>
            <td class="py-3 px-6"><span class="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">${service.unit}</span></td>
            <td class="py-3 px-6 font-semibold text-red-500">${formatPrice}</td>
            <td class="py-3 px-6 text-center">
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" ${isChecked} onchange="toggleAvailable(${service.id}, this)">
                    <div class="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500 shadow-sm"></div>
                </label>
            </td>
            <td class="py-3 px-6 text-center text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition"
                onclick="openEditModal(${service.id}, '${safeName}', '${service.unit}', ${service.price})">
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
    const totalPages = Math.ceil(allServicesData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

async function submitNewService(event) {
    event.preventDefault();
    const data = {
        name: document.getElementById('addServiceName').value,
        unit: document.getElementById('addServiceUnit').value,
        price: parseFloat(document.getElementById('addServicePrice').value),
        is_available: true
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            alert("Đã thêm dịch vụ mới thành công!");
            closeAddModal();
            fetchAndRenderServices();
        } else alert("Lỗi khi thêm");
    } catch (error) { alert("Lỗi mạng!"); }
}

async function submitEditService(event) {
    event.preventDefault();
    const serviceId = document.getElementById('editServiceId').value;
    const data = {
        name: document.getElementById('editServiceName').value,
        unit: document.getElementById('editServiceUnit').value,
        price: parseFloat(document.getElementById('editServicePrice').value)
    };

    try {
        const response = await fetch(`${API_URL}${serviceId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            alert("Đã cập nhật dịch vụ thành công!");
            closeEditModal();
            fetchAndRenderServices();
        } else alert("Lỗi khi cập nhật");
    } catch (error) { alert("Lỗi mạng!"); }
}

async function toggleAvailable(serviceId, checkbox) {
    try {
        const response = await fetch(`${API_URL}${serviceId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_available: checkbox.checked })
        });

        if (response.ok) {
            fetchAndRenderServices();
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
    fetchAndRenderServices();
};