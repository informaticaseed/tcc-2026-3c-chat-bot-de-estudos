const GROQ_KEY = "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const SYSTEM_PROMPT =
  "Você é o EstudaAI, um assistente educacional especializado em ajudar estudantes brasileiros com concursos públicos e vestibulares. Seja didático, objetivo e motivador.";

export async function requestGroqReply(messages) {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + GROQ_KEY,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: 1000,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Tente novamente.");
  }

  return (
    data?.choices?.[0]?.message?.content || "Não consegui gerar uma resposta."
  );
}
