import firebase_admin
from firebase_admin import credentials, firestore
import os

base_path = "scripts"
key_files = [f for f in os.listdir(base_path) if f.endswith('.json') and 'firebase-adminsdk' in f]
if not key_files:
    print("No key file found")
    exit()

cred = credentials.Certificate(os.path.join(base_path, key_files[0]))
firebase_admin.initialize_app(cred)
db = firestore.client()

doc = db.collection("daily_messages").document("2026-04-21").get()
if doc.exists:
    print(f"FOUND 2026-04-21: {doc.to_dict()['header']}")
else:
    print("NOT FOUND 2026-04-21")

# List some docs
docs = db.collection("daily_messages").limit(5).get()
print("Recent docs in daily_messages:")
for d in docs:
    print(f"- {d.id}")
