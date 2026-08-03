# Bài tập số 3 (nhóm)
# Nhóm 13:
#  - 25410189 - Lý Kiến Đức
#  - 24410360 - Trần Quỳnh Tiền
#  - 25410185 - Nguyễn Phong Đạt
#  - 25410186 - Nguyễn Tấn Đạt
#  - 25410172 - Nguyễn Hồng Anh

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

        
