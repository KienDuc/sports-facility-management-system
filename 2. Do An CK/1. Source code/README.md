1. pip install -r requirements.txt
2. Cài đặt để run server trên pycharm

   * Mở app Pycharm -> Mở project
   * Phía trên cùng Pycharm có button "Run Server" -> Chọn Edit Configuration...
   * Đổi Script -> Module và nhập "uvicorn"
   * Nhập "app.main:app --reload" vào textbox parameters bên dưới
   * "Environment Variables" -> nhập "PYTHONUNBUFFERED=1"
   * Nhấn "OK"
3. Download and setup Dbeaver to view Sqlite \*.db

   * Cài đặt Dbeaver
   * Mở Dbeaver
   * Nhấn nút "Connect to a database" (hình cái chuôi cắm điện) -> Chọn "SQLite"
   * Nhấn "Next" -> Nhập đường dẫn và chọn tên file "sfms.db" trong folder source này.
   * Nhấn "Finish"

4. Để sử dụng AI chatbot, cần vào link dưới đây và copy API Key, sau đó dán vào file config.py tại mục GEMINI_API_KEY:
   * https://aistudio.google.com/api-keys?project=gen-lang-client-0943556207

5. Mở Teminal -> Đi tới thư mục gốc (1. Source code) -> nhập lệnh dưới đây và enter:
   python -m backend.app.models.seed_demo
\--------------------------------------------

sfms/

│

├── app/

│   ├── \_\_init\_\_.py

│   ├── main.py                   # Entry point của ứng dụng FastAPI

│   ├── config.py                 # Cấu hình môi trường (API Key, Database URL)

│   │

│   ├── db/                       # Tầng cơ sở dữ liệu

│   │   ├── \_\_init\_\_.py

│   │   ├── session.py            # Khởi tạo SQLAlchemy engine \& session

│   │

│   ├── models/                   # ORM Models (Database Tables)

│   │   ├── \_\_init\_\_.py

│   │   ├── court.py              # Model Sân

│   │   ├── time\_slot.py          # Model Khung giờ

│   │   ├── service.py            # Model Dịch vụ

│   │   └── booking.py            # Model Đặt sân \& Chi tiết dịch vụ

│   │

│   ├── schemas/                  # Pydantic Schemas (Data Validation/DTO)

│   │   ├── \_\_init\_\_.py

│   │   ├── court.py

│   │   ├── service.py

│   │   └── booking.py

│   │

│   ├── api/                      # Tầng API Controllers / Endpoints

│   │   ├── \_\_init\_\_.py

│   │   └── v1/

│   │       ├── \_\_init\_\_.py

│   │       ├── router.py         # Tổng hợp các router

│   │       ├── courts.py         # API CRUD Sân 

│   │       ├── services.py       # API Dịch vụ 

│   │       ├── bookings.py       # API Đặt sân 

│   │       └── ai\_assistant.py   # API AI Chatbot 

│   │

│   └── services/                 # Business Logic tầng sâu

│       ├── \_\_init\_\_.py

│       └── ai\_service.py         # Gọi OpenAI/Gemini API trích xuất JSON

│

├── .gitignore

├── requirements.txt              # Danh sách thư viện cần install

└── README.md                     # Hướng dẫn setup cho team

