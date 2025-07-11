<template>
  <div class="annotation-tools-horizontal">
    <div class="tools-section">
      <div class="section-title">创意工具</div>
      <div class="tool-buttons">
        <button 
          class="tool-btn"
          :class="{ active: activeTool === 'text' }"
          @click="setActiveTool('text')"
          title="文字工具"
        >
          <span class="tool-icon">📝</span>
          <span class="tool-label">文字</span>
        </button>
        <button 
          class="tool-btn"
          :class="{ active: activeTool === 'arrow' }"
          @click="setActiveTool('arrow')"
          title="箭头工具"
        >
          <span class="tool-icon">➡️</span>
          <span class="tool-label">箭头</span>
        </button>
        <button 
          class="tool-btn"
          :class="{ active: activeTool === 'rectangle' }"
          @click="setActiveTool('rectangle')"
          title="方框工具"
        >
          <span class="tool-icon">⬜</span>
          <span class="tool-label">方框</span>
        </button>
        <button 
          class="tool-btn"
          :class="{ active: activeTool === 'circle' }"
          @click="setActiveTool('circle')"
          title="圆圈工具"
        >
          <span class="tool-icon">⭕</span>
          <span class="tool-label">圆圈</span>
        </button>
      </div>
    </div>
    
    <div v-if="activeTool" class="settings-section">
      <div class="section-title">工具设置</div>
      <div class="tool-settings">
        <!-- 文字设置 -->
        <div v-if="activeTool === 'text'" class="setting-group">
          <div class="text-input-section">
            <input 
              v-model="textSettings.text"
              type="text" 
              placeholder="输入文字内容..."
              class="text-input"
              @keyup.enter="addTextAnnotation"
            />
            <button 
              class="add-text-btn" 
              @click="addTextAnnotation"
              :disabled="!textSettings.text.trim()"
              title="添加文字标注"
            >
              ✓
            </button>
          </div>
          <div class="setting-item">
            <label>大小：</label>
            <input 
              v-model.number="textSettings.fontSize" 
              type="number" 
              min="12" 
              max="72"
              class="number-input"
            />
            <input 
              v-model.number="textSettings.fontSize" 
              type="range" 
              min="12" 
              max="72"
              class="range-input"
            />
            <span class="value-display">{{ textSettings.fontSize }}px</span>
          </div>
          <div class="setting-item">
            <label>颜色：</label>
            <input v-model="textSettings.color" type="color" class="color-input" />
          </div>
          <div class="setting-item">
            <label>字体：</label>
            <select v-model="textSettings.fontFamily" class="select-input">
              <option value="Arial">Arial</option>
              <option value="微软雅黑">微软雅黑</option>
              <option value="宋体">宋体</option>
              <option value="黑体">黑体</option>
              <option value="楷体">楷体</option>
            </select>
          </div>
          <div class="setting-item">
            <label>
              <input v-model="textSettings.enableShadow" type="checkbox" class="checkbox-input" />
              文字阴影
            </label>
          </div>
          <div class="setting-item" v-if="textSettings.enableShadow">
            <label>阴影颜色：</label>
            <input v-model="textSettings.shadowColor" type="color" class="color-input" />
            <input 
              v-model.number="textSettings.shadowBlur" 
              type="range" 
              min="0" 
              max="10"
              class="range-input"
            />
            <span class="value-display">{{ textSettings.shadowBlur }}px</span>
          </div>
        </div>
        
        <!-- 箭头设置 -->
        <div v-if="activeTool === 'arrow'" class="setting-group">
          <div class="setting-item">
            <label>线条粗细：</label>
            <input 
              v-model.number="arrowSettings.strokeWidth" 
              type="range" 
              min="1" 
              max="20"
              class="range-input"
            />
            <span class="value-display">{{ arrowSettings.strokeWidth }}px</span>
          </div>
          <div class="setting-item">
            <label>线条颜色：</label>
            <input v-model="arrowSettings.stroke" type="color" class="color-input" />
          </div>
        </div>
        
        <!-- 方框设置 -->
        <div v-if="activeTool === 'rectangle'" class="setting-group">
          <div class="setting-item">
            <label>边框粗细：</label>
            <input 
              v-model.number="rectangleSettings.strokeWidth" 
              type="range" 
              min="1" 
              max="20"
              class="range-input"
            />
            <span class="value-display">{{ rectangleSettings.strokeWidth }}px</span>
          </div>
          <div class="setting-item">
            <label>边框颜色：</label>
            <input v-model="rectangleSettings.stroke" type="color" class="color-input" />
          </div>
          <div class="setting-item">
            <label>填充颜色：</label>
            <input v-model="rectangleSettings.fill" type="color" class="color-input" />
            <input 
              v-model.number="rectangleSettings.opacity" 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              class="range-input"
            />
            <span class="value-display">{{ Math.round(rectangleSettings.opacity * 100) }}%</span>
          </div>
        </div>
        
        <!-- 圆圈设置 -->
        <div v-if="activeTool === 'circle'" class="setting-group">
          <div class="setting-item">
            <label>边框粗细：</label>
            <input 
              v-model.number="circleSettings.strokeWidth" 
              type="range" 
              min="1" 
              max="20"
              class="range-input"
            />
            <span class="value-display">{{ circleSettings.strokeWidth }}px</span>
          </div>
          <div class="setting-item">
            <label>边框颜色：</label>
            <input v-model="circleSettings.stroke" type="color" class="color-input" />
          </div>
          <div class="setting-item">
            <label>填充颜色：</label>
            <input v-model="circleSettings.fill" type="color" class="color-input" />
            <input 
              v-model.number="circleSettings.opacity" 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              class="range-input"
            />
            <span class="value-display">{{ Math.round(circleSettings.opacity * 100) }}%</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="actions-section">
      <button class="action-btn undo-btn" @click="undoLastAnnotation" title="撤销上一步">
        ↶ 撤销
      </button>
      <button class="action-btn clear-btn" @click="clearAnnotations" title="清除所有标注">
        🗑️ 清除
      </button>
    </div>
    
    <div v-if="annotations.length > 0" class="annotations-section">
      <div class="section-title">标注 ({{ annotations.length }})</div>
      <div class="annotation-items">
        <div 
          v-for="annotation in annotations" 
          :key="annotation.id"
          class="annotation-item"
          @click="selectAnnotation(annotation.id)"
          :title="getAnnotationInfo(annotation)"
        >
          <span class="annotation-icon">
            {{ getAnnotationIcon(annotation.type) }}
          </span>
          <button 
            class="delete-annotation-btn"
            @click.stop="deleteAnnotation(annotation.id)"
            title="删除标注"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useImageStore } from '@/stores/imageStore'
import type { AnnotationItem } from '@/stores/imageStore'

const imageStore = useImageStore()
const { annotations } = storeToRefs(imageStore)
const { removeAnnotation, clearAnnotations } = imageStore

const emit = defineEmits<{
  'tool-changed': []
  'add-text': [text: string, settings: any]
}>()

const activeTool = ref<'text' | 'arrow' | 'rectangle' | 'circle' | null>(null)

const textSettings = ref({
  text: '',
  fontSize: 24,
  color: '#000000',
  fontFamily: '微软雅黑',
  enableShadow: false,
  shadowColor: '#000000',
  shadowBlur: 2
})

const arrowSettings = ref({
  strokeWidth: 4,
  stroke: '#ff0000'
})

const rectangleSettings = ref({
  strokeWidth: 2,
  stroke: '#0000ff',
  fill: '#0000ff',
  opacity: 0.3
})

const circleSettings = ref({
  strokeWidth: 2,
  stroke: '#00ff00',
  fill: '#00ff00',
  opacity: 0.3
})

const setActiveTool = (tool: typeof activeTool.value) => {
  activeTool.value = activeTool.value === tool ? null : tool
  emit('tool-changed')
}

const addTextAnnotation = () => {
  if (!textSettings.value.text.trim()) return
  emit('add-text', textSettings.value.text, textSettings.value)
  textSettings.value.text = '' // 清空输入框
}

const selectAnnotation = (id: string) => {
  // 这里可以添加选中标注的逻辑
  console.log('Selected annotation:', id)
}

const deleteAnnotation = (id: string) => {
  removeAnnotation(id)
}

const undoLastAnnotation = () => {
  if (annotations.value.length > 0) {
    const lastAnnotation = annotations.value[annotations.value.length - 1]
    removeAnnotation(lastAnnotation.id)
  }
}

const getAnnotationIcon = (type: string) => {
  const icons = {
    text: '📝',
    arrow: '➡️',
    rectangle: '⬜',
    circle: '⭕'
  }
  return icons[type as keyof typeof icons] || '❓'
}

const getAnnotationInfo = (annotation: AnnotationItem) => {
  switch (annotation.type) {
    case 'text':
      return annotation.text || '文字'
    case 'arrow':
      return '箭头'
    case 'rectangle':
      return '方框'
    case 'circle':
      return '圆圈'
    default:
      return '未知'
  }
}

// 导出设置供父组件使用
const getCurrentToolSettings = () => {
  switch (activeTool.value) {
    case 'text':
      return textSettings.value
    case 'arrow':
      return arrowSettings.value
    case 'rectangle':
      return rectangleSettings.value
    case 'circle':
      return circleSettings.value
    default:
      return null
  }
}

// 获取当前激活的工具
const getActiveTool = () => activeTool.value

defineExpose({
  activeTool,
  getCurrentToolSettings,
  getActiveTool
})
</script>

<style scoped>
.annotation-tools-horizontal {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding: 10px 0;
  flex-wrap: wrap;
}

.tools-section {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.tool-buttons {
  display: flex;
  gap: 6px;
}

.tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 70px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.tool-btn:hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,123,255,0.15);
}

.tool-btn.active {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0,123,255,0.3);
}

.tool-icon {
  font-size: 18px;
  line-height: 1;
}

.tool-label {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.settings-section {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.setting-group {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.setting-item label {
  font-size: 12px;
  color: #666;
  min-width: 60px;
}

.text-input-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 15px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.text-input {
  border: none;
  outline: none;
  padding: 6px 12px;
  font-size: 14px;
  min-width: 200px;
  background: transparent;
}

.text-input::placeholder {
  color: #999;
}

.add-text-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
}

.add-text-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: scale(1.05);
}

.add-text-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.number-input {
  width: 50px;
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
}

.checkbox-input {
  margin-right: 6px;
  transform: scale(1.2);
}

.range-input {
  width: 80px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

.range-input::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #007bff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.range-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #007bff;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.color-input {
  width: 32px;
  height: 32px;
  border: 2px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
  overflow: hidden;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.color-input:hover {
  border-color: #007bff;
}

.select-input {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  min-width: 100px;
  background: white;
  cursor: pointer;
}

.select-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.value-display {
  font-size: 12px;
  color: #666;
  min-width: 35px;
}

.actions-section {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.undo-btn {
  background: white;
  color: #666;
}

.undo-btn:hover {
  background: #f8f9fa;
  border-color: #007bff;
}

.clear-btn {
  background: #ff4757;
  color: white;
  border-color: #ff4757;
}

.clear-btn:hover {
  background: #ff3838;
}

.annotations-section {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.annotation-items {
  display: flex;
  gap: 4px;
  max-width: 200px;
  overflow-x: auto;
}

.annotation-item {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  border: 1px solid #eee;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.annotation-item:hover {
  background: #f8f9fa;
  border-color: #007bff;
}

.annotation-icon {
  font-size: 14px;
}

.delete-annotation-btn {
  width: 16px;
  height: 16px;
  border: none;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.delete-annotation-btn:hover {
  background: #ff3838;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .annotation-tools-horizontal {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .tools-section,
  .settings-section,
  .actions-section,
  .annotations-section {
    width: 100%;
  }
  
  .setting-group {
    flex-wrap: wrap;
  }
  
  .annotation-items {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .tool-buttons {
    flex-wrap: wrap;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .setting-item label {
    min-width: auto;
  }
  
  .range-input {
    width: 100px;
  }
}
</style>
