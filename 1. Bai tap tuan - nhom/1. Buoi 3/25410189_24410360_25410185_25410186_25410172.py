# Bài tập số 3 (nhóm) - 6 bài nhỏ (Slide L04: trang 35-40)
# Nhóm 13:
#  - 25410189 - Lý Kiến Đức (Bài 6)
#  - 24410360 - Trần Quỳnh Tiền (Bài 3)
#  - 25410185 - Nguyễn Phong Đạt (Bài 2)
#  - 25410186 - Nguyễn Tấn Đạt (Bài 1)
#  - 25410172 - Nguyễn Hồng Anh (Bài 4 & 5 - KBB)

import random as rd

# BAI #1 - 25410186 - NGUYEN TAN DAT
print("----------- Bài #1 -----------")
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
print("\n----------- Bài #2 -----------")
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
        "@uit.edu.vn",
        "@ms.uit.edu.vn"
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
print("\n----------- Bài #3 -----------")
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
print("\n----------- Bài #4 -----------")
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


nguoi = input("Nhập 'kéo', 'búa'', 'bao': ")

while nguoi not in ['kéo', 'búa', 'bao']:
    nguoi = input("Nhập lại 'kéo', 'búa'', 'bao': ")

may = rd.choice(['kéo', 'búa', 'bao'])
print("Máy ra: ", may)
print(ham(nguoi, may))

#BÀI 5 Nâng cấp từ Bài 4 (nhiều người chơi tự động với nhau), Số lượng người được chọn ngẫu nhiên từ 8 đến 20 người.
print("\n----------- Bài #5 -----------")
SoNguoi = rd.randint(8, 20)
print("Số người chơi:", SoNguoi)

LuaChon = [rd.choice(['kéo', 'búa', 'bao']) for _ in range(SoNguoi)]
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

# Bài 6: Vé Số VIETLOT 6/45 (25410189)
print("\n----------- Bài #6 -----------")
def chonCapSo():
    list6So = []

    print("- Mời bạn nhập 6 cặp số (từ 1 - 45):")
    for i in range(1, 7):
        str = input(f"  + Cặp {i}: ")

        while (str.isnumeric() == False or (int(str) < 1 or int(str) > 45) or str in list6So):
            print("     ---> Số bạn nhập không hợp lệ.")
            str = input(f"  + Nhập lại Cặp {i}: ")

        if (int(str) >= 1 and int(str) < 10):
            str = "0" + str

        list6So.append(str)

    return list6So

def muaVeSo(n):
    # Chọn 6 số bất kì từ 1 - 45, các số không trùng nhau trong 1 vé. Gọi là 1 dãy số trên 1 vé.
    # Ví dụ: 10-18-26-33-39-44
    dsVeDaMua = []
    soVeDaMua = 0
    while soVeDaMua < n:
        print("\n--------- Vé thứ {0} ---------: ".format(soVeDaMua + 1))
        list6So = chonCapSo()
        dsVeDaMua.append(list6So)

        soVeDaMua += 1

    return dsVeDaMua

def nguoiChoiMuaVeSo():
    n = input("Mời bạn nhập số lượng vé mua: ")

    while(n.isnumeric() == False):
        n = input("Mời bạn nhập lại số lượng vé: ")

    dsVeDaMua = muaVeSo(int(n))
    print("*** Bạn đã mua thành công các vé lần lượt là: ")
    index = 0
    for ve in dsVeDaMua:
        print("    - Vé thứ {0}: {1}".format(index + 1, "-".join(ve)))
        index = index + 1

    return dsVeDaMua

def xoSo():
    # Random 6 số bất kì từ 1 - 45, các số không trùng nhau. Gọi là dãy số trúng thưởng.
    # Ví dụ: 10-18-26-33-39-44
    soTrungThuong = rd.sample(range(1, 46), 6)
    dinhDangSoTT = [f"{capSo:02d}" for capSo in soTrungThuong]

    return dinhDangSoTT

def dinhDangSoTien(soTien):
    return f"{soTien:,}".replace(",", ".") + " đ"

def ketQua(dsVeDaMua, dsCapSoTT):
    coCauGiaiThuong = {
        3: 30000,
        4: 300000,
        5: 10000000,
        6: 10000000000
    }

    tongGiaiTrung = 0
    veIndex = 1
    inKetQuaTrung = []
    for ve in dsVeDaMua:
        soTrung = len(set(ve) & set(dsCapSoTT)) # tìm ra số lượng cặp số trùng giữa vé số và dãy số trúng thưởng

        if (soTrung in coCauGiaiThuong):
            soTienTrung = coCauGiaiThuong[soTrung]
            kqTrung = f"*** Vé thứ {veIndex} trúng {soTrung} cặp số -> giải là: {dinhDangSoTien(soTienTrung)} đ"
            inKetQuaTrung.append(kqTrung)
            tongGiaiTrung += soTienTrung

        veIndex += 1

    if (len(inKetQuaTrung) > 0):
        print("******** Chúc mừng bạn đã trúng các giải ********")
        print("\n".join(inKetQuaTrung))
        print("----> Tổng số tiền bạn nhận được là: {0} đ".format(dinhDangSoTien(tongGiaiTrung)))
    else:
        print("******** Cảm ơn bạn đã tham gia lần xổ số này. Chúc bạn may mắn trong lần tiếp theo! ********")


print("======== Chào mừng bạn đến với Đại Lý Vé Số VIETLOT 6/45 ========")
dsVeDaMua = nguoiChoiMuaVeSo()
print("\n------------------- Xổ số -------------------")
dsSoTrungThuong = xoSo()
print("*** Dãy số trúng thưởng của kì này là: {0}".format("-".join(dsSoTrungThuong)))

print("\n------------------- Công bố kết quả -------------------")
ketQua(dsVeDaMua, dsSoTrungThuong)
# print("*** Dãy số trúng thưởng của kì này là: {0}".format(mayXoSo()))
