# 🌙 LYTH — Astrology Dashboard

**Lyth** không chỉ là một ứng dụng xem chiêm tinh, mà là một "người tri kỷ" đồng hành cùng bạn qua những thăng trầm của cảm xúc và năng lượng vũ trụ. Dự án được xây dựng với tình yêu dành cho sự chiêm nghiệm sâu sắc và vẻ đẹp của những vì sao.

![App Icon](assets/icons/app_icon.jpg)

## ✨ Tính năng nổi bật

### 1. Thông điệp vũ trụ hàng ngày
*   **Dữ liệu chính xác**: Kết nối trực tiếp với **NASA JPL Horizons** để lấy tọa độ thực của các hành tinh.
*   **Phân tích bởi AI**: Sử dụng **Google Gemini** để giải mã năng lượng hành tinh cho riêng cung hoàng đạo của bạn.
*   **Lời khuyên Dos & Donts**: Những việc nên làm và nên tránh để tối ưu hóa năng lượng trong ngày.

### 2. Sắc màu may mắn (Lucky Color)
*   **Tính toán trực thực**: Tự động xác định màu sắc may mắn mỗi ngày dựa trên **Cung Mặt Trăng** và năng lượng của các hành tinh chủ quản.
*   **Đồng bộ Firestore**: Cho phép tùy chỉnh màu sắc cá nhân hóa từ hệ thống quản trị.

### 3. Hệ thống thông báo cá nhân hóa
*   **Đúng lúc**: Thông báo nhắc nhở xem thông điệp vào lúc 8:00 sáng mỗi ngày.
*   **Nội dung động**: Tự động lấy "header" của ngày hôm đó từ Firebase để hiển thị ngay trên màn hình khóa.

### 4. Bản đồ bầu trời & Tương hợp
*   **Universe View**: Theo dõi vị trí các hành tinh trong các cung và nhà.
*   **Love Compatibility**: Khám phá độ tương hợp giữa bạn và người thương.

---

## 🛠 Công nghệ sử dụng

*   **Frontend**: [Flutter](https://flutter.dev/) (Quản lý phiên bản bởi **FVM**).
*   **Backend**: [Firebase](https://firebase.google.com/) (Firestore, Auth).
*   **Data Service**: NASA JPL Horizons API.
*   **AI Engine**: Google Gemini (gemini-1.5-flash).
*   **Automation**: Python Scripts cho việc tạo thông điệp định kỳ hàng tháng.

---

## 🚀 Hướng dẫn cài đặt

### 1. Môi trường Flutter
Dự án sử dụng FVM để quản lý phiên bản Flutter (3.27.x).
```bash
# Cài đặt dependencies
fvm flutter pub get

# Cài đặt Pods (cho iOS)
cd ios && pod install && cd ..

# Chạy ứng dụng
fvm flutter run
```

### 2. Pipeline tạo nội dung AI (Python)
Thư mục `scripts/` chứa pipeline tự động tạo thông điệp hàng ngày.
```bash
# Cài đặt thư viện Python
pip install firebase-admin google-generativeai requests

# Chạy pipeline cho tháng cụ thể (Vd: tháng 5 năm 2026)
python scripts/monthly_pipeline.py 2026 5
```
*Lưu ý: Cần có file `serviceAccountKey.json` và `.env` (chứa GEMINI_API_KEY) trong thư mục `scripts/`.*

---

## 📁 Cấu trúc dự án chính

*   `lib/models/`: Định nghĩa cấu trúc dữ liệu hành tinh, thông điệp.
*   `lib/services/`: Logic lấy dữ liệu từ Firebase, NASA, và quản lý thông báo.
*   `lib/screens/`: Giao diện các Tab (Home, Love, Sky, Profile).
*   `scripts/`: Pipeline AI automation cho dữ liệu hàng tháng.

---

## 🔒 Bảo mật (Git Ignore)
Dự án đã được cấu hình chặt chẽ để không đẩy các file nhạy cảm lên Git:
*   File Key của Firebase (`*.json`).
*   Các file môi trường `.env`.
*   Thư mục rác của Python/Flutter.

---
*Created with ❤️ for Lyth.*
