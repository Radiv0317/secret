// api/log.js

const axios = require('axios');

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { ip = "N/A", location = "N/A", device = "N/A", userAgent = "N/A" } = req.body;
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
        footer: { text: "Visitor Logger via Vercel" }
      }
    ]
  };

  try {
    await axios.post(DISCORD_WEBHOOK, embed);
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error' });
  }
}
