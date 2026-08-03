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

        
