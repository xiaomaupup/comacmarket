<template>
  <header class="sticky top-0 z-30 flex items-center justify-between h-16 w-full px-4">
    <!-- Blurry Backdrop -->
    <div class="absolute inset-0 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"></div>
    
    <!-- Left Content -->
    <div class="relative z-10 flex items-center gap-3">
      <div class="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 text-white transform -rotate-6">
        <Plane :size="20" class="transform rotate-45" />
      </div>
      <div class="flex flex-col">
        <h1 class="text-lg font-bold tracking-tight text-slate-800 leading-none">
          Comac AI
        </h1>
        <span class="text-[10px] uppercase tracking-widest text-blue-600/80 font-semibold mt-0.5">
          Smart Assistant
        </span>
      </div>
    </div>

    <!-- Right Close Button -->
    <div class="relative z-10">
      <button
        @click="handleClose"
        class="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 transition-colors duration-200 text-slate-600 hover:text-slate-800"
        aria-label="关闭"
      >
        <X :size="18" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Plane, X } from 'lucide-vue-next';

const handleClose = () => {
  // 可以在这里添加关闭逻辑，比如关闭窗口或返回上一页
  window.close();
};
</script>

