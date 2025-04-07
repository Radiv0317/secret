from flask import Flask, request, send_from_directory, jsonify
from datetime import datetime
import requests
import os

app = Flask(__name__, static_folder='static')
LOG_FILE = 'ip_log.txt'

# GANTI DENGAN WEBHOOK LO SENDIRI
DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1358800842995531927/7sK8AwlIyy16NliKLzz0i-iZL_evnF2Sr-U2fHFT3sRaIAbv41LrF5MDMxWdL76ZbXOh'

def send_to_discord(ip, location, device, ua, time):
    data = {
        "embeds": [
            {
                "title": "🌐 New Visitor Detected!",
                "color": 0x3498db,  # Biru
                "fields": [
                    {"name": "🕒 Time", "value": time, "inline": False},
                    {"name": "📍 IP", "value": ip, "inline": True},
                    {"name": "🌍 Location", "value": location, "inline": True},
                    {"name": "💻 Device", "value": device, "inline": True},
                    {"name": "🕵️ User Agent", "value": ua[:1024], "inline": False}
                ],
                "footer": {
                    "text": "Visitor Logger by Python Flask"
                }
            }
        ]
    }
    try:
        requests.post(DISCORD_WEBHOOK, json=data)
    except Exception as e:
        print("Discord error:", e)

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/log', methods=['POST'])
def log_data():
    data = request.get_json()
    ip = data.get("ip", "N/A")
    location = data.get("location", "N/A")
    device = data.get("device", "N/A")
    ua = data.get("userAgent", "N/A")
    time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    log_line = f"[{time}] IP: {ip} | Loc: {location} | Device: {device}\n"
    
    with open(LOG_FILE, "a") as f:
        f.write(log_line)

    # Kirim ke Discord
    send_to_discord(ip, location, device, ua, time)

    return jsonify({"status": "ok"})

@app.route('/logs')
def get_logs():
    if not os.path.exists(LOG_FILE):
        return "No logs yet."
    with open(LOG_FILE, 'r') as f:
        return "<pre>" + f.read() + "</pre>"

if __name__ == '__main__':
    app.run(debug=True)

