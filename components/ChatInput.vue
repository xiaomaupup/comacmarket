<template>
  <div class="fixed bottom-0 left-0 right-0 z-20 px-4 pb-1.5 pt-1.5 bg-sky-gradient">
    <div class="max-w-3xl mx-auto">
      <!-- Floating Input Container -->
      <div 
        :class="`
          relative flex items-center gap-1.5 p-1.5 
          bg-white/90 backdrop-blur-xl border border-white/50 
          rounded-[24px] shadow-float transition-all duration-300
          focus-within:shadow-lg focus-within:ring-2 focus-within:ring-blue-100/50
        `"
      >
        <div class="pl-2.5 flex items-center text-blue-400">
          <Sparkles :size="18" :class="{ 'animate-pulse': isLoading }" />
        </div>

        <textarea
          ref="textareaRef"
          :value="text"
          @input="handleInput"
          @keydown="handleKeyDown"
          :placeholder="isLoading ? '正在思考中...' : '请输入您的问题'"
          class="flex-1 max-h-[100px] bg-transparent border-none focus:ring-0 resize-none py-2 px-2 text-base text-slate-700 placeholder:text-slate-400 leading-normal"
          rows="1"
          :disabled="isLoading"
        />
        
        <button
          @click="handleSubmit"
          :disabled="!text.trim() || isLoading"
          :class="`
            group flex items-center justify-center
            w-9 h-9 rounded-full flex-shrink-0 transition-all duration-300
            ${!text.trim() || isLoading 
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
              : 'bg-user-bubble text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105 active:scale-95'
            }
          `"
        >
          <Send 
            :size="16" 
            :class="`transform transition-transform ${text.trim() && !isLoading ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5' : ''}`" 
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Send, Sparkles } from 'lucide-vue-next';

interface Props {
  onSend: (content: string) => void;
  isLoading: boolean;
}

const props = defineProps<Props>();

const text = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Auto-resize textarea
watch(text, async () => {
  await nextTick();
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 100)}px`;
  }
});

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  text.value = target.value;
};

const handleSubmit = () => {
  if (!text.value.trim() || props.isLoading) return;
  props.onSend(text.value.trim());
  text.value = '';
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
};
</script>

