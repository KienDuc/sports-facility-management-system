import http.server
import socketserver
import os

PORT = 5500
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Lấy đường dẫn file thực tế trên ổ đĩa
        path = self.translate_path(self.path)

        # 1. Hỗ trợ Clean URL: nếu gõ /admin/bookings thì tự tìm /admin/bookings.html
        if not os.path.exists(path) and os.path.exists(path + ".html"):
            self.path = self.path + ".html"
            return super().do_GET()

        # 2. Xử lý lỗi 404: Trả về file 404.html đẹp nếu đường dẫn không tồn tại
        if not os.path.exists(path):
            self.send_response(404)
            self.send_header("Content-type", "text/html; charset=utf-8")
            self.end_headers()

            # Đường dẫn tới file 404.html
            error_file = os.path.join(DIRECTORY, "error404.html")
            if os.path.exists(error_file):
                with open(error_file, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b"<h1>404 Not Found</h1>")
            return

        return super().do_GET()

if __name__ == "__main__":
    # Cho phép tái sử dụng cổng ngay lập tức khi restart server
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"==================================================")
        print(f" Frontend Server running at http://localhost:{PORT}")
        print(f" Custom 404 page is ENABLED")
        print(f" Press Ctrl + C to stop")
        print(f"==================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")