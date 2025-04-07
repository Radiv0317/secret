const axios = require('axios');

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ip = "N/A", location = "N/A", device = "N/A", userAgent = "N/A" } = req.body;
  const time = new Date().toLocaleString();

  const embed = {
    embeds: [
      {
        title: "🌐 New Visitor Detected!",
        color: 3447003,
        fields: [
          { name: "🕒 Time", value: time, inline: false },
          { name: "📍 IP", value: ip, inline: true },
          { name: "🌍 Location", value: location, inline: true },
          { name: "💻 Device", value: device, inline: true },
          { name: "🕵️ User Agent", value: userAgent.slice(0, 1024), inline: false }
        ],
        footer: {
          text: "Visitor Logger by Vercel"
        }
      }
    ]
  };

  try {
    await axios.post(DISCORD_WEBHOOK, embed);
    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}
