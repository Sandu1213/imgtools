<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    :class="['feature-icon', `icon-${name}`]"
  >
    <defs>
      <linearGradient :id="`gradient-${name}`" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" :style="`stop-color:${gradientStart};stop-opacity:1`" />
        <stop offset="100%" :style="`stop-color:${gradientEnd};stop-opacity:1`" />
      </linearGradient>
    </defs>
    
    <!-- 上传图标 -->
    <g v-if="name === 'upload'">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="url(#gradient-upload)" stroke-width="2"/>
      <path d="M12 8v8M8 12l4-4 4 4" fill="none" stroke="url(#gradient-upload)" stroke-width="2" stroke-linecap="round"/>
      <circle cx="8" cy="8" r="1.5" fill="url(#gradient-upload)" opacity="0.7"/>
      <circle cx="16" cy="16" r="1.5" fill="url(#gradient-upload)" opacity="0.7"/>
    </g>
    
    <!-- 网格布局图标 -->
    <g v-if="name === 'grid'">
      <rect x="3" y="3" width="7" height="7" rx="1" fill="url(#gradient-grid)" opacity="0.8"/>
      <rect x="14" y="3" width="7" height="7" rx="1" fill="url(#gradient-grid)" opacity="0.9"/>
      <rect x="3" y="14" width="7" height="7" rx="1" fill="url(#gradient-grid)" opacity="0.7"/>
      <rect x="14" y="14" width="7" height="7" rx="1" fill="url(#gradient-grid)" opacity="0.6"/>
      <!-- 连接线 -->
      <line x1="10.5" y1="6.5" x2="13.5" y2="6.5" stroke="url(#gradient-grid)" stroke-width="1" opacity="0.5"/>
      <line x1="6.5" y1="10.5" x2="6.5" y2="13.5" stroke="url(#gradient-grid)" stroke-width="1" opacity="0.5"/>
    </g>
    
    <!-- 全景拼接图标 -->
    <g v-if="name === 'panorama'">
      <rect x="2" y="7" width="20" height="10" rx="2" fill="none" stroke="url(#gradient-panorama)" stroke-width="2"/>
      <rect x="4" y="9" width="4" height="6" rx="1" fill="url(#gradient-panorama)" opacity="0.8"/>
      <rect x="10" y="9" width="4" height="6" rx="1" fill="url(#gradient-panorama)" opacity="0.6"/>
      <rect x="16" y="9" width="4" height="6" rx="1" fill="url(#gradient-panorama)" opacity="0.7"/>
      <!-- 连接指示器 -->
      <circle cx="8" cy="12" r="1" fill="#ffffff"/>
      <circle cx="14" cy="12" r="1" fill="#ffffff"/>
    </g>
    
    <!-- 创意工具图标 -->
    <g v-if="name === 'tools'">
      <circle cx="12" cy="12" r="9" fill="none" stroke="url(#gradient-tools)" stroke-width="2" opacity="0.3"/>
      <!-- 画笔 -->
      <path d="M6 18L8 16l2-2 6-6 2 2-6 6-2 2-2 2z" fill="url(#gradient-tools)" opacity="0.8"/>
      <!-- 文字 A -->
      <text x="15" y="10" font-family="Arial" font-size="6" font-weight="bold" fill="url(#gradient-tools)">A</text>
      <!-- 箭头 -->
      <path d="M16 14l3 1.5-3 1.5v-1h-3v-1h3v-1z" fill="url(#gradient-tools)" opacity="0.7"/>
      <!-- 形状 -->
      <rect x="6" y="6" width="3" height="3" rx="0.5" fill="url(#gradient-tools)" opacity="0.6"/>
    </g>
    
    <!-- 导出图标 -->
    <g v-if="name === 'export'">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="url(#gradient-export)" stroke-width="2"/>
      <path d="M12 16V8M8 12l4 4 4-4" fill="none" stroke="url(#gradient-export)" stroke-width="2" stroke-linecap="round"/>
      <path d="M8 21h8" stroke="url(#gradient-export)" stroke-width="2" stroke-linecap="round"/>
      <!-- 文件指示器 -->
      <rect x="14" y="6" width="4" height="1" rx="0.5" fill="url(#gradient-export)" opacity="0.5"/>
      <rect x="14" y="8" width="3" height="1" rx="0.5" fill="url(#gradient-export)" opacity="0.5"/>
    </g>
    
    <!-- 设置图标 -->
    <g v-if="name === 'settings'">
      <circle cx="12" cy="12" r="3" fill="none" stroke="url(#gradient-settings)" stroke-width="2"/>
      <circle cx="12" cy="12" r="1" fill="url(#gradient-settings)"/>
      <!-- 齿轮齿 -->
      <g stroke="url(#gradient-settings)" stroke-width="2" stroke-linecap="round">
        <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  name: 'upload' | 'grid' | 'panorama' | 'tools' | 'export' | 'settings'
  size?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24
})

// 为不同图标定义渐变色
const gradientColors = {
  upload: { start: '#4facfe', end: '#00f2fe' },
  grid: { start: '#667eea', end: '#764ba2' },
  panorama: { start: '#f093fb', end: '#f5576c' },
  tools: { start: '#ffecd2', end: '#fcb69f' },
  export: { start: '#a8edea', end: '#fed6e3' },
  settings: { start: '#89f7fe', end: '#66a6ff' }
}

const gradientStart = gradientColors[props.name]?.start || '#667eea'
const gradientEnd = gradientColors[props.name]?.end || '#764ba2'
</script>

<style scoped>
.feature-icon {
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.feature-icon:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

/* 特定图标的动画效果 */
.icon-upload:hover {
  animation: uploadBounce 0.6s ease-in-out;
}

.icon-grid:hover {
  animation: gridPulse 0.8s ease-in-out;
}

.icon-panorama:hover {
  animation: panoramaSlide 0.7s ease-in-out;
}

.icon-tools:hover {
  animation: toolsRotate 0.5s ease-in-out;
}

.icon-export:hover {
  animation: exportGlow 0.6s ease-in-out;
}

@keyframes uploadBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1) translateY(-2px); }
}

@keyframes gridPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes panoramaSlide {
  0%, 100% { transform: scale(1) translateX(0); }
  50% { transform: scale(1.05) translateX(2px); }
}

@keyframes toolsRotate {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(5deg); }
}

@keyframes exportGlow {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1)); }
  50% { transform: scale(1.1); filter: drop-shadow(0 6px 12px rgba(168, 237, 234, 0.4)); }
}
</style>
