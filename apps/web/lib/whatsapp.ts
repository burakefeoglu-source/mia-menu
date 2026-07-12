export async function sendWhatsApp(phone: string, apiKey: string, message: string) {
  const encoded = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apiKey}`;
  try {
    await fetch(url);
  } catch {
    console.error('WhatsApp bildirimi gönderilemedi');
  }
}
