<div align="center">

  # ⚽ HỆ THỐNG QUẢN LÝ ĐẶT SÂN THỂ THAO (SFMS) 🏸
  
  **Sports Field Management System**

  [![Python](https://img.shields.io/badge/Language-Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](#)
  [![Group](https://img.shields.io/badge/Group-Nhóm%2013-orange?style=for-the-badge)](#)
  [![Status](https://img.shields.io/badge/Status-In%20Progress-green?style=for-the-badge)](#)

  <p align="center">
    Repository lưu trữ bài tập tuần và đồ án cuối khóa môn học.
  </p>

</div>

---

## 📌 Giới Thiệu Dự Án

**SFMS (Sports Field Management System)** là hệ thống quản lý đặt sân thể thao được phát triển nhằm tối ưu hóa quy trình đặt sân, quản lý lịch trình và thông tin sân bãi một cách thuận tiện, chính xác và dễ dàng.

---

## 👥 Danh Sách Thành Viên (Nhóm 13)

| STT | MSSV | Họ và Tên | Vai Trò |
| :-: | :---: | :--- | :--- |
| **1** | `25410189` | **Lý Kiến Đức** | Nhóm trưởng |
| **2** | `24410360` | Trần Quỳnh Tiền | Thành viên |
| **3** | `25410185` | Nguyễn Phong Đạt | Thành viên |
| **4** | `25410186` | Nguyễn Tấn Đạt | Thành viên |
| **5** | `25410172` | Nguyễn Hồng Anh | Thành viên |

---

## 📁 Cấu Trúc Thư Mục

Dự án được tổ chức cấu trúc thư mục như sau:

```text
.
├── 📂 1. Bai tap tuan - nhom/       # Nội dung các bài tập tuần làm theo nhóm
│   ├── 📂 1. Buoi 3/               # Bài tập buổi số 3
│   ├── 📂 2. Buoi 4/               # (Ví dụ) Bài tập buổi số 4
│   └── ...
│
└── 📂 2. Do An CK/                  # Nội dung và mã nguồn thực hiện đồ án cuối khóa
    ├── 📂 docs/                    # Tài liệu đồ án (Báo cáo, Slide,...)
    ├── 📂 src/                     # Source code chính của hệ thống
    └── main.py                     # File chạy chính
```

---

## 🛠️ Công Nghệ Sử Dụng

* **Ngôn ngữ lập trình:** 
  ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

```bash
# 1. Clone repository về máy
git clone [https://github.com/username/ten-repository.git](https://github.com/username/ten-repository.git)

# 2. Di chuyển vào thư mục dự án
cd ten-repository

# 3. Chạy chương trình
python main.py
```

---
---

## 🚀 Quy Tắc Làm Việc Theo Nhánh (Branching Strategy)

Để đảm bảo mã nguồn không bị xung đột (conflict) và dễ quản lý, nhóm áp dụng quy tắc phân nhánh như sau:

### 📌 1. Quy chuẩn đặt tên nhánh
Tên nhánh được đặt theo cấu trúc:  
`<MSSV>/<ten-chuc-nang-viet-thuong-khong-dau>`

**Ví dụ:**
```bash
25410189/trang-dang-nhap
24410360/trang-chu
2541xxxx/quan-ly-san
```

### 🔄 2. Quy trình làm việc (Git Workflow)

```bash
# Bước 1: Cập nhật code mới nhất từ nhánh chính (main)
git checkout master
git pull origin master

# Bước 2: Tạo và chuyển sang nhánh làm việc cá nhân
git checkout -b <MSSV>/<ten-chuc-nang>

# Bước 3: Sau khi hoàn thành công việc, commit và push lên GitHub
git add .
git commit -m "feat: Thêm chức năng <tên_chức_năng>"
git push origin <MSSV>/<ten-chuc-nang>

# Bước 4: Thông báo nhóm trưởng để review và merge vào master
```

---
<div align="center">
  <sub>Bản quyền thuộc về <b>Nhóm 13</b> © 2026</sub>
</div>
