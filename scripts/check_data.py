import firebase_admin
from firebase_admin import credentials, firestore
import os

def check_firebase_data():
    base_path = os.path.dirname(os.path.abspath(__file__))
    key_files = [f for f in os.listdir(base_path) if f.endswith('.json') and 'firebase-adminsdk' in f]
    
    if not key_files:
        print("❌ Không tìm thấy file key.")
        return
        
    cred = credentials.Certificate(os.path.join(base_path, key_files[0]))
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    
    db = firestore.client()
    doc_id = "2026-04-01"
    doc = db.collection("daily_messages").document(doc_id).get()
    
    if doc.exists:
        data = doc.to_dict()
        print(f"📄 Dữ liệu của ngày {doc_id} trên Firebase:")
        print(f" - Header: {data.get('header')}")
        print(f" - Lucky Color Name: {data.get('luckyColorName')}")
        print(f" - Lucky Color Hex: {data.get('luckyColorHex')}")
    else:
        print(f"❌ Không tìm thấy Document {doc_id} trên Firebase.")

if __name__ == "__main__":
    check_firebase_data()
