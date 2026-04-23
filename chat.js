export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages, system } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system,
        messages
      })
    });

    const data = await response.json();
    const content = data.content?.map(b => b.text || "").join("") || "Lo siento, hubo un problema.";
    res.status(200).json({ content });
  } catch (err) {
    res.status(500).json({ error: "Error interno", content: "Hubo un problema de conexión. Intenta de nuevo 🌸" });
  }
}
