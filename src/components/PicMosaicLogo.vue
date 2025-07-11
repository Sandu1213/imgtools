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
        <!-- 渐变定义 -->
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
        </linearGradient>
        
        <!-- 阴影滤镜 -->
        <filter id="logoShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.1)"/>
        </filter>
        
        <!-- 图标渐变 -->
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- 背景圆角矩形 -->
      <rect 
        x="2" y="2" 
        width="56" height="56" 
        rx="12" ry="12" 
        fill="url(#iconGradient)" 
        filter="url(#logoShadow)"
        opacity="0.1"
      />
      
      <!-- 主图标 - 拼图网格 -->
      <g transform="translate(8, 8)">
        <!-- 网格背景 -->
        <rect x="4" y="4" width="36" height="36" rx="6" fill="url(#iconGradient)" opacity="0.2"/>
        
        <!-- 拼图块1 -->
        <path d="M8 8 L20 8 Q22 8 22 10 L22 20 Q22 22 20 22 L8 22 Q6 22 6 20 L6 10 Q6 8 8 8 Z" 
              fill="url(#iconGradient)" opacity="0.9"/>
        
        <!-- 拼图块2 -->
        <path d="M22 8 L34 8 Q36 8 36 10 L36 20 Q36 22 34 22 L22 22 L22 8 Z" 
              fill="url(#iconGradient)" opacity="0.7"/>
        
        <!-- 拼图块3 -->
        <path d="M8 22 L20 22 L20 34 Q20 36 18 36 L8 36 Q6 36 6 34 L6 22 Z" 
              fill="url(#iconGradient)" opacity="0.8"/>
        
        <!-- 拼图块4 -->
        <path d="M22 22 L34 22 Q36 22 36 24 L36 34 Q36 36 34 36 L22 36 L22 22 Z" 
              fill="url(#iconGradient)" opacity="0.6"/>
        
        <!-- 连接器装饰 -->
        <circle cx="22" cy="15" r="2" fill="#ffffff" opacity="0.8"/>
        <circle cx="15" cy="22" r="2" fill="#ffffff" opacity="0.8"/>
        <circle cx="29" cy="29" r="2" fill="#ffffff" opacity="0.8"/>
        
        <!-- 亮点装饰 -->
        <circle cx="12" cy="12" r="1.5" fill="#ffffff" opacity="0.6"/>
        <circle cx="30" cy="12" r="1.5" fill="#ffffff" opacity="0.6"/>
        <circle cx="12" cy="30" r="1.5" fill="#ffffff" opacity="0.6"/>
        <circle cx="30" cy="30" r="1.5" fill="#ffffff" opacity="0.6"/>
      </g>
      
      <!-- 文字标题 -->
      <text 
        x="70" y="25" 
        font-family="'Segoe UI', 'Microsoft YaHei', sans-serif" 
        font-size="18" 
        font-weight="700" 
        fill="url(#logoGradient)"
        filter="url(#logoShadow)"
      >
        PicMosaic
      </text>
      
      <!-- 副标题 -->
      <text 
        x="70" y="42" 
        font-family="'Segoe UI', 'Microsoft YaHei', sans-serif" 
        font-size="11" 
        font-weight="400" 
        fill="#6b7280"
        opacity="0.8"
      >
        Creative Studio
      </text>
      
      <!-- 装饰线条 -->
      <line 
        x1="70" y1="47" 
        x2="200" y2="47" 
        stroke="url(#logoGradient)" 
        stroke-width="1" 
        opacity="0.3"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isCompact?: boolean
}

defineProps<Props>()
</script>

<style scoped>
.logo-container {
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
}

.logo-svg {
  transition: all 0.3s ease;
}

.logo-container:hover .logo-svg {
  transform: scale(1.02);
}

.logo-container.compact {
  transform: scale(0.85);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .logo-container {
    transform: scale(0.8);
  }
  
  .logo-container.compact {
    transform: scale(0.7);
  }
}

@media (max-width: 480px) {
  .logo-container {
    transform: scale(0.75);
  }
  
  .logo-container.compact {
    transform: scale(0.65);
  }
}
</style>
