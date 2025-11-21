from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# File dropdown
MAP_FILE = os.path.join(BASE_DIR, "node_crawler", "mapping_dropdown.json")
COMPANY_FILE = os.path.join(BASE_DIR,"node_crawler", "company_list.json")

# URL EVN
EVN_URL = "https://cskh.npc.com.vn/ThongTinKhachHang/LichNgungGiamCungCapDienSPC"


# ======================================
# ✅ API 1 — TRẢ VỀ DANH SÁCH DROPDOWN
# ======================================
@app.get("/dropdown-full")
def dropdown_full():
    try:
        with open(MAP_FILE, "r", encoding="utf8") as f:
            area_map = json.load(f)

        with open(COMPANY_FILE, "r", encoding="utf8") as f:
            companies = json.load(f)

        return jsonify({
            "companies": companies,
            "areas": area_map
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500



# ======================================
# ✅ API 2 — SEARCH LỊCH CÚP ĐIỆN EVN
# ======================================
@app.get("/search")
def search():
    company = request.args.get("company")
    area = request.args.get("area")

    if not company or not area:
        return jsonify({"error": "Missing parameters"}), 400

    # =============================
    #   🟢 Auto-date logic
    # =============================
    today = datetime.today()
    from_date = today.strftime("%d/%m/%Y")
    to_date = (today + timedelta(days=15)).strftime("%d/%m/%Y")

    params = {
        "madvi": area,      
        "tuNgay": from_date,
        "denNgay": to_date
    }

    try:
        response = requests.get(EVN_URL, params=params, timeout=10)
        html = response.text

        soup = BeautifulSoup(html, "html.parser")
        rows = soup.select("table tr")[1:]

        result = []
        for row in rows:
            cols = [c.get_text(strip=True) for c in row.select("td")]
            if len(cols) < 6:
                continue
            result.append({
                "dien_luc": cols[0],
                "ngay": cols[1],
                "from": cols[2],
                "to": cols[3],
                "khu_vuc": cols[4],
                "ly_do": cols[5]
            })

        return jsonify({
            "date_from": from_date,
            "date_to": to_date,
            "days": 15,
            "results": result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.get("/")
def home():
    return {"status": "backend ok"}


if __name__ == "__main__":
    app.run(port=5000, debug=True)
