import firebase_admin
from firebase_admin import credentials, firestore
import os

def list_all_ids():
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
    
    ids = [doc.id for doc in docs]
    ids.sort()
    
    print(f"📊 Tìm thấy {len(ids)} documents trong daily_messages:")
    for doc_id in ids:
        # Đánh dấu các ID có vẻ sai format (thiếu số 0 hoặc sai gạch nối)
        is_standard = len(doc_id) == 10 and doc_id[4] == '-' and doc_id[7] == '-'
        status = "✅ Chuẩn" if is_standard else "❌ Sai Format"
        print(f" - {doc_id} [{status}]")

if __name__ == "__main__":
    list_all_ids()
