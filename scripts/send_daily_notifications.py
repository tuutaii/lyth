import os
import datetime
import pytz
import firebase_admin
from firebase_admin import credentials, firestore, messaging

import json

def load_firebase():
    if not firebase_admin._apps:
        # Hỗ trợ đọc trực tiếp từ biến môi trường (cho GitHub Actions)
        cred_json = os.environ.get("FIREBASE_KEY_JSON")
        if cred_json:
            try:
                cred_dict = json.loads(cred_json)
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
                return firestore.client()
            except Exception as e:
                print(f"❌ Lỗi cấu hình Firebase từ biến môi trường: {e}")
                return None

        # Đọc từ file cục bộ nếu không có biến môi trường (cho local dev)
        base_path = os.path.dirname(os.path.abspath(__file__))
        key_files = [f for f in os.listdir(base_path) if f.endswith('.json') and 'firebase-adminsdk' in f]
        if not key_files:
            print("❌ Không tìm thấy file key Firebase trong thư mục scripts/")
            return None
        key_path = os.path.join(base_path, key_files[0])
        cred = credentials.Certificate(key_path)
        firebase_admin.initialize_app(cred)
    return firestore.client()

def send_notifications():
    db = load_firebase()
    if not db:
        return
    
    # Lấy thời gian hiện tại theo múi giờ Việt Nam (UTC+7)
    vn_tz = pytz.timezone('Asia/Ho_Chi_Minh')
    now = datetime.datetime.now(vn_tz)
    today_str = now.strftime('%Y-%m-%d')  # Ví dụ: 2026-05-26
    current_time_str = now.strftime('%H:%M')  # Ví dụ: 09:00
    
    print(f"⏰ [JOB] Chạy gửi thông báo lúc: {today_str} {current_time_str}")
    
    # 1. Lấy thông điệp của ngày hôm nay từ Firestore
    message_doc = db.collection("daily_messages").document(today_str).get()
    if not message_doc.exists:
        print(f"⚠️ Không tìm thấy thông điệp cho ngày {today_str} trong daily_messages.")
        return
    
    msg_data = message_doc.to_dict()
    title = msg_data.get("header", "✨ Thông điệp vũ trụ hôm nay")
    body = msg_data.get("body", "Mở Lyth để xem thông điệp ngày mới dành riêng cho em.")
    
    # 2. Truy vấn tất cả các user có fcmToken
    users_ref = db.collection("users")
    users = users_ref.get()
    
    tokens = []
    users_to_update = []
    
    for u in users:
        u_data = u.to_dict()
        token = u_data.get("fcmToken")
        noti_time = u_data.get("notificationTime")
        last_sent = u_data.get("lastSentDate")
        
        if not token or not noti_time:
            continue
            
        # Kiểm tra điều kiện:
        # - Giờ hẹn (noti_time) <= Giờ hiện tại (current_time_str)
        # - Và chưa nhận thông báo ngày hôm nay (last_sent != today_str)
        if noti_time <= current_time_str and last_sent != today_str:
            tokens.append(token)
            users_to_update.append(u.reference)
            
    if not tokens:
        print(f"ℹ️ Không có user nào cần gửi thông báo tại thời điểm này ({current_time_str}).")
        return
        
    print(f"📣 Tìm thấy {len(tokens)} thiết bị cần gửi thông báo.")
    
    # 3. Gửi thông báo bằng FCM Multicast (hỗ trợ gửi tới nhiều token một lúc)
    message = messaging.MulticastMessage(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        data={
            "url": "/?tab=messages" # Điều hướng khi click
        },
        apns=messaging.APNSConfig(
            payload=messaging.APNSPayload(
                aps=messaging.Aps(
                    sound="default",
                    badge=1
                )
            )
        ),
        tokens=tokens
    )
    
    try:
        response = messaging.send_multicast(message)
        print(f"✅ Gửi thành công: {response.success_count} thông báo.")
        
        # Cập nhật trạng thái đã gửi hôm nay vào Firestore để tránh trùng lặp
        batch = db.batch()
        for ref in users_to_update:
            batch.update(ref, {"lastSentDate": today_str})
        batch.commit()
        print("💾 Đã cập nhật trạng thái gửi (lastSentDate) cho người dùng.")
        
        if response.failure_count > 0:
            print(f"❌ Thất bại: {response.failure_count} thông báo.")
            # Quét các token bị lỗi để làm sạch database
            for index, resp in enumerate(response.responses):
                if not resp.success:
                    print(f"   - Lỗi Token ở vị trí {index}: {resp.exception}")
    except Exception as e:
        print(f"❌ Lỗi gửi thông báo: {e}")

if __name__ == "__main__":
    send_notifications()
