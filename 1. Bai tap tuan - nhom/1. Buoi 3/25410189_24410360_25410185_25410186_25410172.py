# Bài tập số 3 (nhóm)
# Nhóm 13:
#  - 25410189 - Lý Kiến Đức
#  - 24410360 - Trần Quỳnh Tiền
#  - 25410185 - Nguyễn Phong Đạt
#  - 25410186 - Nguyễn Tấn Đạt
#  - 25410172 - Nguyễn Hồng Anh

# BAI #1 - 25410186 - NGUYEN TAN DAT

str_input = input("Nhập chuỗi: ")

# 1. Tính độ dài chuỗi
print("Độ dài chuỗi:", len(str_input))

# Danh sách ký tự đặc biệt cần kiểm tra
special_chars = r"-=\`!@#$%^&*()_+|[]{};'\":,./<>?"

# Khởi tạo các danh sách
special_list = []
lower_list = []
digit_list = []
upper_list = []

# Duyệt từng ký tự trong chuỗi
for ch in str_input:
    if ch in special_chars:
        special_list.append(ch)

    if 'a' <= ch <= 'z':
        lower_list.append(ch)

    if 'A' <= ch <= 'Z':
        upper_list.append(ch)

    if '0' <= ch <= '9':
        digit_list.append(ch)

# 2. Ký tự đặc biệt
print("\nKý tự đặc biệt:")
print("Số lượng:", len(special_list))
print("Các ký tự:", special_list)

# 3. Chữ thường [a-z]
print("\nChữ thường [a-z]:")
print("Số lượng:", len(lower_list))
print("Các ký tự:", lower_list)

# 4. Chữ số [0-9]
print("\nChữ số [0-9]:")
print("Số lượng:", len(digit_list))
print("Các ký tự:", digit_list)

# 5. Chữ hoa [A-Z]
print("\nChữ hoa [A-Z]:")
print("Số lượng:", len(upper_list))
print("Các ký tự:", upper_list)

## Bai 2: KIEM TRA CHUOI NHAP VAO CO PHAI EMAIL KHONG - 25410185 - Nguyen Phong Dat

def kiemTraEmail(email):
    email = email.strip()

    tenMien = [
        "@gmail.com",
        "@yahoo.com",
        "@hotmail.com",
        "@outlook.com",
        "@icloud.com",
        "@proton.me",
        "@protonmail.com",
        "@uit.edu.vn"
    ]
    for mien in tenMien:
        if email.endswith(mien):
            ten = email[:-len(mien)]

            if len(ten) < 6:
                return False

            for kyTu in ten:
                if not (kyTu.isalnum() or kyTu == "."):
                    return False

            return True

    return False

email = input("Nhap Email: ")

if kiemTraEmail(email):
    print("Day la Email hop le!")
else:
    print("Day khong phai la Email hop le!")

# BAI #3 - KIEM TRA ID VA PASSWORD 24410360 TRAN QUYNH TIEN
def check_id(user_id):
    cam = "!@#$%^&*()-=+"
    if len(user_id) < 6 or len(user_id)>24:
        return False
    elif " " in user_id:
        return False
    for c in user_id:
        if c in cam:
            return False
    return True
def check_password(password):
    if len(password) < 6 or len(password) >24:
        return False
    thuong = False
    hoa = False
    so = False
    dacbiet = False
    for c in password:
        if c>="a" and c<="z":
            thuong = True
        elif c>="A" and c<="Z":
            hoa = True
        elif c>="0" and c<="9":
            so = True
        elif c in "@#$":
            dacbiet = True
    if thuong == True and hoa == True and so == True and dacbiet == True:
        return True
    else:
        return False
user_id = input("Nhap ID user: ")
password = input("Nhap Password: ")
while check_id(user_id)==False or check_password(password)==False:
    print("Dang nhap khong hop le!")
    user_id = input("Nhap ID user: ")
    password = input("Nhap Password: ")
print("Dang nhap thanh cong!")

#BÀI 4 Viết chương trình mô phỏng trò chơi Kéo - Búa - Bao giữa người và máy.
from random import choice

def ham(nguoi, may):
    if nguoi == may:
        return "Hòa"

    if nguoi == "kéo":
        if may == "bao":
            return "Người thắng"
        else:
            return "Máy thắng"

    if nguoi == "búa":
        if may == "kéo":
            return "Người thắng"
        else:
            return "Máy thắng"

    if nguoi == "bao":
        if may == "búa":
            return "Người thắng"
        else:
            return "Máy thắng"


nguoi = input("Nhập 'kéo', 'búa'', 'bao' ")

while nguoi not in ['kéo', 'búa', 'bao']:
    nguoi = input("Nhập lại 'kéo', 'búa'', 'bao' ")

import random as rd
may = rd.choice(['kéo', 'búa', 'bao'])
print("Máy ra: ", may)
print(ham(nguoi, may))

#BÀI 5 Nâng cấp từ Bài 4 (nhiều người chơi tự động với nhau), Số lượng người được chọn ngẫu nhiên từ 8 đến 20
người.
import random

SoNguoi = random.randint(8, 20)
print("Số người chơi:", SoNguoi)

LuaChon = [random.choice(['kéo', 'búa', 'bao']) for _ in range(SoNguoi)]
print("Lựa chọn của từng người:", LuaChon)

counts = {
    "kéo": LuaChon.count("kéo"),
    "búa": LuaChon.count("búa"),
    "bao": LuaChon.count("bao")
}

SLLonNhat = max(counts.values())
LoaiThang = [k for k, v in counts.items() if v == SLLonNhat]

if len(LoaiThang) == 1:
    print(f"Loại {LoaiThang[0]} thắng")
    NguoiThang = [i+1 for i, lc in enumerate(LuaChon) if lc == LoaiThang[0]]
    print("Danh sách người thắng:", NguoiThang)
else:
    print("Hòa")

        
