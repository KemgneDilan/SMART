import { CONFIG } from "../../config/config";

const MODEL_API_URL = `${CONFIG.MODEL_API_URL}/generate`;

class OpenAIService {
  async sendMessage(instruction, config = {}) {
    try {
      const response = await fetch(MODEL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instruction,
          max_tokens: config.maxTokens || 2000,
          temperature: config.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "API request failed");
      }

      const data = await response.json();
      return {
        success: true,
        data: data.response || data.result || "",
      };
    } catch (error) {
      console.error("Model API Error", error);
      return {
        success: false,
        error: error.message || "Failed to send message",
      };
    }
  }
}

export default new OpenAIService();
