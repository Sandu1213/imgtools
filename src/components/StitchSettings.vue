<template>
  <div class="stitch-settings">
    <h3>{{ texts.stitchTitle }}</h3>
    
    <div class="setting-group">
      <label>{{ texts.stitchDirection }}：</label>
      <div class="direction-controls">
        <button 
          class="direction-btn"
          :class="{ active: stitchSettings.direction === 'vertical' }"
          @click="setDirection('vertical')"
        >
           {{ texts.vertical }}
        </button>
        <button 
          class="direction-btn"
          :class="{ active: stitchSettings.direction === 'horizontal' }"
          @click="setDirection('horizontal')"
        >
           {{ texts.horizontal }}
        </button>
      </div>
    </div> 
    
    <div v-if="images.length > 0" class="stitch-preview">
      <h4>图片顺序：</h4>
      <div class="image-order-list">
        <div 
          v-for="(image, index) in images" 
          :key="image.id"
          class="order-item"
          draggable="true"
          @dragstart="handleDragStart(index)"
          @dragover.prevent
          @drop="handleDrop(index)"
        >
          <span class="order-number">{{ index + 1 }}</span>
          <img :src="image.url" :alt="image.file.name" />
          <span class="image-name">{{ image.file.name }}</span>
        </div>
      </div>
      <div class="order-actions">
        <button class="action-btn" @click="reverseOrder">反转顺序</button>
        <button class="action-btn" @click="randomizeOrder">随机排序</button>
      </div>
    </div>
    
    <div class="stitch-tips">
      <p>💡 提示：</p>
      <ul>
        <li>拖拽图片可以调整拼接顺序</li>
        <li>纵向拼接适合截图、聊天记录等</li>
        <li>横向拼接适合全景图、对比图等</li>
        <li>完成后可以添加文字、箭头等标注</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useImageStore } from '@/stores/imageStore'
import { useLanguageStore } from '@/stores/languageStore'

const imageStore = useImageStore()
const languageStore = useLanguageStore()

const { images, stitchSettings } = storeToRefs(imageStore)
const { updateStitchSettings } = imageStore

const { texts } = storeToRefs(languageStore)

const alignment = ref(stitchSettings.value.alignment)
const draggedIndex = ref<number | null>(null)

const setDirection = (direction: 'vertical' | 'horizontal') => {
  updateStitchSettings({ direction })
}

const handleDragStart = (index: number) => {
  draggedIndex.value = index
}

const handleDrop = (targetIndex: number) => {
  if (draggedIndex.value !== null && draggedIndex.value !== targetIndex) {
    const imagesCopy = [...images.value]
    const draggedImage = imagesCopy[draggedIndex.value]
    imagesCopy.splice(draggedIndex.value, 1)
    imagesCopy.splice(targetIndex, 0, draggedImage)
    
    // 更新图片顺序
    images.value.length = 0
    images.value.push(...imagesCopy)
  }
  draggedIndex.value = null
}

const reverseOrder = () => {
  images.value.reverse()
}

const randomizeOrder = () => {
  images.value.sort(() => Math.random() - 0.5)
}

// 监听 store 中的变化
watch(stitchSettings, (newSettings) => {
  alignment.value = newSettings.alignment
}, { deep: true })
</script>

<style scoped>
.stitch-settings {
  margin-bottom: 20px;
}

.stitch-settings h3 {
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

.direction-controls {
  display: flex;
  gap: 8px;
}

.direction-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.direction-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.direction-btn:hover {
  border-color: #007bff;
}

.setting-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.stitch-preview {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.stitch-preview h4 {
  margin: 0 0 10px;
  font-size: 14px;
  color: #333;
}

.image-order-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 4px;
  background: white;
  cursor: move;
  transition: all 0.2s;
}

.order-item:hover {
  background: #f8f9fa;
  border-color: #007bff;
}

.order-number {
  width: 24px;
  height: 24px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.order-item img {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 4px;
}

.image-name {
  flex: 1;
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f8f9fa;
  border-color: #007bff;
}

.stitch-tips {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  border-left: 4px solid #28a745;
  margin-top: 15px;
}

.stitch-tips p {
  margin: 0 0 8px;
  font-size: 12px;
  color: #666;
  font-weight: bold;
}

.stitch-tips ul {
  margin: 0;
  padding-left: 16px;
}

.stitch-tips li {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .stitch-settings {
    padding: 0;
    margin-bottom: 15px;
  }
  
  .setting-group {
    margin-bottom: 15px;
  }
  
  .setting-group label {
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .direction-controls {
    gap: 10px;
  }
  
  .direction-btn {
    padding: 12px 16px;
    font-size: 14px;
    border-radius: 6px;
  }
  
  .stitch-preview {
    margin-top: 15px;
    padding-top: 12px;
  }
  
  .stitch-preview h4 {
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .image-order-list {
    max-height: 150px;
  }
  
  .order-item {
    padding: 10px;
    gap: 12px;
    border-radius: 6px;
    margin-bottom: 6px;
  }
  
  .order-number {
    width: 28px;
    height: 28px;
    font-size: 13px;
  }
  
  .order-item img {
    width: 36px;
    height: 36px;
  }
  
  .image-name {
    font-size: 13px;
  }
  
  .order-actions {
    gap: 10px;
    margin-top: 12px;
  }
  
  .action-btn {
    padding: 10px 16px;
    font-size: 14px;
    border-radius: 6px;
  }
  
  .stitch-tips {
    padding: 12px;
    margin-top: 12px;
  }
  
  .stitch-tips p {
    font-size: 12px;
  }
  
  .stitch-tips li {
    font-size: 11px;
    margin-bottom: 6px;
  }
}

@media (max-width: 480px) {
  .direction-controls {
    flex-direction: column;
    gap: 8px;
  }
  
  .direction-btn {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .image-order-list {
    max-height: 120px;
  }
  
  .order-item {
    padding: 8px;
    gap: 10px;
  }
  
  .order-number {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
  
  .order-item img {
    width: 32px;
    height: 32px;
  }
  
  .image-name {
    font-size: 12px;
  }
  
  .order-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-btn {
    width: 100%;
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .stitch-tips {
    padding: 10px;
  }
  
  .stitch-tips p {
    font-size: 11px;
  }
  
  .stitch-tips li {
    font-size: 10px;
  }
}
</style>
