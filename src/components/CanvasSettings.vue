<template>
  <div class="canvas-settings">
    <h3>{{ currentMode === 'layout' ? texts.canvasTitle : texts.stitchTitle }}</h3>
    
    <div class="setting-group">
      <label>{{ texts.canvasSize }}：</label>
      <div class="size-controls">
        <div class="size-input">
          <input 
            v-model.number="canvasWidth" 
            type="number" 
            min="200" 
            max="4000"
            @change="updateCanvasSize"
          />
          <span>×</span>
          <input 
            v-model.number="canvasHeight" 
            type="number" 
            min="200" 
            max="4000"
            @change="updateCanvasSize"
          />
        </div>
        <div class="preset-sizes">
          <button 
            v-for="preset in presetSizes" 
            :key="preset.name"
            class="preset-btn"
            @click="applyPresetSize(preset)"
          >
            {{ preset.name }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="setting-group">
      <label>边框设置：</label>
      <div class="border-controls">
        <div class="border-input">
          <input 
            v-model.number="borderTop" 
            type="number" 
            min="0" 
            max="100"
            @change="updateBorder"
          />
          <input 
            v-model.number="borderRight" 
            type="number" 
            min="0" 
            max="100"
            @change="updateBorder"
          />
          <input 
            v-model.number="borderBottom" 
            type="number" 
            min="0" 
            max="100"
            @change="updateBorder"
          />
          <input 
            v-model.number="borderLeft" 
            type="number" 
            min="0" 
            max="100"
            @change="updateBorder"
          />
        </div>
        <div class="border-labels">
          <span>上</span>
          <span>右</span>
          <span>下</span>
          <span>左</span>
        </div>
      </div>
    </div>
    
    <div class="setting-group">
      <div class="slider-control">
        <div class="slider-label-value">
          <label>间距:</label>
          <span class="value-display">{{ spacing }}px</span>
        </div>
        <input 
          v-model.number="spacing" 
          type="range" 
          min="0" 
          max="50"
          class="thin-slider"
          @input="updateSpacing"
        />
      </div>
    </div>
    
    <div class="setting-group">
      <div class="slider-control">
        <div class="slider-label-value">
          <label>圆角:</label>
          <span class="value-display">{{ cornerRadius }}px</span>
        </div>
        <input 
          v-model.number="cornerRadius" 
          type="range" 
          min="0" 
          max="50"
          class="thin-slider"
          @input="updateCornerRadius"
        />
      </div>
    </div>
    
    <div class="setting-group">
      <div class="slider-control">
        <div class="slider-label-value">
          <label>显示比例:</label>
          <span class="value-display">{{ Math.round(displayScale * 100) }}%</span>
        </div>
        <input 
          v-model.number="displayScale" 
          type="range" 
          min="0.1" 
          max="2"
          step="0.1"
          class="thin-slider"
          @input="updateDisplayScale"
        />
      </div>
      <div class="preset-scales">
        <button 
          v-for="scale in presetScales" 
          :key="scale.value"
          class="preset-btn"
          @click="setDisplayScale(scale.value)"
          :class="{ active: Math.abs(displayScale - scale.value) < 0.05 }"
        >
          {{ scale.name }}
        </button>
      </div>
    </div>
    
    <div class="setting-group">
      <label>背景颜色：</label>
      <div class="color-controls">
        <input 
          v-model="backgroundColor" 
          type="color"
          @change="updateBackgroundColor"
        />
        <input 
          v-model="backgroundColor" 
          type="text" 
          placeholder="#ffffff"
          @change="updateBackgroundColor"
        />
      </div>
    </div>
    
    <div class="setting-group">
      <label>背景图片：</label>
      <div class="background-image-controls">
        <input 
          ref="backgroundInput"
          type="file" 
          accept="image/*"
          @change="handleBackgroundImage"
          style="display: none"
        />
        <button class="upload-bg-btn" @click="backgroundInput?.click()">
          上传背景图
        </button>
        <button 
          v-if="canvasSettings.backgroundImage"
          class="remove-bg-btn"
          @click="removeBackgroundImage"
        >
          移除背景
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useImageStore } from '@/stores/imageStore'
import { useLanguageStore } from '@/stores/languageStore'

const emit = defineEmits<{
  'scale-changed': [scale: number]
}>()

const imageStore = useImageStore()
const languageStore = useLanguageStore()

const { canvasSettings, currentMode } = storeToRefs(imageStore)
const { updateCanvasSettings } = imageStore

const { texts } = storeToRefs(languageStore)

const backgroundInput = ref<HTMLInputElement | null>(null)

const canvasWidth = ref(canvasSettings.value.width)
const canvasHeight = ref(canvasSettings.value.height)
const borderTop = ref(canvasSettings.value.border.top)
const borderRight = ref(canvasSettings.value.border.right)
const borderBottom = ref(canvasSettings.value.border.bottom)
const borderLeft = ref(canvasSettings.value.border.left)
const spacing = ref(canvasSettings.value.spacing)
const cornerRadius = ref(canvasSettings.value.cornerRadius)
const backgroundColor = ref(canvasSettings.value.backgroundColor)
const displayScale = ref(1)

const presetScales = [
  { name: '25%', value: 0.25 },
  { name: '50%', value: 0.5 },
  { name: '75%', value: 0.75 },
  { name: '100%', value: 1 },
  { name: '150%', value: 1.5 },
  { name: '200%', value: 2 }
]

const presetSizes = [
  { name: '1:1', width: 1000, height: 1000 },
  { name: '4:3', width: 1600, height: 1200 },
  { name: '16:9', width: 1600, height: 900 },
  { name: '3:4', width: 1200, height: 1600 },
  { name: '9:16', width: 900, height: 1600 }
]

const updateCanvasSize = () => {
  updateCanvasSettings({
    width: canvasWidth.value,
    height: canvasHeight.value
  })
}

const updateBorder = () => {
  updateCanvasSettings({
    border: {
      top: borderTop.value,
      right: borderRight.value,
      bottom: borderBottom.value,
      left: borderLeft.value
    }
  })
}

const updateSpacing = () => {
  updateCanvasSettings({
    spacing: spacing.value
  })
}

const updateCornerRadius = () => {
  updateCanvasSettings({
    cornerRadius: cornerRadius.value
  })
}

const updateDisplayScale = () => {
  emit('scale-changed', displayScale.value)
}

const setDisplayScale = (scale: number) => {
  displayScale.value = scale
  updateDisplayScale()
}

const updateBackgroundColor = () => {
  updateCanvasSettings({
    backgroundColor: backgroundColor.value
  })
}

const applyPresetSize = (preset: { name: string; width: number; height: number }) => {
  canvasWidth.value = preset.width
  canvasHeight.value = preset.height
  updateCanvasSize()
}

const handleBackgroundImage = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      updateCanvasSettings({
        backgroundImage: e.target?.result as string
      })
    }
    reader.readAsDataURL(file)
  }
}

const removeBackgroundImage = () => {
  updateCanvasSettings({
    backgroundImage: null
  })
}

// 监听 store 中的变化来更新本地状态
watch(canvasSettings, (newSettings) => {
  canvasWidth.value = newSettings.width
  canvasHeight.value = newSettings.height
  borderTop.value = newSettings.border.top
  borderRight.value = newSettings.border.right
  borderBottom.value = newSettings.border.bottom
  borderLeft.value = newSettings.border.left
  spacing.value = newSettings.spacing
  cornerRadius.value = newSettings.cornerRadius
  backgroundColor.value = newSettings.backgroundColor
}, { deep: true })
</script>

<style scoped>
.canvas-settings {
  margin-bottom: 20px;
}

.canvas-settings h3 {
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

.size-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.size-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.size-input input {
  width: 80px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.preset-sizes {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 4px 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: #f8f9fa;
  border-color: #007bff;
}

.border-controls {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.border-input {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}

.border-input input {
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}

.border-labels {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  text-align: center;
}

.border-labels span {
  font-size: 11px;
  color: #999;
}

.setting-group input[type="range"] {
  width: 100%;
  margin-right: 8px;
}

/* 新的滑块控件样式 */
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
  height: 2px;
  background: #e1e1e1;
  border-radius: 1px;
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
  height: 10px;
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

.color-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-controls input[type="color"] {
  width: 40px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.color-controls input[type="text"] {
  flex: 1;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.background-image-controls {
  display: flex;
  gap: 8px;
}

.upload-bg-btn,
.remove-bg-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-bg-btn {
  background: white;
}

.upload-bg-btn:hover {
  background: #f8f9fa;
  border-color: #007bff;
}

.remove-bg-btn {
  background: #ff4757;
  color: white;
  border-color: #ff4757;
}

.remove-bg-btn:hover {
  background: #ff3838;
}

.preset-scales {
  display: flex;
  gap: 4px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.preset-scales .preset-btn {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
  min-width: 45px;
  text-align: center;
}

.preset-scales .preset-btn:hover {
  border-color: #007bff;
  color: #007bff;
}

.preset-scales .preset-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .canvas-settings {
    padding: 0;
  }
  
  .setting-group {
    margin-bottom: 18px;
  }
  
  .setting-group label {
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .size-controls {
    gap: 10px;
  }
  
  .size-input {
    margin-bottom: 8px;
  }
  
  .size-input input {
    height: 36px;
    font-size: 16px;
    padding: 8px;
  }
  
  .preset-sizes {
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .preset-btn {
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 6px;
    min-width: 60px;
  }
  
  .border-controls {
    gap: 8px;
  }
  
  .border-input {
    gap: 6px;
  }
  
  .border-input input {
    height: 36px;
    font-size: 16px;
    padding: 8px;
  }
  
  .border-labels {
    gap: 6px;
  }
  
  .border-labels span {
    font-size: 12px;
  }
  
  .slider-control {
    margin: 8px 0;
  }
  
  .slider-label-value {
    margin-bottom: 8px;
  }
  
  .slider-label-value label {
    font-size: 14px;
  }
  
  .value-display {
    font-size: 14px;
  }
  
  .thin-slider {
    height: 6px;
  }
  
  .thin-slider::-webkit-slider-thumb {
    width: 22px;
    height: 22px;
  }
  
  .thin-slider::-moz-range-thumb {
    width: 22px;
    height: 22px;
  }
  
  .color-controls {
    gap: 10px;
  }
  
  .color-controls input[type="color"] {
    width: 45px;
    height: 36px;
  }
  
  .color-controls input[type="text"] {
    height: 36px;
    font-size: 16px;
    padding: 8px;
  }
  
  .background-image-controls {
    gap: 10px;
  }
  
  .upload-bg-btn,
  .remove-bg-btn {
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 6px;
  }
  
  .preset-scales {
    gap: 6px;
    margin-top: 8px;
  }
  
  .preset-scales .preset-btn {
    padding: 6px 10px;
    font-size: 12px;
    min-width: 50px;
  }
}

@media (max-width: 480px) {
  .setting-group {
    margin-bottom: 15px;
  }
  
  .size-input {
    flex-direction: column;
    gap: 8px;
  }
  
  .size-input input {
    width: 100%;
  }
  
  .size-input span {
    display: none;
  }
  
  .preset-sizes {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .preset-btn {
    padding: 10px 8px;
    font-size: 11px;
  }
  
  .border-input {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .border-labels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .color-controls {
    flex-direction: column;
    gap: 8px;
  }
  
  .color-controls input[type="color"] {
    width: 100%;
  }
  
  .background-image-controls {
    flex-direction: column;
    gap: 8px;
  }
  
  .upload-bg-btn,
  .remove-bg-btn {
    width: 100%;
  }
  
  .preset-scales .preset-btn {
    flex: 1;
    min-width: auto;
  }
}
</style>
