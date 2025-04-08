import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown',
    userAgent = req.headers['user-agent'] || 'Unknown',
    location = 'Unknown',
    device = 'Unknown'
  } = req.body;

  const time = new Date().toLocaleString();

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
        footer: { text: "Tojo-Kai Visitor Logger" }
      }
    ]
  };

  // ❗ Masukin webhook lo langsung di sini
  const webhook = "https://discord.com/api/webhooks/your_webhook_here";

  try {
    await axios.post(webhook, embed);
    return res.status(200).json({ status: "ok" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to send to Discord", details: err.message });
  }
}
