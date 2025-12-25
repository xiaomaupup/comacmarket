<template>
  <div :class="`flex w-full group animate-fade-in-up ${isUser ? 'justify-end' : 'justify-start'}`">
    <div :class="`flex max-w-[90%] sm:max-w-[85%] md:max-w-[80%] ${isUser ? 'flex-row-reverse items-end' : 'flex-row items-start'}`">
      
      <!-- Message Bubble -->
      <div 
        :class="`
          relative p-4 md:p-5 text-sm md:text-[15px] leading-7 shadow-sm transition-all duration-300
          max-w-full overflow-hidden
          ${isUser 
            ? 'bg-user-bubble text-white rounded-2xl rounded-tr-none shadow-blue-500/20' 
            : 'bg-white/80 backdrop-blur-md border border-white/60 text-slate-800 rounded-2xl rounded-tl-none shadow-glass'
          }
        `"
      >
        <div v-if="isUser" class="whitespace-pre-wrap font-medium tracking-wide break-words">
          {{ message.content }}
        </div>
        <div v-else class="markdown-body overflow-hidden" v-html="renderedMarkdown"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';
import { Message, Role } from '../types';

interface Props {
  message: Message;
}

const props = defineProps<Props>();

const isUser = computed(() => props.message.role === Role.USER);

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
});

// 后处理函数：为HTML添加Tailwind类
const addTailwindClasses = (html: string): string => {
  let result = html;
  
  // 标题
  result = result.replace(/<h1>/g, '<h1 class="text-xl font-bold mb-3 text-slate-900 border-b border-slate-100 pb-2">');
  result = result.replace(/<h2>/g, '<h2 class="text-lg font-bold mb-3 text-slate-800 mt-4 flex items-center gap-2">');
  result = result.replace(/<h3>/g, '<h3 class="text-base font-bold mb-2 text-slate-800 mt-3">');
  
  // 段落
  result = result.replace(/<p>/g, '<p class="mb-3 last:mb-0 text-slate-700/90 break-words">');
  
  // 列表
  result = result.replace(/<ul>/g, '<ul class="list-disc list-outside mb-3 ml-4 space-y-1 text-slate-700">');
  result = result.replace(/<ol>/g, '<ol class="list-decimal list-outside mb-3 ml-4 space-y-1 text-slate-700">');
  result = result.replace(/<li>/g, '<li class="pl-1">');
  
  // 引用
  result = result.replace(/<blockquote>/g, '<blockquote class="border-l-4 border-blue-400 pl-4 py-1 my-3 bg-blue-50/50 rounded-r-lg text-slate-600 italic">');
  
  // 链接
  result = result.replace(/<a href="([^"]+)">/g, '<a href="$1" class="text-blue-600 hover:text-blue-700 underline underline-offset-2 decoration-blue-300 hover:decoration-blue-600 transition-all">');
  
  // 代码块（需要特殊处理）
  result = result.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
    return `
      <div class="relative group my-4 rounded-xl overflow-hidden shadow-lg shadow-black/5 ring-1 ring-slate-900/5">
        <div class="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="text-[10px] uppercase text-white/50 font-mono tracking-wider">${lang}</div>
        </div>
        <div class="bg-[#1e293b] text-slate-50 p-4 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed">
          <code class="language-${lang}">${code}</code>
        </div>
      </div>
    `;
  });
  
  // 行内代码
  result = result.replace(/<code(?! class="language-)/g, '<code class="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md text-xs font-mono border border-slate-200"');
  
  // 表格
  result = result.replace(/<table>/g, '<div class="overflow-x-auto my-4 -mx-2 px-2" style="WebkitOverflowScrolling: touch"><table class="min-w-full border-collapse border border-slate-200 rounded-lg overflow-hidden whitespace-nowrap">');
  result = result.replace(/<\/table>/g, '</table></div>');
  result = result.replace(/<thead>/g, '<thead class="bg-slate-50">');
  result = result.replace(/<tbody>/g, '<tbody class="bg-white">');
  result = result.replace(/<tr>/g, '<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">');
  result = result.replace(/<th>/g, '<th class="px-3 py-2 text-left font-semibold text-slate-700 border-r border-slate-200 last:border-r-0 text-xs sm:text-sm whitespace-nowrap">');
  result = result.replace(/<td>/g, '<td class="px-3 py-2 text-slate-600 border-r border-slate-100 last:border-r-0 text-xs sm:text-sm whitespace-nowrap">');
  
  return result;
};

const renderedMarkdown = computed(() => {
  try {
    const html = marked.parse(props.message.content) as string;
    return addTailwindClasses(html);
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return props.message.content;
  }
});
</script>

