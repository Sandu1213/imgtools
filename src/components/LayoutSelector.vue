<template>
  <div class="layout-selector">
    <h3>{{ texts.layoutTitle }}</h3>
    
    <div class="image-count-selector">
      <label>图片数量：</label>
      <select v-model="selectedCount" @change="onCountChange">
        <option v-for="count in availableCounts" :key="count" :value="count">
          {{ count }}张图片
        </option>
      </select>
    </div>
    
    <div class="layout-grid">
      <div 
        v-for="layout in availableLayouts" 
        :key="layout.id"
        class="layout-item"
        :class="{ active: currentLayout?.id === layout.id }"
        @click="selectLayout(layout)"
      >
        <div class="layout-preview">
          <div 
            v-for="(cell, index) in layout.cells" 
            :key="index"
            class="layout-cell"
            :style="{
              left: (cell.x * 100) + '%',
              top: (cell.y * 100) + '%',
              width: (cell.width * 100) + '%',
              height: (cell.height * 100) + '%'
            }"
          >
            {{ index + 1 }}
          </div>
        </div>
        <div class="layout-name">{{ layout.name }}</div>
      </div>
    </div>
    
    <div v-if="images.length > 0" class="layout-tips">
      <p>💡 提示：</p>
      <ul>
        <li>拖拽图片可以交换位置</li>
        <li>按住 Alt 键拖拽可以平移图片</li>
        <li>使用方向键微调图片位置</li>
        <li>鼠标滚轮可以缩放图片</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useImageStore } from '@/stores/imageStore'
import { useLanguageStore } from '@/stores/languageStore'
import { getLayoutsByImageCount } from '@/utils/layouts'
import type { LayoutTemplate } from '@/stores/imageStore'

const imageStore = useImageStore()
const languageStore = useLanguageStore()

const { images, currentLayout } = storeToRefs(imageStore)
const { setLayout } = imageStore

const { texts } = storeToRefs(languageStore)

const selectedCount = ref(2)

const availableCounts = computed(() => {
  return Array.from({ length: 15 }, (_, i) => i + 2) // 2-16张图片
})

const availableLayouts = computed(() => {
  return getLayoutsByImageCount(selectedCount.value)
})

const onCountChange = () => {
  const layouts = getLayoutsByImageCount(selectedCount.value)
  if (layouts.length > 0) {
    selectLayout(layouts[0])
  }
}

const selectLayout = (layout: LayoutTemplate) => {
  setLayout(layout)
}

// 初始化选择第一个布局
if (availableLayouts.value.length > 0) {
  selectLayout(availableLayouts.value[0])
}
</script>

<style scoped>
.layout-selector {
  margin-bottom: 20px;
}

.layout-selector h3 {
  margin: 0 0 10px;
  color: #333;
}

.image-count-selector {
  margin-bottom: 15px;
}

.image-count-selector label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

.image-count-selector select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.layout-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.layout-item {
  cursor: pointer;
  border: 2px solid #eee;
  border-radius: 8px;
  padding: 8px;
  transition: all 0.2s;
}

.layout-item:hover {
  border-color: #007bff;
}

.layout-item.active {
  border-color: #007bff;
  background: #f8f9fa;
}

.layout-preview {
  position: relative;
  width: 100%;
  height: 60px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 8px;
}

.layout-cell {
  position: absolute;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 1px solid white;
  box-sizing: border-box;
}

.layout-name {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.layout-tips {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.layout-tips p {
  margin: 0 0 8px;
  font-size: 12px;
  color: #666;
  font-weight: bold;
}

.layout-tips ul {
  margin: 0;
  padding-left: 16px;
}

.layout-tips li {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}
</style>
