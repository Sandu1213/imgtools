<template>
  <div class="logo-container" :class="{ compact: isCompact }">
    <svg 
      class="logo-svg" 
      viewBox="0 0 240 60" 
      xmlns="http://www.w3.org/2000/svg"
      :width="isCompact ? '180' : '240'"
      :height="isCompact ? '45' : '60'"
    >
      <defs>
        <!-- 主品牌渐变 -->
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1d4ed8;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
        </linearGradient>
        
        <!-- 阴影滤镜 -->
        <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.1)"/>
        </filter>
        
        <!-- 图标渐变 -->
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- 图标部分 -->
      <g class="logo-icon" transform="translate(8, 8)">
        <!-- 背景圆形 -->
        <circle 
          cx="22" 
          cy="22" 
          r="20" 
          fill="url(#iconGradient)"
          filter="url(#logoShadow)"
        />
        
        <!-- 拼图网格 -->
        <g class="grid-pattern">
          <!-- 左上角 -->
          <rect 
            x="14" 
            y="14" 
            width="6" 
            height="6" 
            fill="white"
            rx="1"
            opacity="0.9"
          />
          
          <!-- 右上角 -->
          <rect 
            x="22" 
            y="14" 
            width="6" 
            height="6" 
            fill="white"
            rx="1"
            opacity="0.7"
          />
          
          <!-- 左下角 -->
          <rect 
            x="14" 
            y="22" 
            width="6" 
            height="6" 
            fill="white"
            rx="1"
            opacity="0.8"
          />
          
          <!-- 右下角 -->
          <rect 
            x="22" 
            y="22" 
            width="6" 
            height="6" 
            fill="white"
            rx="1"
            opacity="0.6"
          />
        </g>
        
        <!-- 中心连接点 -->
        <circle 
          cx="22" 
          cy="22" 
          r="1.5" 
          fill="white"
          opacity="0.8"
        />
      </g>
      
      <!-- 文字部分 -->
      <g class="logo-text" transform="translate(52, 16)">
        <!-- PhotoGrid -->
        <text 
          x="0" 
          y="18" 
          font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="20" 
          font-weight="700" 
          fill="url(#brandGradient)"
          filter="url(#logoShadow)"
        >
          PhotoGrid
        </text>
        
        <!-- Pro -->
        <text 
          x="120" 
          y="18" 
          font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="20" 
          font-weight="300" 
          fill="url(#brandGradient)"
          opacity="0.8"
        >
          Pro
        </text>
        
        <!-- 副标题 -->
        <text 
          x="0" 
          y="36" 
          font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="10" 
          font-weight="400" 
          fill="url(#brandGradient)"
          opacity="0.6"
          v-if="!isCompact"
        >
          Professional Photo Collage Tool
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isCompact?: boolean
}

withDefaults(defineProps<Props>(), {
  isCompact: false
})
</script>

<style scoped>
.logo-container {
  display: inline-block;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-container:hover {
  transform: translateY(-1px);
}

.logo-svg {
  display: block;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-icon {
  animation: float 6s ease-in-out infinite;
}

.grid-pattern {
  animation: pulse 4s ease-in-out infinite;
}

.logo-text {
  animation: fadeIn 0.8s ease-out;
}

.compact .logo-svg {
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1));
}

@keyframes float {
  0%, 100% { 
    transform: translate(8px, 8px) translateY(0px); 
  }
  50% { 
    transform: translate(8px, 8px) translateY(-1px); 
  }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1; 
  }
  50% { 
    opacity: 0.9; 
  }
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateX(-10px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .logo-container {
    transform: scale(0.8);
    transform-origin: left center;
  }
}

@media (max-width: 480px) {
  .logo-container {
    transform: scale(0.7);
  }
}
</style>
