from datetime import datetime, timedelta
from pathlib import Path
import shutil

from sqlalchemy import delete

from backend.app.db.session import SessionLocal
from backend.app.models.court import Court
from backend.app.models.service import Service
from backend.app.models.booking import Booking, BookingSlot, BookingService


DB_PATH = Path("sfms.db")
BACKUP_PATH = Path(
    f"sfms_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"
)


COURTS = [
    ("FB1", "Bóng đá", 150000),
    ("FB2", "Bóng đá", 160000),
    ("FB3", "Bóng đá", 180000),
    ("FB4", "Bóng đá", 200000),
    ("FB5", "Bóng đá", 220000),
    ("FB6", "Bóng đá", 250000),

    ("BD1", "Cầu lông", 90000),
    ("BD2", "Cầu lông", 100000),
    ("BD3", "Cầu lông", 110000),
    ("BD4", "Cầu lông", 120000),
    ("BD5", "Cầu lông", 130000),

    ("PK1", "Pickleball", 100000),
    ("PK2", "Pickleball", 110000),
    ("PK3", "Pickleball", 120000),
    ("PK4", "Pickleball", 130000),
    ("PK5", "Pickleball", 150000),
]


SERVICES = [
    ("Nước suối", "Chai", 10000),
    ("Sting", "Chai", 15000),
    ("Red Bull", "Lon", 20000),
    ("Pocari Sweat", "Chai", 20000),
    ("Trà xanh", "Chai", 15000),
    ("Khăn lạnh", "Cái", 5000),
    ("Thuê vợt cầu lông", "Lượt", 30000),
    ("Thuê vợt Pickleball", "Lượt", 40000),
    ("Thuê bóng đá", "Quả", 20000),
    ("Thuê cầu", "Ống", 80000),
    ("Áo bib", "Cái", 20000),
    ("Khăn tắm", "Cái", 15000),
    ("Tủ locker", "Lượt", 20000),
    ("Băng cổ tay", "Cặp", 25000),
    ("Nước điện giải", "Chai", 20000),
    ("Thùng nước suối 24 chai", "Thùng", 120000),
]


CUSTOMERS = [
    ("Trần Quỳnh Tiền", "0901234567"),
    ("Nguyễn Minh Anh", "0912345678"),
    ("Lê Hoàng Nam", "0987654321"),
    ("Phạm Gia Bảo", "0934567890"),
    ("Võ Thanh Tùng", "0976543210"),
    ("Trần Quốc Huy", "0961234567"),
    ("Nguyễn Tuấn Kiệt", "0945678901"),
    ("Đỗ Minh Khang", "0923456789"),
    ("Lê Nhật Minh", "0909876543"),
    ("Phạm Anh Tuấn", "0911122233"),
    ("Nguyễn Đức Anh", "0933344455"),
    ("Trần Hoàng Phúc", "0966677788"),
    ("Võ Gia Hưng", "0988899900"),
    ("Nguyễn Hải Đăng", "0905566778"),
    ("Lê Đức Minh", "0916677889"),
    ("Phạm Quốc Bảo", "0937788990"),
    ("Trần Nhật Huy", "0968899001"),
    ("Nguyễn Minh Quân", "0989900112"),
    ("Võ Hoàng Long", "0901011122"),
    ("Lê Thanh Phong", "0912122233"),
    ("Phạm Minh Trí", "0933233344"),
    ("Nguyễn Gia Huy", "0964344455"),
    ("Trần Quốc Khánh", "0985455566"),
    ("Trần Quỳnh Tiền", "0901234567"),
]


def main():

    if not DB_PATH.exists():
        raise FileNotFoundError(
            "Không thấy sfms.db. "
            "Hãy chạy script từ thư mục '1. Source code'."
        )

    # Backup trước khi seed
    shutil.copy2(DB_PATH, BACKUP_PATH)
    print(f"Đã backup DB: {BACKUP_PATH}")

    db = SessionLocal()

    try:

        # =========================
        # XÓA DỮ LIỆU TEST CŨ
        # =========================
        # Giữ nguyên bảng user/admin

        db.execute(delete(BookingService))
        db.execute(delete(BookingSlot))
        db.execute(delete(Booking))
        db.execute(delete(Court))
        db.execute(delete(Service))

        db.commit()

        # =========================
        # TẠO SÂN
        # =========================

        court_objs = []

        for name, court_type, price in COURTS:

            court = Court(
                name=name,
                type=court_type,
                price_per_hour=price,
                is_active=True,
                created_by="seed_demo"
            )

            db.add(court)
            court_objs.append(court)

        db.flush()

        # =========================
        # TẠO DỊCH VỤ
        # =========================

        service_objs = []

        for name, unit, price in SERVICES:

            service = Service(
                name=name,
                unit=unit,
                price=price,
                is_available=True,
                created_by="seed_demo"
            )

            db.add(service)
            service_objs.append(service)

        db.flush()

        # =========================
        # TẠO BOOKING
        # =========================

        today = datetime.now().date()

        demo_dates = [
            today,
            today + timedelta(days=1),
            today + timedelta(days=2)
        ]

        hours = [
            ("06:00", "07:00"),
            ("07:00", "08:00"),
            ("08:00", "09:00"),
            ("09:00", "10:00"),
            ("10:00", "11:00"),
            ("11:00", "12:00"),
            ("12:00", "13:00"),
            ("13:00", "14:00"),
            ("14:00", "15:00"),
            ("15:00", "16:00"),
            ("16:00", "17:00"),
            ("17:00", "18:00"),
            ("18:00", "19:00"),
            ("19:00", "20:00"),
            ("20:00", "21:00"),
            ("21:00", "22:00"),
        ]
        statuses = [
            "booked",
            "booked",
            "playing",
            "canceled"
        ]
       

        for i, (customer_name, customer_phone) \
                in enumerate(CUSTOMERS, start=1):

            court = court_objs[
                (i - 1) % len(court_objs)
            ]

            booking_date = demo_dates[
                (i - 1) % len(demo_dates)
            ]

            start_time, end_time = hours[
                (i - 1) % len(hours)
            ]

            status = statuses[
                (i - 1) % len(statuses)
            ]

            # =========================
            # DỊCH VỤ ĐI KÈM
            # =========================

            selected_services = []
            service_cost = 0

            # Khoảng 1/3 booking có dịch vụ
            if i % 3 == 0:

                service = service_objs[
                    (i - 1) % len(service_objs)
                ]

                qty = 1 if i % 2 else 2

                selected_services.append(
                    (service, qty)
                )

                service_cost += (
                    service.price * qty
                )

            # Một số booking có thêm dịch vụ thứ 2
            if i % 5 == 0:

                service = service_objs[
                    (i + 3) % len(service_objs)
                ]

                qty = 1

                selected_services.append(
                    (service, qty)
                )

                service_cost += service.price

            total_price = (
                court.price_per_hour
                + service_cost
            )

            booking = Booking(
                booking_code=f"BKDEMO{i:03d}",
                customer_name=customer_name,
                customer_phone=customer_phone,
                booking_date=booking_date.isoformat(),
                total_price=total_price,
                status=status,
                note="Dữ liệu demo hệ thống",
                created_by="seed_demo"
            )

            db.add(booking)
            db.flush()

            # =========================
            # BOOKING SLOT
            # =========================

            slot = BookingSlot(
                booking_id=booking.id,
                court_id=court.id,
                booking_date=booking_date.isoformat(),
                start_time=start_time,
                end_time=end_time,
                price=court.price_per_hour
            )

            db.add(slot)

            # =========================
            # BOOKING SERVICE
            # =========================

            for service, qty in selected_services:

                booking_service = BookingService(
                    booking_id=booking.id,
                    service_id=service.id,
                    quantity=qty,
                    unit_price=service.price,
                    total_price=service.price * qty
                )

                db.add(booking_service)

        db.commit()

        print()
        print("===================================")
        print("SEED DEMO THÀNH CÔNG")
       

    except Exception as e:

        db.rollback()

        print("SEED THẤT BẠI:")
        print(e)

        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()