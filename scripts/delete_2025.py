import firebase_admin
from firebase_admin import credentials, firestore
import os

def delete_2025_data():
    base_path = os.path.dirname(os.path.abspath(__file__))
    key_files = [f for f in os.listdir(base_path) if f.endswith('.json') and 'firebase-adminsdk' in f]
    
    if not key_files:
        print("❌ Không tìm thấy file key.")
        return
        
    cred = credentials.Certificate(os.path.join(base_path, key_files[0]))
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    
    db = firestore.client()
    docs = db.collection("daily_messages").stream()
    
    batch = db.batch()
    count = 0
    
    print("🧹 Bắt đầu xóa dữ liệu năm 2025...")
    for doc in docs:
        if doc.id.startswith("2025-"):
            batch.delete(doc.reference)
            count += 1
            # Commit mỗi 500 docs (giới hạn của Firestore batch)
            if count % 500 == 0:
                batch.commit()
                batch = db.batch()
                print(f" - Đã xóa {count} documents...")

    batch.commit()
    print(f"✅ THÀNH CÔNG: Đã xóa tổng cộng {count} documents của năm 2025.")

if __name__ == "__main__":
    delete_2025_data()
