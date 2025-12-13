export const baseHeaders = {
  'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
}

export function getAvailableModels() {
  return {
    gpt: !!process.env.OPENAI_API_KEY,
    gptTurbo: !!process.env.OPENAI_API_KEY,
    claude: !!process.env.ANTHROPIC_API_KEY,
    claudeInstant: !!process.env.ANTHROPIC_API_KEY,
    cohere: !!process.env.COHERE_API_KEY,
    cohereWeb: !!process.env.COHERE_API_KEY,
    mistral: !!process.env.MISTRAL_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
  }
}