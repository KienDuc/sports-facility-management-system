const API_URL = `${CONFIG.API_BASE_URL}/auth/login`;

// 1. Ẩn / Hiện mật khẩu (Giữ nguyên của bạn)
function togglePasswordVisibility() {
  const pass = document.getElementById('passwordInput');
  const icon = document.getElementById('eyeIcon');
  if (pass.type === 'password') {
    pass.type = 'text';
    icon.className = 'fa-regular fa-eye-slash';
  } else {
    pass.type = 'password';
    icon.className = 'fa-regular fa-eye';
  }
}

// 2. Nếu có Token rồi thì tự vô trang trong, không cần đăng nhập lại
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('elite_sport_token') || sessionStorage.getItem('elite_sport_token');

  if (token) {
    window.location.href = 'schedule.html';
  }
});

// 3. Xử lý gọi API Login
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault(); // Chặn tải lại trang

  const errorMsg = document.getElementById('errorMessage');
  const submitBtn = document.getElementById('submitBtn');
  const rememberMe = document.getElementById('rememberMe').checked;

  // Ẩn thông báo lỗi cũ, đổi trạng thái nút thành loading
  errorMsg.classList.add('hidden');
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xác thực...';
  submitBtn.disabled = true;

  // Lấy dữ liệu và ép kiểu sang URL-encoded (Bắt buộc cho FastAPI OAuth2)
  const formData = new FormData(this);
  const urlEncodedData = new URLSearchParams(formData);

  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: urlEncodedData
    });

    const result = await response.json();

    if (response.ok) {
      // Lưu token
      if (rememberMe) {
        localStorage.setItem('elite_sport_token', result.access_token);
      } else {
        sessionStorage.setItem('elite_sport_token', result.access_token);
      }

      // Chuyển hướng thành công
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Thành công!';
      setTimeout(() => {
        window.location.href = 'schedule.html';
      }, 500);

    } else {
      // Hiện lỗi
      errorMsg.textContent = result.detail || "Tài khoản hoặc mật khẩu không chính xác!";
      errorMsg.classList.remove('hidden');
      resetButton();
    }
  } catch (error) {
    errorMsg.textContent = "Lỗi kết nối máy chủ! Vui lòng thử lại sau.";
    errorMsg.classList.remove('hidden');
    resetButton();
  }

  function resetButton() {
    submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Đăng Nhập';
    submitBtn.disabled = false;
  }
});