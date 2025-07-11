<template>
  <div class="status-bar">
    <div class="status-left">
      <div class="status-item">
        <span class="status-label">模式:</span>
        <span class="status-value">{{ getModeText() }}</span>
      </div>
      
      <div class="status-item" v-if="currentLayout">
        <span class="status-label">布局:</span>
        <span class="status-value">{{ currentLayout.name }}</span>
      </div>
      
      <div class="status-item">
        <span class="status-label">图片:</span>
        <span class="status-value">{{ images.length }}</span>
      </div>
      
      <div class="status-item">
        <span class="status-label">标注:</span>
        <span class="status-value">{{ annotations.length }}</span>
      </div>
      
      <div class="status-item" v-if="selectedAnnotationId">
        <span class="status-label">选中:</span>
        <span class="status-value">{{ getSelectedAnnotationType() }}</span>
      </div>
    </div>
    
    <div class="status-right">
      <div class="status-actions">
        <button 
          class="status-action"
          @click="undo"
          :disabled="!canUndo"
          title="撤销 (Ctrl+Z)"
        >
          ↶
        </button>
        
        <button 
          class="status-action"
          @click="redo"
          :disabled="!canRedo"
          title="重做 (Ctrl+Y)"
        >
          ↷
        </button>
        
        <div class="status-separator"></div>
        
        <button 
          class="status-action"
          @click="showHelp"
          title="键盘快捷键 (F1)"
        >
          ?
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useImageStore } from '@/stores/imageStore'

const imageStore = useImageStore()
const { images, annotations, currentMode, currentLayout, selectedAnnotationId } = storeToRefs(imageStore)

const getModeText = () => {
  return currentMode.value === 'layout' ? '布局拼图' : '长图拼接'
}

const getSelectedAnnotationType = () => {
  if (!selectedAnnotationId.value) return ''
  
  const annotation = annotations.value.find(a => a.id === selectedAnnotationId.value)
  if (!annotation) return ''
  
  const typeMap = {
    text: '文字',
    arrow: '箭头',
    rectangle: '方框',
    circle: '圆形'
  }
  
  return typeMap[annotation.type] || annotation.type
}

const canUndo = computed(() => imageStore.canUndo())
const canRedo = computed(() => imageStore.canRedo())

const undo = () => {
  imageStore.undo()
}

const redo = () => {
  imageStore.redo()
}

const showHelp = () => {
  document.dispatchEvent(new CustomEvent('show-help'))
}
</script>

<style scoped>
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  padding: 8px 16px;
  font-size: 12px;
  color: #666;
  min-height: 32px;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-label {
  font-weight: 500;
}

.status-value {
  color: #333;
  font-weight: 600;
}

.status-right {
  display: flex;
  align-items: center;
}

.status-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #666;
}

.status-action:hover:not(:disabled) {
  background: #f0f0f0;
  border-color: #ccc;
  color: #333;
}

.status-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-separator {
  width: 1px;
  height: 16px;
  background: #ddd;
  margin: 0 4px;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .status-bar {
    flex-direction: column;
    gap: 8px;
    padding: 8px 12px;
  }
  
  .status-left {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .status-item {
    font-size: 11px;
  }
}
</style>
