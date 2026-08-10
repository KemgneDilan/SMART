const OPEN_API_URL = "/api/openai/v1/chat/completions";

class OpenAIService {
    async sendMessage(messages, apiKey, config = {}) {
        try{
            const response = await fetch(OPEN_API_URL, {
                method: "POST", 
                headers : {
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: config.model || "gpt-3.5-turbo", 
                    messages: messages,
                    max_tokens: config.maxTokens || 2000,
                    temperature: config.temperature || 0.7, 
                }),
            });

            if(!response.ok){
                const error = await response.json();
                throw new Error(error.error?.message || "API requiest failed");
            }

            const data = await response.json();
            return {
                success: true,
                data: data.choices[0].message.content,
            };
        }catch(error){
            console.error("OpenAI API Error", error)
            return {
                success: false,
                error: error.message || "Failed to send messge"
            };
        }
    }
}

export default new OpenAIService();