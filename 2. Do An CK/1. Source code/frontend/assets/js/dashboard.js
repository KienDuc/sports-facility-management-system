// 1. Initialize AOS
AOS.init({
  duration: 700,
  once: true,
  easing: 'ease-out-cubic'
});

// --- 2. HIỆU ỨNG CANVAS TƯƠNG TÁC (CANVA STYLE NETWORK) ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -1000, y: -1000, active: false };
let systemServices = []; // biến mảng để lưu dịch vụ tải về từ Backend
let isBookingFromAI = false;

// Theo dõi chuột
window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});
// Splash Effect khi Click vào Banner
window.addEventListener('mousedown', (e) => {
    mouse.active = true;
    // Tạo hạt dạt ra
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle(mouse.x, mouse.y, true));
    }
});
window.addEventListener('mouseup', () => mouse.active = false );

function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
    constructor(x, y, isSplash = false) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.radius = Math.random() * 2.5 + 1;
        this.vx = (Math.random() - 0.5) * (isSplash ? 12 : 1);
        this.vy = (Math.random() - 0.5) * (isSplash ? 12 : 1);
        this.life = isSplash ? 100 : Infinity;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Hạt bay chậm lại nếu là Splash
        if (this.life !== Infinity) {
            this.vx *= 0.92;
            this.vy *= 0.92;
            this.life--;
        }

        // Dội viền
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Tránh chuột (Repel effect)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.hypot(dx, dy);
        if (dist < 120) {
            this.x -= (dx / dist) * 1.5;
            this.y -= (dy / dist) * 1.5;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${this.life === Infinity ? 0.4 : this.life/100})`;
        ctx.fill();
    }
}

// Khởi tạo 80 hạt ban đầu
for (let i = 0; i < 80; i++) particles.push(new Particle());

function renderNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Xóa hạt chết
    particles = particles.filter(p => p.life > 0);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Vẽ đường liên kết
        for (let j = i + 1; j < particles.length; j++) {
            let dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
            if (dist < 110) {
                ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 - dist / 730})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(renderNetwork);
}

renderNetwork();

// --- 2. ROBOT THEO DÕI & TƯƠNG TÁC SÚT BÓNG ---
const robotSvg = document.getElementById('robotSvg');
const robotEyes = document.getElementById('robotEyes');
const robotAthlete = document.getElementById('robotAthlete');
const projectedBall = document.getElementById('projectedBall');

// Mắt Robot hướng theo chuột
window.addEventListener('mousemove', (e) => {
    const rect = robotAthlete.getBoundingClientRect();
    const robotCenterX = rect.left + rect.width / 2;
    const robotCenterY = rect.top + rect.height / 2;

    const angleDeg = (Math.atan2(e.clientY - robotCenterY, e.clientX - robotCenterX) * 180) / Math.PI;
    const tiltAngle = Math.max(-15, Math.min(15, angleDeg / 5));
    robotSvg.style.transform = `rotate(${tiltAngle}deg)`;

    const eyeOffsetX = Math.max(-3, Math.min(3, (e.clientX - robotCenterX) / 50));
    const eyeOffsetY = Math.max(-2, Math.min(2, (e.clientY - robotCenterY) / 50));
    robotEyes.style.transform = `translate(${eyeOffsetX}px, ${eyeOffsetY}px)`;
});

// Robot di chuyển đến chỗ click & sút bóng
function handlePitchClick(event) {
    const pitch = document.getElementById('interactivePitch');
    const rect = pitch.getBoundingClientRect();

    const clickX = ((event.clientX - rect.left) / rect.width) * 100;
    const clickY = ((event.clientY - rect.top) / rect.height) * 100;
    const safeX = Math.max(10, Math.min(90, clickX));
    const safeY = Math.max(10, Math.min(80, clickY));

    // Robot lướt tới
    robotAthlete.style.left = `calc(${safeX}% - 40px)`;
    robotAthlete.style.top = `calc(${safeY}% - 40px)`;
    robotAthlete.style.transform = `scale(1.15) rotate(5deg)`;

    // Ẩn bóng cũ
    projectedBall.style.transition = 'none';
    projectedBall.style.opacity = '0';

    // Ra chân sút sau 350ms
    setTimeout(() => {
        robotAthlete.style.transform = `scale(1) rotate(0deg)`;

        projectedBall.style.left = `calc(${safeX}% - 12px)`;
        projectedBall.style.top = `calc(${safeY}% - 12px)`;
        projectedBall.style.opacity = '1';

        const targetX = safeX > 50 ? safeX - 35 : safeX + 35;
        const targetY = safeY > 50 ? safeY - 30 : safeY + 30;

        setTimeout(() => {
            projectedBall.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            projectedBall.style.left = `${targetX}%`;
            projectedBall.style.top = `${targetY}%`;
            projectedBall.style.transform = `scale(1.3) rotate(720deg)`;
        }, 50);

    }, 350);
}

const PUBLIC_HOURS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
];

let systemCourts = [];
let bookedSlotsData = [];
let selectedDateStr = "";

let currentSport = "";
let selectedCourtInfo = null; // Chứa id, name, price của sân đang chọn
let selectedSlotTime = null;  // Ví dụ: "17:00 - 18:00"

let sportRate = 0;
let slotHours = 1;
let modalCourtInfo = null;
let modalDateStr = "";
let modalSlotTime = "";
let modalSportRate = 0;
let modalSlotHours = 0;

const heroSection = document.getElementById('about');

function formatDateToVN(dateString) {
    if(!dateString) return "";
    const [y, m, d] = dateString.split('-');
    return `${d}/${m}/${y}`;
}

// Load Dữ Liệu Booking từ API
async function initPublicBooking() {
    // Set ngày mặc định là hôm nay
    const d = new Date();
    selectedDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const dateInput = document.getElementById('publicBookingDate');
    const displayDateText = document.getElementById('displayDateText');

    if (dateInput) {
        dateInput.value = selectedDateStr;
        dateInput.min = selectedDateStr; // KHÓA không cho chọn ngày trong quá khứ
        if(displayDateText) displayDateText.innerText = formatDateToVN(selectedDateStr);
    }

    try {
        const resCourts = await fetch(`${CONFIG.API_BASE_URL}/courts/public`);
        if (resCourts.ok) systemCourts = (await resCourts.json()).filter(c => c.is_active);

        // Tải danh sách dịch vụ động từ API
        const resServices = await fetch(`${CONFIG.API_BASE_URL}/services/`);

        if (resServices.ok) {
            systemServices = (await resServices.json()).filter(s => s.is_available);
            renderServices(); // Gọi hàm vẽ UI dịch vụ
        }

        // Nạp lịch đặt sân cho ngày hôm nay
        await loadBookingsForDate(selectedDateStr);

        switchSportMode('football', 0, 'Bóng Đá');
    } catch (error) {
        console.error("Lỗi tải dữ liệu sân:", error);
    }
}

function renderServices() {
    const container = document.getElementById('dynamicServices');
    const modalContainer = document.getElementById('modalDynamicServices');


    if (systemServices.length === 0) {
         if(container) container.innerHTML = '<div class="text-[11px] text-slate-400 italic text-center p-2 border border-dashed border-slate-200 rounded-xl">Hiện chưa có dịch vụ kèm theo.</div>';
         if(modalContainer) modalContainer.innerHTML = '<div class="text-[11px] text-slate-400 italic text-center p-1">Không có dịch vụ.</div>';
         return;
    }

    let htmlContent = '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">';
    systemServices.forEach(srv => {
         htmlContent += `
            <div class="service-item flex flex-col p-2.5 rounded-xl border border-slate-200 bg-white transition shadow-sm" data-id="${srv.id}" data-price="${srv.price}">
                <label class="flex items-center justify-between cursor-pointer w-full gap-2">
                    <div class="flex items-center gap-2.5 shrink">
                        <input type="checkbox" onchange="handleServiceChange(this)" class="service-checkbox w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0">
                        <span class="text-xs font-semibold text-slate-700 truncate whitespace-normal">${srv.name}</span>
                    </div>
                    <span class="text-emerald-700 text-xs font-bold bg-emerald-100/60 px-2.5 py-1 rounded shrink-0 whitespace-nowrap">
                        +${srv.price.toLocaleString('vi-VN')} đ
                    </span>
                </label>

                <!-- Trình chọn số lượng -->
                <div class="qty-control hidden items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <span class="text-[11px] text-slate-500 font-medium">Số lượng:</span>
                    <div class="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-200">
                        <button type="button" onclick="changeQty(this, -1)" class="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-600 transition"><i class="fa-solid fa-minus text-[10px]"></i></button>
                        
                        <!-- 👉 ĐÃ SỬA CHỖ NÀY: Thêm text-slate-800 (chữ đen đậm), py-1 (canh giữa), và lớp CSS để giấu mũi tên mặc định -->
                        <input type="number" value="1" min="1" max="50" onchange="handleQtyInput(this)" class="service-qty w-10 text-center text-xs font-bold text-slate-800 bg-transparent border-none p-0 py-1 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
                        
                        <button type="button" onclick="changeQty(this, 1)" class="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-600 transition"><i class="fa-solid fa-plus text-[10px]"></i></button>
                    </div>
                </div>
            </div>
         `;
    });

    htmlContent += '</div>';

    if (container) {
        container.innerHTML = htmlContent;
    }

    if (modalContainer) {
        // Đẩy content vào Popup, nhưng xóa class chia 2 cột ('sm:grid-cols-2')
        // để trên Popup nó hiện 1 cột cho gọn, tránh bị tràn form.
        let modalHtmlContent = htmlContent.replace('sm:grid-cols-2', '');
        modalContainer.innerHTML = modalHtmlContent;
    }

    checkServiceAvailability();
}

// Tính toán lại tổng tiền dịch vụ mỗi khi tick/bỏ tick
function updateAddonTotal() {
    let total = 0;

    document.querySelectorAll('.service-checkbox:checked').forEach(cb => {
        total += parseFloat(cb.value);
    });

    // addonPrice = total; // Cập nhật lại biến toàn cục addonPrice
    calcTotal(); // Cập nhật lại màn hình hiển thị tổng tiền
}

// Load lịch đặt sân
async function loadBookingsForDate(dateStr) {
    try {
        const resSchedule = await fetch(`${CONFIG.API_BASE_URL}/bookings/schedule?date=${dateStr}`);
        if (resSchedule.ok) {
            bookedSlotsData = await resSchedule.json();
        } else {
            bookedSlotsData = [];
        }
    } catch (error) {
        bookedSlotsData = [];
    }
}

// KH thay đổi ngày đặt mới
async function handleDateChange() {
    const dateInput = document.getElementById('publicBookingDate');
    if (!dateInput.value) return;

    // Cập nhật ngày mới
    selectedDateStr = dateInput.value;

    const displayDateText = document.getElementById('displayDateText');
    if(displayDateText) displayDateText.innerText = formatDateToVN(selectedDateStr);

    // Bỏ khung giờ đang chọn cũ
    selectedSlotTime = null;
    checkServiceAvailability();

    // Tải lại dữ liệu các ô đã bị đặt của ngày hôm đó
    await loadBookingsForDate(selectedDateStr);

    // Vẽ lại khung giờ nếu khách đã chọn sân
    if (selectedCourtInfo) {
        renderPublicTimeSlots();
    }
}

// KH đổi tab chọn môn thể thao khác
function switchSportMode(type, oldRate, label) {
    currentSport = type;
    document.getElementById('liveSportBadge').innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ${label}`;

    // Reset CSS các tab
    document.querySelectorAll('.sport-tab-btn').forEach(b => {
        b.className = 'sport-tab-btn p-3 rounded-2xl border-2 border-slate-200 bg-white/70 text-slate-600 hover:border-emerald-400 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all';
    });

    // Lọc sân theo môn (Quy đổi keyword)
    const keyword = type === 'football' ? 'bóng đá' : type === 'pickleball' ? 'pickleball' : 'cầu lông';
    const availableCourts = systemCourts.filter(c => c.type.toLowerCase().includes(keyword));

    // Đổ data vào thẻ <select>
    const selectEl = document.getElementById('publicCourtSelect');
    if(selectEl) {
        selectEl.innerHTML = `<option value="">-- Vui lòng chọn sân bạn muốn --</option>`;
        availableCourts.forEach(c => {
          selectEl.innerHTML += `<option value="${c.id}" data-price="${c.price_per_hour}">${c.name} - ${new Intl.NumberFormat('vi-VN').format(c.price_per_hour)}đ/giờ</option>`;
        });

        // Hiện ô chọn sân, giấu ô giờ
        document.getElementById('courtSelectionDiv').classList.remove('hidden');
        document.getElementById('publicTimeSlots').innerHTML = '<div class="col-span-full text-center font-medium py-4 text-slate-400 italic">Vui lòng chọn sân cụ thể trước...</div>';
    }

    // reset sân sau khi chọn môn khác
    selectedCourtInfo = null;

    // Reset giá và giờ
    sportRate = 0;
    selectedSlotTime = null;
    checkServiceAvailability();

    // Giao diện mô phỏng sân
    const title = document.getElementById('pitchTypeTitle');
    const equip = document.getElementById('robotEquipment');
    const ball = document.getElementById('projectedBall');
    const visor = document.getElementById('robotVisor');
    const svgPitch = document.getElementById('pitchSvg');
    heroSection.classList.remove('theme-football', 'theme-pickleball', 'theme-badminton');

    if (type === 'football') {
        document.getElementById('tab-football').className = 'sport-tab-btn active p-3 rounded-2xl border-2 border-emerald-500 bg-emerald-50 text-emerald-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md';
        title.innerHTML = '<i class="fa-solid fa-futbol text-emerald-400 mr-1"></i> Mô Phỏng Mặt Sân Bóng Đá';
        heroSection.classList.add('theme-football');
        ball.innerText = '⚽';
        visor.setAttribute('fill', '#10b981');
        visor.className.baseVal = "visor-glow text-emerald-400";
        equip.innerHTML = `<circle cx="60" cy="112" r="10" fill="white" stroke="#475569" stroke-width="2"/>`;
        svgPitch.innerHTML = `<rect x="10" y="10" width="280" height="130" fill="none" stroke="#34d399" stroke-width="2"/> <line x1="150" y1="10" x2="150" y2="140" stroke="#34d399" stroke-width="1.5"/> <circle cx="150" cy="75" r="28" fill="none" stroke="#34d399" stroke-width="1.5"/> <rect x="10" y="40" width="35" height="70" fill="none" stroke="#34d399" stroke-width="1.5"/> <rect x="255" y="40" width="35" height="70" fill="none" stroke="#34d399" stroke-width="1.5"/>`;
    } else if (type === 'pickleball') {
        document.getElementById('tab-pickleball').className = 'sport-tab-btn active p-3 rounded-2xl border-2 border-cyan-500 bg-cyan-50 text-cyan-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md';
        title.innerHTML = '<i class="fa-solid fa-table-tennis-paddle-ball text-cyan-400 mr-1"></i> Mô Phỏng Mặt Sân PickleBall';
        heroSection.classList.add('theme-pickleball');
        ball.innerText = '🟡';
        visor.setAttribute('fill', '#06b6d4');
        visor.className.baseVal = "visor-glow text-cyan-400";
        equip.innerHTML = `<rect x="78" y="70" width="18" height="26" rx="6" fill="#06b6d4" stroke="white" stroke-width="2"/> <line x1="87" y1="96" x2="87" y2="108" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>`;
        svgPitch.innerHTML = `<rect x="20" y="15" width="260" height="120" fill="none" stroke="#22d3ee" stroke-width="2"/> <line x1="150" y1="15" x2="150" y2="135" stroke="#06b6d4" stroke-width="2"/> <rect x="105" y="15" width="90" height="120" fill="rgba(6, 182, 212, 0.15)" stroke="#22d3ee" stroke-width="1"/> <line x1="20" y1="75" x2="105" y2="75" stroke="#22d3ee" stroke-width="1"/> <line x1="195" y1="75" x2="280" y2="75" stroke="#22d3ee" stroke-width="1"/>`;
    } else if (type === 'badminton') {
        document.getElementById('tab-badminton').className = 'sport-tab-btn active p-3 rounded-2xl border-2 border-violet-500 bg-violet-50 text-violet-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md';
        title.innerHTML = '<i class="fa-solid fa-feather text-violet-400 mr-1"></i> Mô Phỏng Mặt Sân Cầu Lông';
        heroSection.classList.add('theme-badminton');
        ball.innerText = '🏸';
        visor.setAttribute('fill', '#8b5cf6');
        visor.className.baseVal = "visor-glow text-violet-400";
        equip.innerHTML = `<ellipse cx="86" cy="72" rx="10" ry="14" fill="none" stroke="#8b5cf6" stroke-width="2.5"/> <line x1="86" y1="86" x2="86" y2="108" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>`;
        svgPitch.innerHTML = `<rect x="20" y="15" width="260" height="120" fill="none" stroke="#a78bfa" stroke-width="2"/> <line x1="150" y1="15" x2="150" y2="135" stroke="#8b5cf6" stroke-width="2"/> <line x1="35" y1="15" x2="35" y2="135" stroke="#a78bfa" stroke-width="1"/> <line x1="265" y1="15" x2="265" y2="135" stroke="#a78bfa" stroke-width="1"/> <line x1="20" y1="75" x2="280" y2="75" stroke="#a78bfa" stroke-width="1"/>`;
    }
}

// KH Đổi sân
function handleCourtChange() {
    const select = document.getElementById('publicCourtSelect');
    if(!select.value) {
        document.getElementById('publicTimeSlots').innerHTML = '<div class="col-span-full text-center py-4 text-slate-400 italic">Vui lòng chọn sân cụ thể trước...</div>';
        sportRate = 0; calcTotal();
        return;
    }

    const option = select.options[select.selectedIndex];
    selectedCourtInfo = {
        id: parseInt(select.value),
        name: option.text.split(' - ')[0],
        price: parseFloat(option.getAttribute('data-price'))
    };

    sportRate = selectedCourtInfo.price;
    selectedSlotTime = null; // Bỏ giờ đã chọn trước đó
    calcTotal();

    // Khóa dịch vụ và tính lại tiền
    checkServiceAvailability();
    renderPublicTimeSlots();
}

// Render Khung giờ thực tế
function renderPublicTimeSlots() {
    const container = document.getElementById('publicTimeSlots');
    container.innerHTML = '';

    const now = new Date();
    // Tạo chuỗi ngày hôm nay để so sánh
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Kiểm tra xem khách đang xem ngày hôm nay hay ngày tương lai
    const isViewingToday = (selectedDateStr === todayStr);

    for (let i = 0; i < PUBLIC_HOURS.length - 1; i++) {
        const start = PUBLIC_HOURS[i], end = PUBLIC_HOURS[i+1];

        // 1. Kiểm tra xem giờ này đã bị ai đặt chưa
        //const isBooked = bookedSlotsData.some(b => b.court_id === selectedCourtInfo.id && b.start_time === start && b.status !== 'canceled');
        // 1. Kiểm tra xem giờ này đã bị ai đặt chưa (Nâng cấp quét đa khối)
        const isBooked = bookedSlotsData.some(b => {
            if (b.court_id !== selectedCourtInfo.id || b.status === 'canceled' || b.status === 'cancelled') return false;

            // Lấy giờ phút chuẩn "HH:mm"
            const bStart = b.start_time.slice(0, 5);
            const bEnd = b.end_time.slice(0, 5);

            // Khóa ô hiển thị nếu nó nằm giữa giờ bắt đầu và kết thúc của một đơn bất kỳ
            return start >= bStart && start < bEnd;
        });

        // 2. Kiểm tra giờ đã qua (Chỉ khóa nếu khách đang xem ngày hôm nay)
        let isPast = false;
        if (isViewingToday) {
            const [h, m] = start.split(':');
            const slotTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(h), parseInt(m));
            isPast = now >= slotTime;
        }

        if (isBooked) {
            container.innerHTML += `<button disabled class="p-2.5 rounded-xl border border-red-200 bg-red-50 font-bold text-red-500 shadow-sm opacity-60 cursor-not-allowed">Đã Kín</button>`;
        } else if (isPast) {
            container.innerHTML += `<button disabled class="p-2.5 rounded-xl border border-slate-200 bg-slate-100 font-semibold text-slate-400 cursor-not-allowed">Đã Qua</button>`;
        } else {
            container.innerHTML += `<button onclick="selectPublicSlot(this, '${start}', '${end}')" class="slot-pill p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-all shadow-sm">${start}</button>`;
        }
    }
}

// Khi khách bấm chọn giờ trống
function selectPublicSlot(btn, start, end) {
    selectedSlotTime = `${start} - ${end}`;

    slotHours = 1;

    document.querySelectorAll('#publicTimeSlots .slot-pill').forEach(b => {
        b.className = 'slot-pill p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-all shadow-sm';
    });
    btn.className = 'slot-pill active p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 font-extrabold text-emerald-800 transition-all shadow-md scale-105';
    calcTotal();

    checkServiceAvailability();
}

function calcTotal() {
    const courtTotal = selectedSlotTime ? (sportRate * slotHours) : 0;
    let outsideAddon = 0;

    document.querySelectorAll('#dynamicServices .service-checkbox:checked').forEach(cb => {
        const item = cb.closest('.service-item');
        const price = parseFloat(item.getAttribute('data-price'));
        const qty = parseInt(item.querySelector('.service-qty').value) || 1;
        outsideAddon += (price * qty);
    });

    const total = courtTotal + outsideAddon;
    const mainPriceEl = document.getElementById('calculatedPrice');
    if (mainPriceEl) {
        mainPriceEl.innerHTML = `${total.toLocaleString('vi-VN')} <span class="text-xs font-medium text-emerald-400">VNĐ</span>`;
    }
}

// 3. Tính tiền ô input bên trong Popup
function calcPopupTotal() {
    const courtTotal = modalSlotTime ? (modalSportRate * modalSlotHours) : 0;

    let popupAddon = 0;
    // Chỉ gom checkbox bên trong Popup (#modalDynamicServices)
    document.querySelectorAll('#modalDynamicServices .service-checkbox:checked').forEach(cb => {
        const item = cb.closest('.service-item');
        const price = parseFloat(item.getAttribute('data-price'));
        const qty = parseInt(item.querySelector('.service-qty').value) || 1;
        popupAddon += (price * qty);
    });

    const total = courtTotal + popupAddon;
    const popupPriceEl = document.getElementById('pbPrice');
    if (popupPriceEl) {
        popupPriceEl.value = `${total.toLocaleString('vi-VN')} VNĐ`;
    }
}

// Mở popup xác nhận
function openPublicBookingModal(isFromAI = false, aiData = null) {
    isBookingFromAI = isFromAI; // Đánh dấu là KHÔNG PHẢI do AI

    if (isFromAI && aiData) {
        // NẾU TỪ AI: Đổ data của AI vào bộ biến Modal
        modalCourtInfo = { id: aiData.courtId, name: aiData.courtName, price: aiData.price };
        modalDateStr = aiData.dateStr;
        modalSlotTime = aiData.slotTime;
        modalSportRate = aiData.price;
        modalSlotHours = aiData.hours;

        // Xóa sạch tick bên trong Popup
        document.querySelectorAll('#modalDynamicServices .service-checkbox').forEach(cb => {
            cb.checked = false;
            handleServiceChange(cb);
        });
    } else {
        // NẾU THỦ CÔNG: Kiểm tra xem đã chọn ngoài chưa rồi copy vào Modal
        if(!selectedCourtInfo || !selectedSlotTime) {
            alert("Bạn vui lòng chọn Sân và Khung giờ trống để tiếp tục nhé!");
            return;
        }

        modalCourtInfo = selectedCourtInfo;
        modalDateStr = selectedDateStr;
        modalSlotTime = selectedSlotTime;
        modalSportRate = sportRate;
        modalSlotHours = slotHours;

        // Copy trạng thái tick từ ngoài vào trong
        const outsideCbs = document.querySelectorAll('#dynamicServices .service-checkbox');
        const insideCbs = document.querySelectorAll('#modalDynamicServices .service-checkbox');
        const outsideQtys = document.querySelectorAll('#dynamicServices .service-qty');
        const insideQtys = document.querySelectorAll('#modalDynamicServices .service-qty');

        outsideCbs.forEach((outCb, index) => {
            if (insideCbs[index]) {
                insideCbs[index].checked = outCb.checked;
                insideQtys[index].value = outsideQtys[index].value;
                handleServiceChange(insideCbs[index]); // Kích hoạt hiển thị UI trong popup
            }
        });
    }

    // Tính tiền riêng cho Popup sau khi đã copy tick
    calcPopupTotal();

    document.getElementById('pbCourtName').value = modalCourtInfo.name;
    document.getElementById('pbTime').value = modalSlotTime;
    // document.getElementById('pbPrice').value = document.getElementById('calculatedPrice').innerText;
    document.getElementById('pbCustomerName').value = '';
    document.getElementById('pbCustomerPhone').value = '';
    document.getElementById('publicBookingModal').classList.remove('hidden');
}

// Submit yêu cầu lên server
async function submitPublicBooking(e) {
    e.preventDefault();

    const customerName = document.getElementById('pbCustomerName').value.trim();
    const customerPhone = document.getElementById('pbCustomerPhone').value.trim();

    // 2. Validate: Phải có chữ, không được rỗng hoặc chỉ có dấu cách
    if (customerName.length === 0) {
        alert("Vui lòng nhập tên của bạn để hệ thống ghi nhận nhé!");
        document.getElementById('pbCustomerName').focus();
        return;
    }

    // 3. Validate SDT: Phải là số và đủ 10 hoặc 11 số
    // Regex này kiểm tra: Chỉ chứa chữ số, bắt đầu bằng số 0, và tổng độ dài từ 10-11 ký tự
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/g;
    const simplePhoneRegex = /^[0-9]{10,11}$/;

    if (!simplePhoneRegex.test(customerPhone)) {
        alert("Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 hoặc 11 chữ số!");
        document.getElementById('pbCustomerPhone').focus();
        return;
    }

    const btn = document.getElementById('pbSubmitBtn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý...';
    btn.disabled = true;

    let selectedServices = [];
    document.querySelectorAll('#modalDynamicServices .service-checkbox:checked').forEach(cb => {
        const item = cb.closest('.service-item');
        const serviceId = parseInt(item.getAttribute('data-id'));
        const price = parseFloat(item.getAttribute('data-price'));

        const qty = parseInt(item.querySelector('.service-qty').value) || 1;

        selectedServices.push({
            service_id: serviceId,
            quantity: qty,
            unit_price: price
        });
    });

    const payload = {
        court_id: modalCourtInfo.id,
        booking_date: modalDateStr,
        start_time: modalSlotTime.split(' - ')[0],
        end_time: modalSlotTime.split(' - ')[1],
        customer_name: document.getElementById('pbCustomerName').value.trim(),
        customer_phone: document.getElementById('pbCustomerPhone').value.trim(),
        status: "booked",
        services: selectedServices
    };

    try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/bookings/public`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("🎉 Đặt sân thành công! Nhân viên sẽ liên hệ lại với bạn trong ít phút!");
            document.getElementById('publicBookingModal').classList.add('hidden');
            document.getElementById('publicBookingForm').reset();

            chatHistory = []; // Xóa trí nhớ chatbot sau khi đặt thành công

            if (isBookingFromAI) {
                // Hiển thị thông báo cảm ơn từ AI trên UI Chat
                const container = document.getElementById('chatMessages');
                const botDiv = document.createElement('div');
                botDiv.className = 'flex gap-2 items-start mb-2 mt-2';
                botDiv.innerHTML = `
                    <div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-[10px] shadow-sm"><i class="fa-solid fa-robot"></i></div>
                    <div class="bg-white p-3.5 rounded-2xl rounded-tl-none border border-emerald-200 text-slate-800 shadow-sm max-w-[85%] leading-relaxed">
                        Dạ, hệ thống đã ghi nhận đơn đặt sân thành công! Cảm ơn anh/chị <b>${customerName}</b> đã tin tưởng. Hẹn gặp anh/chị tại sân nhé! 🥰
                    </div>
                `;
                container.appendChild(botDiv);
                container.scrollTop = container.scrollHeight;

                // Đổi trạng thái Widget Đặt sân cũ thành "Đã hoàn tất"
                const actionDivs = document.querySelectorAll('#chatMessages .bg-emerald-50');
                if(actionDivs.length > 0) {
                     const lastAction = actionDivs[actionDivs.length - 1];
                     const button = lastAction.querySelector('button');
                     if(button) {
                          button.disabled = true;
                          button.className = "mt-3 w-full py-2.5 bg-slate-300 text-slate-500 font-bold rounded-xl shadow-inner cursor-not-allowed flex justify-center items-center gap-2";
                          button.innerHTML = '<i class="fa-solid fa-check"></i> Đã hoàn tất';
                     }
                }
            }

            if (!isBookingFromAI) {
                selectedSlotTime = null; // Chỉ xóa khung giờ hiển thị bên ngoài nếu khách đặt thủ công
                checkServiceAvailability();
            }

            // Tải lại lịch của ĐÚNG ngày đang xem và vẽ lại ma trận giờ
            await loadBookingsForDate(selectedDateStr);
            if (selectedCourtInfo) {
                renderPublicTimeSlots();
            }
        } else {
            alert("Rất tiếc, có người vừa nhanh tay hơn đặt khung giờ này. Vui lòng chọn giờ khác!");
        }
    } catch (error) {
        alert("Lỗi kết nối máy chủ, vui lòng gọi Hotline!");
    }

    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Gửi Yêu Cầu Đặt Sân';
    btn.disabled = false;
}

// Khởi chạy lấy data khi load xong trang
document.addEventListener("DOMContentLoaded", initPublicBooking);

// AI Chatbot
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
        document.getElementById('chatInput').focus();
    }
}

function sendQuickPrompt(promptText) {
    document.getElementById('chatInput').value = promptText;
    document.getElementById('chatForm').dispatchEvent(new Event('submit'));
}

// Kiểm tra đăng nhập (Auth)
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Lấy token từ Local hoặc Session
    const token = localStorage.getItem('elite_sport_token') || sessionStorage.getItem('elite_sport_token');
    const authBtn = document.getElementById('authActionBtn');

    if (token) {
        try {
            // 2. Gọi API để lấy thông tin User hiện tại (Xác thực token)
            const response = await fetch(`${CONFIG.API_BASE_URL}/users/me`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const user = await response.json();

                // 3. Nếu thành công, thay thế nút Đăng Nhập bằng Avatar & Nút vào Dashboard
                authBtn.outerHTML = `
                  <a href="/admin/schedule.html" class="px-3.5 py-1.5 text-sm font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition flex items-center gap-2 border border-emerald-200 shadow-sm">
                    <div class="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs overflow-hidden">
                      <i class="fa-solid fa-user-tie"></i>
                    </div>
                    <span>${user.full_name || user.username}</span>
                    <i class="fa-solid fa-arrow-right-to-bracket ml-1 text-emerald-600"></i>
                  </a>
                `;
            } else {
                // 4. Nếu Token hết hạn hoặc không hợp lệ -> Xóa token rác đi
                localStorage.removeItem('elite_sport_token');
                sessionStorage.removeItem('elite_sport_token');
            }
        } catch (error) {
          console.error("Không thể kết nối đến máy chủ xác thực:", error);
        }
    }
});

let chatHistory = []; // để lưu trí nhó cho bot (Ví dụ: Tôi muốn đặt sân bóng đá -> mấy h -> 17h -> Bạn muốn đặt sân nào lúc 17h)

async function handleChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('chatInput');
    const userText = input.value.trim();
    if (!userText) return;

    const container = document.getElementById('chatMessages');
    const submitBtn = document.querySelector('#chatForm button[type="submit"]');

    // Hiển thị tin nhắn User lên UI
    const userMsg = document.createElement('div');
    userMsg.className = 'flex justify-end mb-2';
    userMsg.innerHTML = `<div class="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] font-medium">${userText}</div>`;
    container.appendChild(userMsg);
    input.value = '';
    container.scrollTop = container.scrollHeight;

    // 2. Lưu câu nói của khách vào lịch sử
    chatHistory.push(`Khách hàng: ${userText}`);

    // Giữ lại 6 câu gần nhất để prompt không bị quá dài
    if (chatHistory.length > 6) {
        chatHistory.shift();
    }

    // 3. Tạo câu hỏi mới gồm cả quá khứ lẫn hiện tại
    const messageWithMemory = chatHistory.join('\n') + '\nTrợ lý AI trả lời:';

    // Hiện trạng thái Bot đang "suy nghĩ"
    if (submitBtn) submitBtn.disabled = true;
    const botDiv = document.createElement('div');
    botDiv.className = 'flex gap-2 items-start mb-2';
    const textSpan = document.createElement('div');
    textSpan.className = 'bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 text-slate-800 shadow-sm max-w-[85%] leading-relaxed typing-cursor text-slate-400';
    textSpan.innerHTML = 'Đang phân tích...';

    botDiv.innerHTML = `<div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-[10px] shadow-sm"><i class="fa-solid fa-robot"></i></div>`;
    botDiv.appendChild(textSpan);
    container.appendChild(botDiv);
    container.scrollTop = container.scrollHeight;

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/ai-assistant/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // Gửi nguyên cái cục lịch sử này lên cho Backend
                message: messageWithMemory
            })
        });

        if (response.ok) {
            const result = await response.json();
            if (result.data.intent === 'search_available_court' && result.data.sport_type) {
                let keyword = result.data.sport_type.toLowerCase();
                if (keyword.includes('bóng') || keyword.includes('banh') || keyword.includes('đá')) keyword = 'bóng đá';
                else if (keyword.includes('pickle')) keyword = 'pickleball';
                else if (keyword.includes('cầu')) keyword = 'cầu lông';

                const targetCourts = systemCourts.filter(c => c.type.toLowerCase().includes(keyword));

                // Nếu không có môn này, bắt buộc chatbot phải nói câu từ chối!
                if (targetCourts.length === 0) {
                    const availableTypes = [...new Set(systemCourts.map(c => c.type))].join(', ');

                    result.data.reply = `Dạ rất tiếc, hiện tại hệ thống của em chưa có sân cho môn ${result.data.sport_type}. Trung tâm em hiện đang mở hoạt động các sân: ${availableTypes} ạ!`;
                    // Đổi intent thành 'unknown' để tí nữa hàm processAIActions không chạy nữa
                    result.data.intent = 'unknown';
                }
            }

            const reply = result.data.reply;

            // 4. Lưu câu trả lời của AI vào lịch sử
            chatHistory.push(`Trợ lý AI: ${reply}`);

            textSpan.innerHTML = '';
            textSpan.classList.remove('text-slate-400');

            let i = 0;
            const interval = setInterval(() => {
                if (i < reply.length) {
                    const char = reply.charAt(i) === '\n' ? '<br>' : reply.charAt(i);
                    textSpan.innerHTML += char;
                    i++;
                    container.scrollTop = container.scrollHeight;
                } else {
                    textSpan.classList.remove('typing-cursor');
                    clearInterval(interval);
                    if (submitBtn) submitBtn.disabled = false;

                    processAIActions(result.data);
                }
            }, 15);

            console.log("Dữ liệu Gemini bóc tách được:", result.data);

        } else {
            const errorData = await response.json();
            textSpan.innerHTML = `Lỗi hệ thống: ${errorData.detail || 'Vui lòng thử lại sau!'}`;
            textSpan.classList.remove('typing-cursor');
            if (submitBtn) submitBtn.disabled = false;
        }
    } catch (error) {
        textSpan.innerHTML = "Lỗi mất kết nối mạng. Backend chưa chạy?";
        textSpan.classList.remove('typing-cursor');
        if (submitBtn) submitBtn.disabled = false;
    }
}

// Xử lý dữ liệu chatbot trả về
async function processAIActions(aiData) {
    const container = document.getElementById('chatMessages');

    // Nếu có môn này thì Nếu AI xác định được ý định là TÌM SÂN và đã thu thập đủ NGÀY + GIỜ
    if (aiData.intent === 'search_available_court' && aiData.booking_date && aiData.start_time && aiData.end_time &&
        (!aiData.missing_fields || aiData.missing_fields.length === 0)) {
        // 1. Chuẩn hóa tên môn thể thao
        let keyword = aiData.sport_type ? aiData.sport_type.toLowerCase() : '';
        if (keyword.includes('bóng') || keyword.includes('banh') || keyword.includes('đá')) keyword = 'bóng đá';
        else if (keyword.includes('pickle')) keyword = 'pickleball';
        else if (keyword.includes('cầu')) keyword = 'cầu lông';

        const targetCourts = systemCourts.filter(c => c.type.toLowerCase().includes(keyword));
        if (targetCourts.length === 0) {
            const actionDiv = document.createElement('div');
            actionDiv.className = 'flex gap-2 items-start mb-2 mt-2';
            actionDiv.innerHTML = `
                <div class="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 text-[10px] shadow-sm"><i class="fa-solid fa-circle-xmark"></i></div>
                <div class="bg-red-50 border border-red-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-[13px] text-slate-700 max-w-[85%]">
                    Dạ rất tiếc, hiện tại hệ thống chưa có dữ liệu hoặc chưa mở đặt lịch cho môn <b>${aiData.sport_type}</b>. Anh/chị vui lòng thử môn khác hoặc liên hệ hotline giúp em nhé ạ!
                </div>
            `;
            container.appendChild(actionDiv);
            container.scrollTop = container.scrollHeight;
            chatHistory.push(`Hệ thống: Từ chối vì không có sân cho môn ${aiData.sport_type}.`);

            return;
        }

        // 2. Fetch lịch của ngày AI bóc tách được từ DB
        let bookedData = [];
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/bookings/schedule?date=${aiData.booking_date}`);
            if (res.ok) bookedData = await res.json();
        } catch (e) {}

        // 3. Tìm 1 sân ĐANG TRỐNG
        let startHour = parseInt(aiData.start_time.split(':')[0]);
        let endHour = aiData.end_time ? parseInt(aiData.end_time.split(':')[0]) : startHour + 1;

        if (startHour < 6 || endHour > 22) {
            const actionDiv = document.createElement('div');
            actionDiv.className = 'flex gap-2 items-start mb-2 mt-2';
            actionDiv.innerHTML = `
                <div class="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 text-[10px] shadow-sm"><i class="fa-solid fa-clock"></i></div>
                <div class="bg-red-50 border border-red-200 p-3.5 rounded-2xl rounded-tl-none shadow-sm text-[13px] text-slate-700 max-w-[85%]">
                    Dạ, trung tâm Elite Sport chỉ mở cửa hoạt động từ <b>06:00 sáng đến 22:00 đêm</b>. Anh/chị vui lòng chọn khung giờ trong khoảng thời gian này giúp em nhé ạ!
                </div>
            `;
            container.appendChild(actionDiv);
            container.scrollTop = container.scrollHeight;
            chatHistory.push(`Hệ thống: Từ chối vì giờ đặt (${startHour}h-${endHour}h) ngoài giờ hoạt động.`);
            return;
        }

        let totalHours = endHour - startHour; // Tính tổng số giờ
        let finalEndTime = `${String(endHour).padStart(2, '0')}:00`;

        // Chặn đặt sân trong quá khứ
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        // Nếu khách đang đặt sân cho ngày hôm nay
        if (aiData.booking_date === todayStr) {
            const currentHour = now.getHours();
            // Nếu giờ bắt đầu nhỏ hơn hoặc bằng giờ hiện tại -> Báo lỗi "Giờ đã qua"
            if (startHour <= currentHour) {
                const actionDiv = document.createElement('div');
                actionDiv.className = 'flex gap-2 items-start mb-2 mt-2';
                actionDiv.innerHTML = `
                    <div class="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 text-[10px] shadow-sm"><i class="fa-solid fa-hourglass-end"></i></div>
                    <div class="bg-red-50 border border-red-200 p-3.5 rounded-2xl rounded-tl-none shadow-sm text-[13px] text-slate-700 max-w-[85%]">
                        Dạ, khung giờ từ <b>${aiData.start_time} đến ${finalEndTime}</b> của ngày hôm nay đã trôi qua mất rồi ạ. Bây giờ đang là ${currentHour}h${String(now.getMinutes()).padStart(2, '0')}, anh/chị vui lòng chọn khung giờ trong tương lai hoặc đặt sang ngày mai giúp em nhé!
                    </div>
                `;
                container.appendChild(actionDiv);
                container.scrollTop = container.scrollHeight;
                chatHistory.push(`Hệ thống: Từ chối vì giờ đặt (${startHour}h) đã qua trong ngày hôm nay.`);
                return;
            }
        }

        let availableCourt = null;
        for (let court of targetCourts) {
            let isFree = true;

            // Quét kiểm tra từng block 1 giờ (VD: 18h tới 20h sẽ quét check 18:00 và 19:00)
            for (let h = startHour; h < endHour; h++) {
                const checkTime = `${String(h).padStart(2, '0')}:00`;

                const isBooked = bookedData.some(b => {
                    if (b.court_id !== court.id || b.status === 'canceled' || b.status === 'cancelled') return false;
                    // Cắt lấy 5 ký tự đầu (Ví dụ "18:00:00" -> "18:00")
                    const bStart = b.start_time.slice(0, 5);
                    const bEnd = b.end_time.slice(0, 5);
                    // Bị kẹt nếu giờ đang check (checkTime) nằm bên trong khoảng giờ của đơn khác
                    return checkTime >= bStart && checkTime < bEnd;
                });

                if (isBooked) {
                    isFree = false;
                    break;
                }
            }

            if (isFree) {
                availableCourt = court;
                break;
            }
        }

        // 4. In Widget "Hành động" ra khung Chat
        const actionDiv = document.createElement('div');
        actionDiv.className = 'flex gap-2 items-start mb-2 mt-2';

        if (availableCourt) {
            const totalPrice = availableCourt.price_per_hour * totalHours;

            actionDiv.innerHTML = `
                    <div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-[10px] shadow-sm"><i class="fa-solid fa-bolt"></i></div>
                    <div class="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl rounded-tl-none shadow-sm text-[13px] text-slate-700 max-w-[85%]">
                        🎉 Trùng hợp quá! Thấy <b>${availableCourt.name}</b> đang trống từ <b>${aiData.start_time} đến ${finalEndTime}</b> ngày <b>${formatDateToVN(aiData.booking_date)}</b>.<br>
                        💰 Giá thuê (${totalHours} giờ): <span class="text-red-500 font-extrabold">${totalPrice.toLocaleString('vi-VN')}đ</span><br>
                        
                        <!-- Truyền thêm tham số totalHours vào hàm -->
                        <button onclick="triggerAIBooking(${availableCourt.id}, '${availableCourt.name}', ${availableCourt.price_per_hour}, '${aiData.booking_date}', '${aiData.start_time}', '${finalEndTime}', ${totalHours})" 
                                class="mt-3 w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-500 hover:scale-[1.02] transition-all flex justify-center items-center gap-2">
                            <i class="fa-solid fa-check-circle"></i> Đặt Sân Này Luôn
                        </button>
                    </div>
                `;
                chatHistory.push(`Hệ thống: Đã tìm thấy ${availableCourt.name} trống.`);
        } else {
            // Báo hết sân
            actionDiv.innerHTML = `
                <div class="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 text-[10px] shadow-sm"><i class="fa-solid fa-circle-exclamation"></i></div>
                <div class="bg-red-50 border border-red-200 p-3 rounded-2xl rounded-tl-none shadow-sm text-slate-800 max-w-[85%]">
                    Dạ rất tiếc, hiện tại không có sân nào trống xuyên suốt từ <b>${aiData.start_time} đến ${finalEndTime}</b> mất rồi. Anh/chị có thể đổi khung giờ hoặc đặt ngắn lại (ví dụ 1 tiếng) giúp em nhé ạ!
                </div>
            `;
            chatHistory.push(`Hệ thống: Báo hết sân khung giờ này.`);
        }
        container.appendChild(actionDiv);
        container.scrollTop = container.scrollHeight;
    }
}

// KH bấm từ Widget của Chatbot
function triggerAIBooking(courtId, courtName, price, dateStr, startTime, endTime, hours) {
    const aiBookingData = {
        courtId: parseInt(courtId),
        courtName: courtName,
        price: parseFloat(price),
        dateStr: dateStr,
        slotTime: `${startTime} - ${endTime}`,
        hours: hours
    };

    openPublicBookingModal(true, aiBookingData);
}

function handleServiceChange(checkbox) {
    const item = checkbox.closest('.service-item');
    const qtyControl = item.querySelector('.qty-control');

    if (checkbox.checked) {
        qtyControl.classList.remove('hidden');
        qtyControl.classList.add('flex'); // Trải bộ đếm ra
        item.classList.add('border-emerald-400', 'bg-emerald-50/30');
    } else {
        qtyControl.classList.add('hidden');
        qtyControl.classList.remove('flex');
        item.classList.remove('border-emerald-400', 'bg-emerald-50/30');
        item.querySelector('.service-qty').value = 1; // Khách bỏ tick thì reset số lượng về 1
    }

    if (checkbox.closest('#modalDynamicServices')) {
        calcPopupTotal();
    } else {
        calcTotal();
    }
}

function changeQty(btn, delta) {
    const input = btn.parentElement.querySelector('.service-qty');
    let newVal = parseInt(input.value) + delta;
    if (newVal < 1) newVal = 1;
    if (newVal > 50) newVal = 50;
    input.value = newVal;

    if (btn.closest('#modalDynamicServices')) { calcPopupTotal(); }
    else { calcTotal(); }
}

function handleQtyInput(input) {
    let val = parseInt(input.value);
    if (isNaN(val) || val < 1) input.value = 1;
    if (val > 50) input.value = 50;

    if (input.closest('#modalDynamicServices')) { calcPopupTotal(); }
    else { calcTotal(); }
}

function checkServiceAvailability() {
    const checkboxes = document.querySelectorAll('#dynamicServices .service-checkbox');
    const hasSelectedSlot = !!selectedSlotTime; // Ép kiểu về boolean xem đã chọn giờ chưa

    checkboxes.forEach(cb => {
        // Khóa checkbox nếu chưa chọn giờ, mở khóa nếu đã chọn
        cb.disabled = !hasSelectedSlot;
        const item = cb.closest('.service-item');

        if (!hasSelectedSlot) {
            item.classList.add('opacity-50', 'cursor-not-allowed', 'bg-slate-50');
            cb.classList.add('cursor-not-allowed');
            if (cb.checked) {
                cb.checked = false;
                handleServiceChange(cb); // Ép ẩn số lượng
            }
        } else {
            item.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-slate-50');
            cb.classList.remove('cursor-not-allowed');
        }
    });

    // Gọi tính lại tiền sau khi đã khóa/mở khóa
    calcTotal();
}

function scrollToBooking(sportType) {
    if (sportType === 'football') {
        switchSportMode('football', 0, 'Bóng Đá');
    } else if (sportType === 'pickleball') {
        switchSportMode('pickleball', 0, 'Pickleball');
    } else if (sportType === 'badminton') {
        switchSportMode('badminton', 0, 'Cầu Lông');
    }

    const targetSection = document.getElementById('about');

    if (targetSection) {
        const offsetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - 80;

        window.scrollTo({
            top: offsetPosition + 300,
            behavior: "smooth"
        });
    }
}