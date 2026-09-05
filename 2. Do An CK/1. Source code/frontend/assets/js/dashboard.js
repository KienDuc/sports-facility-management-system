const API_URL = `${CONFIG.API_BASE_URL}/users/me`;

// 1. Initialize AOS
AOS.init({
  duration: 700,
  once: true,
  easing: 'ease-out-cubic'
});

// // 2. INTERACTIVE PARTICLES CANVAS SYSTEM
// const canvas = document.getElementById('particleCanvas');
// const ctx = canvas.getContext('2d');
// let particlesArray = [];
// let mouse = { x: null, y: null, radius: 140 };
//
// function resizeCanvas() {
//   canvas.width = canvas.parentElement.offsetWidth;
//   canvas.height = canvas.parentElement.offsetHeight;
// }
// resizeCanvas();
// window.addEventListener('resize', resizeCanvas);
//
// window.addEventListener('mousemove', (e) => {
//   const rect = canvas.getBoundingClientRect();
//   mouse.x = e.clientX - rect.left;
//   mouse.y = e.clientY - rect.top;
// });
//
// class Particle {
//   constructor() {
//     this.x = Math.random() * canvas.width;
//     this.y = Math.random() * canvas.height;
//     this.size = Math.random() * 2 + 1;
//     this.speedX = (Math.random() - 0.5) * 1.2;
//     this.speedY = (Math.random() - 0.5) * 1.2;
//   }
//   update() {
//     this.x += this.speedX;
//     this.y += this.speedY;
//
//     if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
//     if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
//
//     // Interaction with mouse
//     let dx = mouse.x - this.x;
//     let dy = mouse.y - this.y;
//     let distance = Math.sqrt(dx * dx + dy * dy);
//     if (distance < mouse.radius) {
//       this.x -= (dx / distance) * 2;
//       this.y -= (dy / distance) * 2;
//     }
//   }
//   draw() {
//     ctx.fillStyle = 'rgba(52, 211, 153, 0.7)';
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//     ctx.fill();
//   }
// }
//
// function initParticles() {
//   particlesArray = [];
//   const numParticles = Math.floor((canvas.width * canvas.height) / 9000);
//   for (let i = 0; i < numParticles; i++) {
//     particlesArray.push(new Particle());
//   }
// }
// initParticles();
//
// function animateParticles() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//   for (let i = 0; i < particlesArray.length; i++) {
//     particlesArray[i].update();
//     particlesArray[i].draw();
//
//     for (let j = i; j < particlesArray.length; j++) {
//       let dx = particlesArray[i].x - particlesArray[j].x;
//       let dy = particlesArray[i].y - particlesArray[j].y;
//       let distance = Math.sqrt(dx * dx + dy * dy);
//       if (distance < 90) {
//         ctx.beginPath();
//         ctx.strokeStyle = `rgba(16, 185, 129, ${0.25 - distance / 360})`;
//         ctx.lineWidth = 0.8;
//         ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
//         ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
//         ctx.stroke();
//       }
//     }
//   }
//   requestAnimationFrame(animateParticles);
// }
// animateParticles();

// --- 2. HIỆU ỨNG CANVAS TƯƠNG TÁC (CANVA STYLE NETWORK) ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -1000, y: -1000, active: false };

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

// --- 3. ĐỔI MÀU NỀN & TRANG BỊ MÔN THỂ THAO ---
let sportRate = 250000;
let slotHours = 1.5;
let addonPrice = 120000;
const heroSection = document.getElementById('about');

function switchSportMode(type, rate, label) {
  sportRate = rate;
  document.getElementById('liveSportBadge').innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ${label}`;

  const title = document.getElementById('pitchTypeTitle');
  const equip = document.getElementById('robotEquipment');
  const ball = document.getElementById('projectedBall');
  const visor = document.getElementById('robotVisor');
  const svgPitch = document.getElementById('pitchSvg');

  document.querySelectorAll('.sport-tab-btn').forEach(b => {
    b.className = 'sport-tab-btn p-3 rounded-2xl border-2 border-slate-200 bg-white/70 text-slate-600 hover:border-emerald-400 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all';
  });

  heroSection.classList.remove('theme-football', 'theme-pickleball', 'theme-badminton');

  if (type === 'football') {
    document.getElementById('tab-football').className = 'sport-tab-btn active p-3 rounded-2xl border-2 border-emerald-500 bg-emerald-50 text-emerald-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md';
    title.innerHTML = '<i class="fa-solid fa-futbol text-emerald-400 mr-1"></i> Mô Phỏng Mặt Sân Bóng Đá';
    heroSection.classList.add('theme-football');

    ball.innerText = '⚽';
    visor.setAttribute('fill', '#10b981');
    visor.className.baseVal = "visor-glow text-emerald-400";
    equip.innerHTML = `<circle cx="60" cy="112" r="10" fill="white" stroke="#475569" stroke-width="2"/>`;
    svgPitch.innerHTML = `
      <rect x="10" y="10" width="280" height="130" fill="none" stroke="#34d399" stroke-width="2"/>
      <line x1="150" y1="10" x2="150" y2="140" stroke="#34d399" stroke-width="1.5"/>
      <circle cx="150" cy="75" r="28" fill="none" stroke="#34d399" stroke-width="1.5"/>
      <rect x="10" y="40" width="35" height="70" fill="none" stroke="#34d399" stroke-width="1.5"/>
      <rect x="255" y="40" width="35" height="70" fill="none" stroke="#34d399" stroke-width="1.5"/>
    `;

  } else if (type === 'pickleball') {
    document.getElementById('tab-pickleball').className = 'sport-tab-btn active p-3 rounded-2xl border-2 border-cyan-500 bg-cyan-50 text-cyan-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md';
    title.innerHTML = '<i class="fa-solid fa-table-tennis-paddle-ball text-cyan-400 mr-1"></i> Mô Phỏng Mặt Sân PickleBall';
    heroSection.classList.add('theme-pickleball');

    ball.innerText = '🟡';
    visor.setAttribute('fill', '#06b6d4');
    visor.className.baseVal = "visor-glow text-cyan-400";
    equip.innerHTML = `
      <rect x="78" y="70" width="18" height="26" rx="6" fill="#06b6d4" stroke="white" stroke-width="2"/>
      <line x1="87" y1="96" x2="87" y2="108" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
    `;
    svgPitch.innerHTML = `
      <rect x="20" y="15" width="260" height="120" fill="none" stroke="#22d3ee" stroke-width="2"/>
      <line x1="150" y1="15" x2="150" y2="135" stroke="#06b6d4" stroke-width="2"/>
      <rect x="105" y="15" width="90" height="120" fill="rgba(6, 182, 212, 0.15)" stroke="#22d3ee" stroke-width="1"/>
      <line x1="20" y1="75" x2="105" y2="75" stroke="#22d3ee" stroke-width="1"/>
      <line x1="195" y1="75" x2="280" y2="75" stroke="#22d3ee" stroke-width="1"/>
    `;

  } else if (type === 'badminton') {
    document.getElementById('tab-badminton').className = 'sport-tab-btn active p-3 rounded-2xl border-2 border-violet-500 bg-violet-50 text-violet-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md';
    title.innerHTML = '<i class="fa-solid fa-feather text-violet-400 mr-1"></i> Mô Phỏng Mặt Sân Cầu Lông';
    heroSection.classList.add('theme-badminton');

    ball.innerText = '🏸';
    visor.setAttribute('fill', '#8b5cf6');
    visor.className.baseVal = "visor-glow text-violet-400";
    equip.innerHTML = `
      <ellipse cx="86" cy="72" rx="10" ry="14" fill="none" stroke="#8b5cf6" stroke-width="2.5"/>
      <line x1="86" y1="86" x2="86" y2="108" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>
    `;
    svgPitch.innerHTML = `
      <rect x="20" y="15" width="260" height="120" fill="none" stroke="#a78bfa" stroke-width="2"/>
      <line x1="150" y1="15" x2="150" y2="135" stroke="#8b5cf6" stroke-width="2"/>
      <line x1="35" y1="15" x2="35" y2="135" stroke="#a78bfa" stroke-width="1"/>
      <line x1="265" y1="15" x2="265" y2="135" stroke="#a78bfa" stroke-width="1"/>
      <line x1="20" y1="75" x2="280" y2="75" stroke="#a78bfa" stroke-width="1"/>
    `;
  }
  calcTotal();
}

function selectSlot(btn, hours) {
  slotHours = hours;
  document.querySelectorAll('.slot-pill').forEach(b => {
    b.className = 'slot-pill p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-600 hover:border-emerald-500 hover:text-emerald-700 transition-all';
  });
  btn.className = 'slot-pill active p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 font-bold text-emerald-800 transition-all shadow-sm';
  calcTotal();
}

function toggleAddon(price, checked) {
  addonPrice = checked ? price : 0;
  calcTotal();
}

function calcTotal() {
  const total = (sportRate * slotHours) + addonPrice;
  document.getElementById('calculatedPrice').innerHTML = `${total.toLocaleString('vi-VN')} <span class="text-xs font-medium text-emerald-400">VNĐ</span>`;
}
// // 3. 2D PITCH & LIVE ESTIMATION LOGIC
// let sportRate = 250000;
// let slotHours = 1.5;
// let addonPrice = 120000;
//
// function changeSport(type, rate, label) {
//   sportRate = rate;
//   document.getElementById('liveSportBadge').innerText = label;
//
//   const pitch = document.getElementById('interactivePitch');
//   const svg = document.getElementById('pitchSvg');
//   const icon = document.getElementById('ballIcon');
//
//   document.querySelectorAll('.sport-tab-btn').forEach(b => {
//     b.className = 'sport-tab-btn p-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition';
//   });
//
//   if (type === 'football') {
//     document.getElementById('tab-football').className = 'sport-tab-btn active p-3 rounded-2xl border-2 border-emerald-600 bg-emerald-50 text-emerald-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm';
//     pitch.className = 'w-full h-44 rounded-xl border-2 border-emerald-500/40 bg-emerald-950/80 relative overflow-hidden flex items-center justify-center cursor-pointer shadow-inner transition-all duration-500';
//     icon.className = 'fa-solid fa-futbol text-xs text-slate-900';
//     svg.innerHTML = `
//       <rect x="10" y="10" width="280" height="130" fill="none" stroke="white" stroke-width="2"/>
//       <line x1="150" y1="10" x2="150" y2="140" stroke="white" stroke-width="2"/>
//       <circle cx="150" cy="75" r="28" fill="none" stroke="white" stroke-width="2"/>
//       <rect x="10" y="40" width="35" height="70" fill="none" stroke="white" stroke-width="2"/>
//       <rect x="255" y="40" width="35" height="70" fill="none" stroke="white" stroke-width="2"/>
//     `;
//   } else if (type === 'pickleball') {
//     document.getElementById('tab-pickleball').className = 'sport-tab-btn active p-3 rounded-2xl border-2 border-teal-600 bg-teal-50 text-teal-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm';
//     pitch.className = 'w-full h-44 rounded-xl border-2 border-teal-500/40 bg-teal-950/90 relative overflow-hidden flex items-center justify-center cursor-pointer shadow-inner transition-all duration-500';
//     icon.className = 'fa-solid fa-table-tennis-paddle-ball text-xs text-teal-700';
//     svg.innerHTML = `
//       <rect x="20" y="15" width="260" height="120" fill="none" stroke="white" stroke-width="2"/>
//       <line x1="150" y1="15" x2="150" y2="135" stroke="#38bdf8" stroke-width="3"/>
//       <rect x="105" y="15" width="90" height="120" fill="rgba(56, 189, 248, 0.15)" stroke="white" stroke-width="1.5"/>
//       <line x1="20" y1="75" x2="105" y2="75" stroke="white" stroke-width="1.5"/>
//       <line x1="195" y1="75" x2="280" y2="75" stroke="white" stroke-width="1.5"/>
//     `;
//   } else if (type === 'badminton') {
//     document.getElementById('tab-badminton').className = 'sport-tab-btn active p-3 rounded-2xl border-2 border-blue-600 bg-blue-50 text-blue-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm';
//     pitch.className = 'w-full h-44 rounded-xl border-2 border-blue-500/40 bg-blue-950/90 relative overflow-hidden flex items-center justify-center cursor-pointer shadow-inner transition-all duration-500';
//     icon.className = 'fa-solid fa-feather text-xs text-blue-700';
//     svg.innerHTML = `
//       <rect x="20" y="15" width="260" height="120" fill="none" stroke="white" stroke-width="2"/>
//       <line x1="150" y1="15" x2="150" y2="135" stroke="white" stroke-width="3"/>
//       <line x1="35" y1="15" x2="35" y2="135" stroke="white" stroke-width="1.5"/>
//       <line x1="265" y1="15" x2="265" y2="135" stroke="white" stroke-width="1.5"/>
//       <line x1="20" y1="75" x2="280" y2="75" stroke="white" stroke-width="1"/>
//     `;
//   }
//   calcTotal();
// }
//
// function kickBall() {
//   const ball = document.getElementById('ballElement');
//   const randomX = Math.floor(Math.random() * 70) + 15;
//   const randomY = Math.floor(Math.random() * 55) + 20;
//   ball.style.left = `${randomX}%`;
//   ball.style.top = `${randomY}%`;
//   ball.style.transform = `scale(1.25) rotate(${Math.random() * 360}deg)`;
//   setTimeout(() => {
//     ball.style.transform = `scale(1) rotate(0deg)`;
//   }, 350);
// }
//
// function selectSlot(btn, hours) {
//   slotHours = hours;
//   document.querySelectorAll('.slot-pill').forEach(b => {
//     b.className = 'slot-pill p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 hover:border-emerald-500 transition';
//   });
//   btn.className = 'slot-pill active p-2.5 rounded-xl border-2 border-emerald-600 bg-emerald-50 font-bold text-emerald-800 transition';
//   calcTotal();
// }
//
// function toggleAddon(price, checked) {
//   addonPrice = checked ? price : 0;
//   calcTotal();
// }
//
// function calcTotal() {
//   const total = (sportRate * slotHours) + addonPrice;
//   document.getElementById('calculatedPrice').innerHTML = `${total.toLocaleString('vi-VN')} <span class="text-xs font-bold text-emerald-400">VNĐ</span>`;
// }

// 4. AI CHATBOT
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

async function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('chatInput');
  const userText = input.value.trim();
  if (!userText) return;

  const container = document.getElementById('chatMessages');

  // User message
  const userMsg = document.createElement('div');
  userMsg.className = 'flex justify-end';
  userMsg.innerHTML = `<div class="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] font-medium">${userText}</div>`;
  container.appendChild(userMsg);
  input.value = '';
  container.scrollTop = container.scrollHeight;

  // Bot typing message
  const botDiv = document.createElement('div');
  botDiv.className = 'flex gap-2 items-start';
  const textSpan = document.createElement('div');
  textSpan.className = 'bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 text-slate-800 shadow-sm max-w-[85%] leading-relaxed typing-cursor';

  botDiv.innerHTML = `<div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-[10px] shadow-sm"><i class="fa-solid fa-robot"></i></div>`;
  botDiv.appendChild(textSpan);
  container.appendChild(botDiv);
  container.scrollTop = container.scrollHeight;

  const reply = `Hệ thống vừa kiểm tra câu hỏi "${userText}": Hiện tại sân vẫn còn slot trống sau 18:00 hôm nay. Bạn có thể nhấn nút "Đặt Sân Nhanh" phía trên để hoàn tất giữ chỗ nhé!`;
  let i = 0;
  const interval = setInterval(() => {
    if (i < reply.length) {
      textSpan.textContent += reply.charAt(i);
      i++;
      container.scrollTop = container.scrollHeight;
    } else {
      textSpan.classList.remove('typing-cursor');
      clearInterval(interval);
    }
  }, 20);
}

// --- 5. KIỂM TRA ĐĂNG NHẬP (AUTH CHECK) ---
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Lấy token từ Local hoặc Session
    debugger;
  const token = localStorage.getItem('elite_sport_token') || sessionStorage.getItem('elite_sport_token');
  const authBtn = document.getElementById('authActionBtn');

  if (token) {
    try {
      // 2. Gọi API để lấy thông tin User hiện tại (Xác thực token)
      const response = await fetch(`${API_URL}`, {
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