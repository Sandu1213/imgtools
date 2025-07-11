<template>
  <div class="export-settings">
    <h3>{{ texts.exportTitle }}</h3>
    
    <div class="setting-group">
      <label>{{ texts.exportFormat }}：</label>
      <div class="format-buttons">
        <button 
          class="format-btn"
          :class="{ active: exportFormat === 'png' }"
          @click="exportFormat = 'png'"
        >
          PNG（无损）
        </button>
        <button 
          class="format-btn"
          :class="{ active: exportFormat === 'jpeg' }"
          @click="exportFormat = 'jpeg'"
        >
          JPG（压缩）
        </button>
      </div>
    </div>
    
    <div v-if="exportFormat === 'jpeg'" class="setting-group">
      <div class="slider-control">
        <div class="slider-label-value">
          <label>图片质量:</label>
          <span class="value-display">{{ Math.round(jpegQuality * 100) }}%</span>
        </div>
        <input 
          v-model.number="jpegQuality" 
          type="range" 
          min="0.1" 
          max="1" 
          step="0.1"
          class="thin-slider"
        />
      </div>
    </div>
    
    <div class="setting-group">
      <label>导出尺寸：</label>
      <div class="size-options">
        <button 
          class="size-btn"
          :class="{ active: exportSize === 'original' }"
          @click="exportSize = 'original'"
        >
          原始尺寸
        </button>
        <button 
          class="size-btn"
          :class="{ active: exportSize === 'hd' }"
          @click="exportSize = 'hd'"
        >
          高清 (2x)
        </button>
        <button 
          class="size-btn"
          :class="{ active: exportSize === 'custom' }"
          @click="exportSize = 'custom'"
        >
          自定义
        </button>
      </div>
    </div>
    
    <div v-if="exportSize === 'custom'" class="setting-group">
      <label>自定义尺寸：</label>
      <div class="custom-size">
        <input 
          v-model.number="customWidth" 
          type="number" 
          min="100" 
          max="8000"
          placeholder="宽度"
        />
        <span>×</span>
        <input 
          v-model.number="customHeight" 
          type="number" 
          min="100" 
          max="8000"
          placeholder="高度"
        />
      </div>
    </div>
    
    <div class="setting-group">
      <label>文件名：</label>
      <input 
        v-model="filename" 
        type="text" 
        placeholder="拼图作品"
        class="filename-input"
      />
    </div>
    
    <div class="export-actions">
      <button 
        class="export-btn primary"
        @click="exportImage"
        :disabled="!canExport"
      >
        <span v-if="isExporting">导出中...</span>
        <span v-else>📥 下载图片</span>
      </button>
      <button 
        class="export-btn secondary"
        @click="previewImage"
        :disabled="!canExport"
      >
        👀 预览
      </button>
    </div>
    
    <div class="export-tips">
      <p>💡 导出提示：</p>
      <ul>
        <li>PNG格式支持透明背景，文件较大</li>
        <li>JPG格式文件较小，适合分享</li>
        <li>高清模式可获得更好的打印效果</li>
        <li>导出过程完全在本地完成</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useImageStore } from '@/stores/imageStore'
import { useLanguageStore } from '@/stores/languageStore'

const imageStore = useImageStore()
const languageStore = useLanguageStore()

const { images, canvasSettings } = storeToRefs(imageStore)
const { texts } = storeToRefs(languageStore)

const exportFormat = ref<'png' | 'jpeg'>('png')
const jpegQuality = ref(0.9)
const exportSize = ref<'original' | 'hd' | 'custom'>('original')
const customWidth = ref(1920)
const customHeight = ref(1080)
const filename = ref('拼图作品')
const isExporting = ref(false)

const canExport = computed(() => {
  return images.value.length > 0 && !isExporting.value
})

const getExportDimensions = () => {
  const baseWidth = canvasSettings.value.width
  const baseHeight = canvasSettings.value.height
  
  switch (exportSize.value) {
    case 'original':
      return { width: baseWidth, height: baseHeight }
    case 'hd':
      return { width: baseWidth * 2, height: baseHeight * 2 }
    case 'custom':
      return { width: customWidth.value, height: customHeight.value }
    default:
      return { width: baseWidth, height: baseHeight }
  }
}

const exportImage = async () => {
  if (!canExport.value) return
  
  isExporting.value = true
  
  try {
    // 这里需要获取 canvas 元素进行导出
    const canvas = document.querySelector('canvas')
    if (!canvas) {
      throw new Error('Canvas not found')
    }
    
    const { width, height } = getExportDimensions()
    
    // 创建一个新的 canvas 用于导出
    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = width
    exportCanvas.height = height
    const ctx = exportCanvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('Unable to get canvas context')
    }
    
    // 绘制背景
    ctx.fillStyle = canvasSettings.value.backgroundColor
    ctx.fillRect(0, 0, width, height)
    
    // 将原始 canvas 内容绘制到导出 canvas
    ctx.drawImage(canvas, 0, 0, width, height)
    
    // 导出图片
    const mimeType = exportFormat.value === 'png' ? 'image/png' : 'image/jpeg'
    const quality = exportFormat.value === 'jpeg' ? jpegQuality.value : undefined
    
    exportCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename.value}.${exportFormat.value}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    }, mimeType, quality)
    
  } catch (error) {
    console.error('Export failed:', error)
    alert('导出失败，请重试')
  } finally {
    isExporting.value = false
  }
}

const previewImage = () => {
  if (!canExport.value) return
  
  const canvas = document.querySelector('canvas')
  if (!canvas) {
    alert('预览失败，请重试')
    return
  }
  
  const previewWindow = window.open('', '_blank')
  if (previewWindow) {
    const img = new Image()
    img.src = canvas.toDataURL('image/png')
    img.style.maxWidth = '100%'
    img.style.height = 'auto'
    
    previewWindow.document.write(`
      <html>
        <head>
          <title>图片预览</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              background: #f0f0f0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          ${img.outerHTML}
        </body>
      </html>
    `)
    previewWindow.document.close()
  }
}
</script>

<style scoped>
.export-settings {
  margin-bottom: 20px;
}

.export-settings h3 {
  margin: 0 0 15px;
  color: #333;
}

.setting-group {
  margin-bottom: 15px;
}

.setting-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

.format-buttons,
.size-options {
  display: flex;
  gap: 8px;
}

.format-btn,
.size-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  text-align: center;
}

.format-btn.active,
.size-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.format-btn:hover,
.size-btn:hover {
  border-color: #007bff;
}

.setting-group input[type="range"] {
  width: 100%;
  margin-right: 8px;
}

/* 滑块控件样式 */
.slider-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slider-label-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.slider-label-value label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin: 0;
}

.thin-slider {
  width: 100%;
  height: 4px;
  background: #e1e1e1;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  transition: background-color 0.3s ease;
}

.thin-slider:hover {
  background: #d1d1d1;
}

.thin-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #007AFF;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 122, 255, 0.3);
  transition: all 0.2s ease;
}

.thin-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 8px rgba(0, 122, 255, 0.4);
}

.thin-slider::-webkit-slider-thumb:active {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.5);
}

.thin-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #007AFF;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 122, 255, 0.3);
  transition: all 0.2s ease;
}

.thin-slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 8px rgba(0, 122, 255, 0.4);
}

.thin-slider::-moz-range-thumb:active {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.5);
}

.thin-slider::-moz-range-track {
  height: 4px;
  background: #e1e1e1;
  border-radius: 2px;
  border: none;
}

.thin-slider:hover::-moz-range-track {
  background: #d1d1d1;
}

.value-display {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  min-width: 40px;
  text-align: right;
}

.custom-size {
  display: flex;
  align-items: center;
  gap: 8px;
}

.custom-size input {
  flex: 1;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.filename-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.export-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.export-btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s;
}

.export-btn.primary {
  background: #28a745;
  color: white;
}

.export-btn.primary:hover {
  background: #218838;
}

.export-btn.secondary {
  background: #6c757d;
  color: white;
}

.export-btn.secondary:hover {
  background: #5a6268;
}

.export-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.export-tips {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  border-left: 4px solid #ffc107;
}

.export-tips p {
  margin: 0 0 8px;
  font-size: 12px;
  color: #666;
  font-weight: bold;
}

.export-tips ul {
  margin: 0;
  padding-left: 16px;
}

.export-tips li {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}
</style>
