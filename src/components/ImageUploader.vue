<template>
  <div class="image-uploader">
    <h3>{{ texts.uploadTitle }}</h3>
    
    <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop">
      <input 
        ref="fileInput" 
        type="file" 
        multiple 
        accept="image/*" 
        @change="handleFileSelect"
        style="display: none"
      />
      <div class="upload-content">
        <div class="upload-icon">📁</div>
        <p>{{ texts.dragUpload }}</p>
        <p class="upload-hint">{{ texts.uploadSubtitle }}</p>
      </div>
    </div>
    
    <div v-if="images.length > 0" class="image-list">
      <div 
        v-for="(image, index) in images" 
        :key="image.id" 
        class="image-item"
        :class="{ 'dragging': draggedIndex === index }"
        draggable="true"
        @dragstart="handleDragStart(index, $event)"
        @dragover.prevent="handleDragOver(index)"
        @drop.prevent="handleImageDrop(index)"
        @dragend="handleDragEnd"
      >
        <div class="drag-handle" title="拖拽调整顺序">
          ≡
        </div>
        <img :src="image.url" :alt="image.file.name" />
        <div class="image-info">
          <span class="image-name">{{ image.file.name }}</span>
          <span class="image-size">{{ formatFileSize(image.file.size) }}</span>
        </div>
        <button class="remove-btn" @click="removeImage(image.id)">×</button>
      </div>
    </div>
    
    <div v-if="images.length > 0" class="upload-actions">
      <button class="clear-btn" @click="clearAllImages">{{ texts.clearAll }}</button>
      <button class="random-btn" @click="randomizeImages">{{ texts.randomSort }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useImageStore } from '@/stores/imageStore'
import { useLanguageStore } from '@/stores/languageStore'

const imageStore = useImageStore()
const languageStore = useLanguageStore()

const { images } = storeToRefs(imageStore)
const { addImage, removeImage, reorderImages } = imageStore

const { texts } = storeToRefs(languageStore)

const fileInput = ref<HTMLInputElement | null>(null)
const draggedIndex = ref<number | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    handleFiles(target.files)
  }
}

const handleFileDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files) {
    handleFiles(event.dataTransfer.files)
  }
}

const handleFiles = (files: FileList) => {
  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      addImage(file)
    }
  })
}

// 拖拽排序相关方法
const handleDragStart = (index: number, event: DragEvent) => {
  draggedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', index.toString())
  }
}

const handleDragOver = (_index: number) => {
  // 这里可以添加视觉反馈逻辑
}

const handleImageDrop = (targetIndex: number) => {
  if (draggedIndex.value !== null && draggedIndex.value !== targetIndex) {
    // 重新排序图片
    const draggedImage = images.value[draggedIndex.value]
    const newImages = [...images.value]
    
    // 删除被拖拽的图片
    newImages.splice(draggedIndex.value, 1)
    
    // 在目标位置插入图片
    const insertIndex = draggedIndex.value < targetIndex ? targetIndex - 1 : targetIndex
    newImages.splice(insertIndex, 0, draggedImage)
    
    // 更新图片顺序
    reorderImages(newImages)
  }
}

const handleDragEnd = () => {
  draggedIndex.value = null
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const clearAllImages = () => {
  images.value.forEach(image => {
    removeImage(image.id)
  })
}

const randomizeImages = () => {
  // 简单的随机排序
  const shuffled = [...images.value].sort(() => Math.random() - 0.5)
  reorderImages(shuffled)
}
</script>

<style scoped>
.image-uploader {
  margin-bottom: 20px;
}

.image-uploader h3 {
  margin: 0 0 10px;
  color: #333;
}

.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: #007bff;
  background: #f8f9fa;
}

.upload-content {
  color: #666;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.image-list {
  margin-top: 15px;
  max-height: 200px;
  overflow-y: auto;
}

.image-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 8px;
  background: white;
  cursor: grab;
  transition: all 0.2s;
  user-select: none;
}

.image-item:hover {
  border-color: #007bff;
  background: #f8f9fa;
}

.image-item.dragging {
  opacity: 0.5;
  transform: scale(0.95);
  border-color: #007bff;
  background: #e3f2fd;
}

.image-item:active {
  cursor: grabbing;
}

.drag-handle {
  font-size: 14px;
  color: #999;
  cursor: grab;
  padding: 2px 4px;
  user-select: none;
}

.drag-handle:hover {
  color: #007bff;
}

.image-item img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.image-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.image-name {
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-size {
  font-size: 10px;
  color: #666;
}

.remove-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #ff3838;
}

.upload-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.clear-btn,
.random-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  font-size: 12px;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #ff4757;
  color: white;
  border-color: #ff4757;
}

.random-btn:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .upload-area {
    padding: 20px;
    margin-bottom: 15px;
  }
  
  .upload-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }
  
  .upload-area p {
    font-size: 14px;
    margin-bottom: 5px;
  }
  
  .upload-hint {
    font-size: 11px;
  }
  
  .image-list {
    max-height: 150px;
  }
  
  .image-item {
    padding: 10px;
    border-radius: 6px;
  }
  
  .image-item img {
    width: 45px;
    height: 45px;
  }
  
  .image-name {
    font-size: 13px;
  }
  
  .image-size {
    font-size: 11px;
  }
  
  .remove-btn {
    width: 28px;
    height: 28px;
    font-size: 18px;
  }
  
  .drag-handle {
    font-size: 16px;
    padding: 4px 6px;
  }
  
  .upload-actions {
    margin-top: 15px;
    gap: 12px;
  }
  
  .clear-btn,
  .random-btn {
    padding: 12px 16px;
    font-size: 14px;
    border-radius: 6px;
  }
}

@media (max-width: 480px) {
  .upload-area {
    padding: 15px;
  }
  
  .upload-icon {
    font-size: 28px;
  }
  
  .upload-area p {
    font-size: 13px;
  }
  
  .upload-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .clear-btn,
  .random-btn {
    width: 100%;
    padding: 10px;
    font-size: 13px;
  }
}
</style>
