<template>
  <div class="simple-logo">
    <svg 
      class="logo-icon" 
      :width="size" 
      :height="size" 
      viewBox="0 0 40 40" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- 背景圆形 -->
      <circle 
        cx="20" 
        cy="20" 
        r="18" 
        fill="url(#logoGradient)"
      />
      
      <!-- 拼图网格 -->
      <g class="grid-pattern">
        <rect x="12" y="12" width="6" height="6" fill="white" rx="1" opacity="0.9"/>
        <rect x="22" y="12" width="6" height="6" fill="white" rx="1" opacity="0.7"/>
        <rect x="12" y="22" width="6" height="6" fill="white" rx="1" opacity="0.8"/>
        <rect x="22" y="22" width="6" height="6" fill="white" rx="1" opacity="0.6"/>
      </g>
      
      <!-- 中心连接点 -->
      <circle cx="20" cy="20" r="1.5" fill="white" opacity="0.9"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: number
}

withDefaults(defineProps<Props>(), {
  size: 40
})
</script>

<style scoped>
.simple-logo {
  display: inline-block;
  transition: all 0.3s ease;
}

.simple-logo:hover {
  transform: translateY(-1px);
}

.logo-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.grid-pattern {
  animation: subtle-pulse 4s ease-in-out infinite;
}

@keyframes subtle-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.95; }
}
</style>
