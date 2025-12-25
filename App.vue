<template>
  <div class="flex flex-col h-full relative overflow-hidden bg-sky-gradient">
    <!-- Background Decorative Elements -->
    <div class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
    <div class="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />
    
    <Header />

    <main ref="mainRef" @scroll="handleScroll" class="flex-1 min-h-0 overflow-y-auto w-full max-w-4xl mx-auto z-10 no-scrollbar scroll-smooth pb-24">
      <div class="px-4 pt-4 pb-4 md:px-6 flex flex-col min-h-full">
        <div v-if="messages.length === 0" class="flex flex-col items-center justify-center flex-1 text-slate-400">
          <div class="relative">
            <div class="absolute inset-0 bg-blue-400/20 blur-xl rounded-full"></div>
            <Plane :size="64" class="mb-6 text-blue-500/80 relative z-10 animate-pulse-slow" />
          </div>
          <p class="text-lg font-medium tracking-wide text-slate-500">等待指令...</p>
        </div>
        
        <div v-if="messages.length > 0" class="flex flex-col justify-end min-h-full">
          <div class="space-y-6">
            <ChatMessage 
              v-for="(msg, index) in messages" 
              :key="index" 
              :message="msg" 
            />
            
            <!-- Loading Indicator inside the chat flow -->
            <div v-if="isLoading" class="flex w-full mb-6 justify-start animate-fade-in-up">
              <div class="flex items-end gap-3 max-w-[90%]">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-blue-100 flex items-center justify-center shadow-sm">
                  <Cloud :size="16" class="text-blue-500 animate-pulse" />
                </div>
                <div class="px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl rounded-tl-sm shadow-sm">
                  <div class="flex space-x-1 h-5 items-center">
                    <div class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                    <div class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                    <div class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Invisible element to scroll to -->
          <div ref="messagesEndRef" class="h-4" />
        </div>
      </div>
    </main>

    <ChatInput :on-send="handleSendMessage" :is-loading="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import Header from './components/Header.vue';
import ChatInput from './components/ChatInput.vue';
import ChatMessage from './components/ChatMessage.vue';
import { fetchDeepSeekResponseStream } from './services/deepseekService';
import { Message, Role } from './types';
import { Cloud, Plane } from 'lucide-vue-next';

const messages = ref<Message[]>([
  {
    role: Role.ASSISTANT,
    content: '您好，我是您的专属**航空市场信息咨询顾问**。\n\n无论您想了解**飞机原理**、**机场运行**还是**民航法规**，请随时提问，我将为您提供专业的解答。✈️'
  }
]);
const isLoading = ref(false);
const messagesEndRef = ref<HTMLDivElement | null>(null);
const mainRef = ref<HTMLElement | null>(null);
const userHasScrolledUp = ref(false);

// 检查用户是否在底部附近（允许 100px 的误差范围）
const isNearBottom = (): boolean => {
  if (!mainRef.value) return true;
  const { scrollTop, scrollHeight, clientHeight } = mainRef.value;
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
  return distanceFromBottom < 100; // 距离底部小于 100px 认为在底部附近
};

const scrollToBottom = (immediate = false) => {
  if (mainRef.value && !userHasScrolledUp.value) {
    // 直接设置 scrollTop 更可靠
    if (immediate) {
      mainRef.value.scrollTop = mainRef.value.scrollHeight;
    } else {
      mainRef.value.scrollTo({
        top: mainRef.value.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
};

// 监听滚动事件，检测用户是否手动向上滚动
const handleScroll = () => {
  if (mainRef.value) {
    userHasScrolledUp.value = !isNearBottom();
  }
};

// 初始加载时滚动
onMounted(() => {
  if (messages.value.length === 1) {
    const scroll = () => {
      if (mainRef.value) {
        mainRef.value.scrollTop = mainRef.value.scrollHeight;
      }
    };
    
    // 使用多个时机确保滚动成功
    requestAnimationFrame(() => {
      scroll();
      setTimeout(scroll, 0);
      setTimeout(scroll, 50);
      setTimeout(scroll, 100);
      setTimeout(scroll, 200);
    });
  }
});

// 监听消息变化，自动滚动（仅在用户未向上滚动时）
watch(messages, async () => {
  await nextTick();
  if (messages.value.length === 1) {
    // 初始消息时总是滚动到底部
    const scroll = () => {
      if (mainRef.value) {
        mainRef.value.scrollTop = mainRef.value.scrollHeight;
      }
    };
    
    requestAnimationFrame(() => {
      scroll();
      setTimeout(scroll, 0);
      setTimeout(scroll, 50);
      setTimeout(scroll, 100);
      setTimeout(scroll, 200);
    });
    userHasScrolledUp.value = false; // 重置滚动状态
  } else if (messages.value.length > 1) {
    // 有新消息时，只有在用户未向上滚动时才自动滚动
    if (!userHasScrolledUp.value) {
      setTimeout(() => {
        scrollToBottom(false);
      }, 50);
    }
  }
}, { deep: true });

// 在流式输出时自动滚动到底部（仅在用户未向上滚动时）
let scrollInterval: ReturnType<typeof setInterval> | null = null;
watch([isLoading, messages], () => {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
  
  if (isLoading.value && messages.value.length > 0 && !userHasScrolledUp.value) {
    scrollInterval = setInterval(() => {
      if (mainRef.value && !userHasScrolledUp.value) {
        mainRef.value.scrollTop = mainRef.value.scrollHeight;
      }
    }, 100);
  }
}, { deep: true });

const handleSendMessage = async (content: string) => {
  if (isLoading.value) return;

  // Add user message
  const userMessage: Message = { role: Role.USER, content };
  messages.value = [...messages.value, userMessage];
  isLoading.value = true;
  // 用户发送新消息时，重置滚动状态，允许自动滚动
  userHasScrolledUp.value = false;

  // Create empty AI message for streaming
  const initialAiMessage: Message = {
    role: Role.ASSISTANT,
    content: ''
  };
  messages.value = [...messages.value, initialAiMessage];

  // Get the current history for API call
  const currentMessages = [...messages.value.slice(0, -1), userMessage];

  try {
    // Use streaming API
    let accumulatedContent = '';
    
    await fetchDeepSeekResponseStream(currentMessages, (chunk: string) => {
      accumulatedContent += chunk;
      // Update the last message (AI message) content incrementally
      messages.value = messages.value.map((msg, index) => {
        if (index === messages.value.length - 1 && msg.role === Role.ASSISTANT) {
          return {
            ...msg,
            content: accumulatedContent
          };
        }
        return msg;
      });
    });
  } catch (error) {
    console.error(error);
    // Update the last message with error content
    messages.value = messages.value.map((msg, index) => {
      if (index === messages.value.length - 1 && msg.role === Role.ASSISTANT) {
        return {
          role: Role.ASSISTANT,
          content: '抱歉，塔台信号似乎受干扰（网络连接异常），请稍后重试呼叫。'
        };
      }
      return msg;
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

