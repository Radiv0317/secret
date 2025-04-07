import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ip = 'N/A', location = 'N/A', device = 'N/A', userAgent = 'N/A' } = req.body;
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
    return res.status(200).json({ status: "ok" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to send to Discord", details: err.message });
  }
}
