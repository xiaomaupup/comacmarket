import { DEEPSEEK_API_KEY, DEEPSEEK_API_URL, SYSTEM_PROMPT } from '../constants';
import { Message, Role } from '../types';

interface DeepSeekResponse {
  id: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const fetchDeepSeekResponse = async (history: Message[]): Promise<string> => {
  try {
    // Construct the full message chain including system prompt
    const messagesPayload = [
      { role: Role.SYSTEM, content: SYSTEM_PROMPT },
      ...history
    ];

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messagesPayload,
        stream: false,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data: DeepSeekResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      throw new Error("No response content received from API");
    }

  } catch (error) {
    console.error("DeepSeek API Call Failed:", error);
    throw error;
  }
};

export const fetchDeepSeekResponseStream = async (
  history: Message[],
  onChunk: (chunk: string) => void
): Promise<void> => {
  try {
    // Construct the full message chain including system prompt
    const messagesPayload = [
      { role: Role.SYSTEM, content: SYSTEM_PROMPT },
      ...history
    ];

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: messagesPayload,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("Response body is not readable");
    }

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // 忽略解析错误，继续处理下一行
          }
        }
      }
    }

    // 处理剩余的 buffer
    if (buffer.trim()) {
      if (buffer.startsWith('data: ')) {
        const data = buffer.slice(6);
        if (data !== '[DONE]') {
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }

  } catch (error) {
    console.error("DeepSeek Stream API Call Failed:", error);
    throw error;
  }
};
