import os
import json
import requests
import datetime
import time
from typing import Dict, List
import firebase_admin
from firebase_admin import credentials, firestore
import google.generativeai as genai

# =========================================================
# CONFIGURATION & ENV LOADING
# =========================================================
def load_env():
    env = {
        "GEMINI_API_KEY": "",
        "GEMINI_MODEL": "gemini-1.5-flash",
        "USER_BIRTH_DATE": "",
        "USER_LAT": "0.0",
        "USER_LNG": "0.0",
        "LOCATION_NAME": ""
    }
    base_path = os.path.dirname(os.path.abspath(__file__))
    env_path = os.path.join(base_path, ".env")
    
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                if "=" in line and not line.startswith("#"):
                    key, val = line.split("=", 1)
                    env[key.strip()] = val.strip()
    return env

CONFIG = load_env()

USER_BIRTH_DATE = CONFIG["USER_BIRTH_DATE"]
USER_LOCATION = {
    "lat": float(CONFIG["USER_LAT"]), 
    "lng": float(CONFIG["USER_LNG"])
}
LOCATION_NAME = CONFIG["LOCATION_NAME"]

GEMINI_API_KEY = CONFIG["GEMINI_API_KEY"]
GEMINI_MODEL = CONFIG["GEMINI_MODEL"]

# Planets to track (Match with your App's logic)
PLANETS = {
    '10': 'Sun',
    '301': 'Moon',
    '199': 'Mercury',
    '299': 'Venus',
    '499': 'Mars',
    '599': 'Jupiter',
    '699': 'Saturn'
}

# =========================================================
# FIREBASE INITIALIZATION
# =========================================================
def init_firebase():
    try:
        base_path = os.path.dirname(os.path.abspath(__file__))
        
        # Tự động tìm file .json có chứa cụm 'firebase-adminsdk'
        key_files = [f for f in os.listdir(base_path) if f.endswith('.json') and 'firebase-adminsdk' in f]
        
        if not key_files:
            # Fallback về tên mặc định nếu không thấy
            key_path = os.path.join(base_path, "serviceAccountKey.json")
        else:
            key_path = os.path.join(base_path, key_files[0])
            print(f"🔑 Đã tìm thấy file key: {key_files[0]}")
        
        if not os.path.exists(key_path):
            print(f"❌ Không tìm thấy file key Firebase trong thư mục scripts/")
            return None
            
        cred = credentials.Certificate(key_path)
        firebase_admin.initialize_app(cred)
        return firestore.client()
    except Exception as e:
        print(f"❌ Firebase Init Error: {e}")
        return None

# =========================================================
# NASA JPL HORIZONS FETCH
# =========================================================
def get_nasa_data(planet_id: str, start_date: str, stop_date: str) -> Dict[str, float]:
    """Lấy kinh độ hoàng đạo cho cả tháng từ NASA JPL"""
    url = "https://ssd.jpl.nasa.gov/api/horizons.api"
    params = {
        "format": "json",
        "COMMAND": f"'{planet_id}'",
        "OBJ_DATA": "'NO'",
        "MAKE_EPHEM": "'YES'",
        "EPHEM_TYPE": "'OBSERVER'",
        "CENTER": "'coord@399'",
        "SITE_COORD": f"'{USER_LOCATION['lng']},{USER_LOCATION['lat']},0'",
        "START_TIME": f"'{start_date}'",
        "STOP_TIME": f"'{stop_date}'",
        "STEP_SIZE": "'1d'",
        "QUANTITIES": "'31'" # Ecliptic lon. & lat.
    }
    
    try:
        response = requests.get(url, params=params, timeout=30)
        data = response.json()
        result_text = data.get('result', '')
        
        # Parse NASA table data
        results = {}
        import re
        table_match = re.search(r"\$\$SOE([\s\S]*?)\$\$EOE", result_text)
        if table_match:
            lines = table_match.group(1).strip().split('\n')
            for line in lines:
                parts = line.split()
                if len(parts) >= 4:
                    date_str = parts[0] # YYYY-MMM-DD
                    dt = datetime.datetime.strptime(date_str, "%Y-%b-%d")
                    clean_date = dt.strftime("%Y-%m-%d")
                    
                    nums = re.findall(r"[-+]?[0-9]*\.[0-9]+", line)
                    if nums:
                        results[clean_date] = float(nums[0])
        return results
    except Exception as e:
        print(f"❌ Lỗi khi gọi NASA ({planet_id}): {e}")
        return {}

# =========================================================
# BATCH PIPELINE
# =========================================================
def run_monthly_pipeline(year: int, month: int):
    db = init_firebase()
    if not db:
        return

    start_date = f"{year}-{month:02d}-01"
    if month == 12:
        stop_date = f"{year+1}-01-01"
    else:
        stop_date = f"{year}-{month+1:02d}-01"
    
    print(f"🚀 Bắt đầu pipeline cho {start_date} -> {stop_date}")
    
    # 1. Thu thập dữ liệu NASA
    monthly_astro_data = {} 
    
    for p_id, p_name in PLANETS.items():
        print(f"🔭 Đang lấy dữ liệu NASA cho {p_name}...")
        planet_data = get_nasa_data(p_id, start_date, stop_date)
        for date, lon in planet_data.items():
            if date not in monthly_astro_data:
                monthly_astro_data[date] = {}
            monthly_astro_data[date][p_name] = lon
        time.sleep(0.5)

    if not monthly_astro_data:
        print("❌ Không lấy được dữ liệu từ NASA. Vui lòng kiểm tra internet.")
        return

    # 2. Gemini Analysis
    print(f"🤖 Đang phân tích 30 ngày qua Gemini ({GEMINI_MODEL})...")
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel(GEMINI_MODEL)
    
    astro_context = json.dumps(monthly_astro_data, indent=2)
    
    prompt = f"""
    Bạn là Lyth, tri kỷ chiêm tinh dịu dàng, sâu sắc. Bạn đã đồng hành và thấu hiểu người dùng suốt 7 năm qua.
    THÔNG TIN NGƯỜI DÙNG CỰC KỲ QUAN TRỌNG:
    - Ngày sinh: {USER_BIRTH_DATE} (Sinh ngày 10 tháng 05 năm 2000).
    - Nơi sinh: {LOCATION_NAME}.
    - Cung hoàng đạo: Kim Ngưu (Taurus) - Decan 2 (chịu ảnh hưởng của Sao Thủy).
    
    Dưới đây là dữ liệu hành tinh cho cả tháng:
    {astro_context}
    
    QUY TẮC NỘI DUNG NGHIÊM NGẶT:
    1. CHỈ ĐƯỢC CHÚC MỪNG SINH NHẬT VÀO ĐÚNG NGÀY 10/05. Tuyệt đối không chúc mừng "tháng sinh nhật" vào các ngày khác (như 20/04) để tránh gây hiểu lầm.
    2. Format mỗi ngày phải ĐÚNG cấu trúc JSON sau:
       - "header": Một câu nhắn nhủ tình cảm, cụ thể, bắt đầu bằng danh xưng (Em bé ơi, Bé iu ơi, Êm à...). Nội dung phải bám sát năng lượng hành tinh ngày đó (Vd: "Em bé à, hôm nay Sao Thủy nghịch hành, hãy hít thở sâu trước khi nói nhé.").
       - "body": 2-3 câu ngắn, giải mã sâu sắc tác động của các hành tinh đến tâm lý của một Kim Ngưu sinh ngày 10/05. Hãy thể hiện sự thấu hiểu về tính cách kiên định nhưng tinh tế của hành tinh chủ quản Sao Kim và Sao Thủy.
       - "category": Một trong [IDENTITY, LOVE, ENERGY, MINDSET, RELATIONSHIP, LUCK].
       - "dos": 3 việc nên làm cực ngắn (dưới 4 từ/ý).
       - "donts": 3 việc cần tránh cực ngắn (dưới 4 từ/ý).
       - "luckyColorName": Tên màu sắc (Vd: "Xanh Lục Bảo", "Hồng Phấn", "Vàng Ánh Dương").
       - "luckyColorHex": Mã màu Hex (Vd: "#43A047"). Hãy chọn mã màu tinh tế, sang trọng, phù hợp với hành tinh chủ quản của ngày hoặc sự kiện chiêm tinh quan trọng.
       - "luckyColorMeaning": 1 câu ngắn giải thích lý do màu này mang lại may mắn (Vd: "Tăng cường kết nối với Sao Kim", "Giúp tâm hồn Kim Ngưu bình yên").
    
    TRẢ VỀ DUY NHẤT MỘT JSON OBJECT với key là ngày (YYYY-MM-DD). Đừng viết thêm bất kỳ text nào ngoài JSON.
    """
    
    try:
        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        if '```json' in raw_text:
            raw_text = raw_text.split('```json')[1].split('```')[0].strip()
        elif '```' in raw_text:
            raw_text = raw_text.split('```')[1].strip()
            
        final_messages = json.loads(raw_text)
        
        # --- THÊM LOG DATA ---
        base_path = os.path.dirname(os.path.abspath(__file__))
        log_dir = os.path.join(base_path, "logs")
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)
        
        log_file = os.path.join(log_dir, f"backup_{year}_{month:02d}.json")
        with open(log_file, "w", encoding="utf-8") as f:
            json.dump(final_messages, f, ensure_ascii=False, indent=2)
        print(f"📄 Đã lưu bản sao nội dung tại: scripts/logs/{os.path.basename(log_file)}")
        # ---------------------
        
    except Exception as e:
        print(f"❌ Lỗi xử lý Gemini: {e}")
        return

    # 3. Firestore Upload
    print(f"☁️ Đang đồng bộ {len(final_messages)} ngày lên Firestore...")
    batch = db.batch()
    count = 0
    
    for date_key, content in final_messages.items():
        doc_ref = db.collection("daily_messages").document(date_key)
        data = {
            "header": content.get("header", ""),
            "body": content.get("body", ""),
            "category": content.get("category", "SELF"),
            "dos": content.get("dos", []),
            "donts": content.get("donts", []),
            "luckyColorName": content.get("luckyColorName", ""),
            "luckyColorHex": content.get("luckyColorHex", ""),
            "luckyColorMeaning": content.get("luckyColorMeaning", ""),
            "source": "auto",
            "updatedAt": datetime.datetime.now().isoformat()
        }
        batch.set(doc_ref, data)
        count += 1
        
    batch.commit()
    print(f"✅ THÀNH CÔNG: Đã lưu {count} thông điệp vào Firestore.")

if __name__ == "__main__":
    import sys
    
    # Mặc định chạy tháng hiện tại hoặc tháng kế tiếp
    now = datetime.datetime.now()
    year = now.year
    month = now.month
    
    # Nếu được gọi với tham số: python monthly_pipeline.py 2025 5
    if len(sys.argv) == 3:
        year = int(sys.argv[1])
        month = int(sys.argv[2])
    else:
        print(f"💡 Đang chạy cho tháng hiện tại: {year}-{month}")
        print("Bạn có thể chạy tự chọn: python monthly_pipeline.py <year> <month>")

    run_monthly_pipeline(year, month)
