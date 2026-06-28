export async function translateToEnglish(text: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY ortam değişkeni tanımlı değil.');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content:
            'Translate this restaurant menu item or category name from Turkish to English. ' +
            'Reply with ONLY the translation, no quotes, no explanation, no extra text.\n\n' +
            text,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('Çeviri servisi yanıt vermedi.');
  }

  const data = await response.json();
  const textBlock = (data.content as { type: string; text?: string }[] | undefined)?.find(
    (c) => c.type === 'text'
  );

  return (textBlock?.text ?? '').trim();
}
