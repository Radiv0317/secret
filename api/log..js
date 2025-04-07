import axios from 'axios';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { ip = 'N/A', location = 'N/A', device = 'N/A', userAgent = 'N/A' } = req.body;
  const time = new Date().toLocaleString();
  const isoTime = new Date().toISOString();
  const logPath = path.join(process.cwd(), 'ip_log.txt');

  // Tambahkan log ke file lokal
  const logData = `${isoTime} | ${ip} | ${device} | ${userAgent}\n`;
  fs.appendFile(logPath, logData, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });

  // Kirim ke Discord
  const embed = {
    embeds: [
      {
        title: "🌐 New Visitor Detected!",
        color: 3447003,
        fields: [
          { name: "🕒 Time", value: time },
          { name: "📍 IP", value: ip },
          { name: "🌍 Location", value: location },
          { name: "💻 Device", value: device },
          { name: "🕵️ User Agent", value: userAgent.slice(0, 1024) }
        ],
        footer: {
          text: "Visitor Logger by Vercel"
        }
      }
    ]
  };

  try {
    const webhook = process.env.DISCORD_WEBHOOK;
    if (!webhook) return res.status(500).json({ error: "Missing Webhook" });

    await axios.post(webhook, embed);
    return res.status(200).json({ status: "Logged and Sent to Discord" });
  } catch (err) {
    console.error('Discord error:', err.message);
    return res.status(500).json({ error: "Failed to send to Discord", details: err.message });
  }
}
