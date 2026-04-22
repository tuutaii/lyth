import firebase_admin
from firebase_admin import credentials, firestore
import os
from collections import Counter

def stats_by_month():
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
    
    # Lấy Year-Month từ ID (Vd: 2026-04)
    months = [doc.id[:7] for doc in docs]
    stats = Counter(months)
    
    print(f"📊 Thống kê số lượng theo tháng:")
    for month, count in sorted(stats.items()):
        print(f" - Tháng {month}: {count} documents")

if __name__ == "__main__":
    stats_by_month()
