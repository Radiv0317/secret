const fs = require('fs');
const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

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
        footer: { text: "Visitor Logger by Vercel" }
      }
    ]
  };

  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK;

    if (!webhookUrl) {
      console.error("❌ DISCORD_WEBHOOK not defined!");
      return res.status(500).json({ error: "Missing webhook" });
    }

    await axios.post(webhookUrl, embed);
    console.log("✅ Sent to Discord");
    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("❌ Error sending to Discord:", err.message);
    res.status(500).json({ error: "Discord webhook error" });
  }
};
