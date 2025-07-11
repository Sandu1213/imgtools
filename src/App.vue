<template>
  <div id="app">
    <div class="app-header">
      <div class="header-content">
        <div class="header-text">
          <div class="brand-logo">
            <SimpleLogo :size="isMobile ? 32 : 40" />
            <div class="brand-text">
              <h1 class="brand-title">{{ texts.title }}</h1>
              <p v-if="!isMobile" class="brand-subtitle">{{ texts.subtitle }}</p>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <div class="language-selector">
            <button 
              class="lang-btn" 
              @click="toggleLanguageDropdown"
              :class="{ active: showLanguageDropdown }"
            >
              {{ currentLanguageInfo?.flag }} 
              <span v-if="!isMobile">{{ currentLanguageInfo?.name }}</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            <div v-if="showLanguageDropdown" class="language-dropdown">
              <div 
                v-for="lang in availableLanguages" 
                :key="lang.code"
                class="language-option"
                :class="{ active: lang.code === currentLanguage }"
                @click="selectLanguage(lang.code)"
              >
                <span class="lang-flag">{{ lang.flag }}</span>
                <span class="lang-name">{{ lang.name }}</span>
              </div>
            </div>
          </div>
          <button class="help-btn" @click="showHelp" v-if="!isMobile">
            <span class="help-icon">?</span>
            <span class="help-text">{{ texts.shortcutHelp }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <div class="app-container">
      <!-- 移动端工具栏 -->
      <div class="mobile-toolbar" v-if="isMobile">
        <div class="mobile-tab-bar">
          <button 
            class="mobile-tab"
            :class="{ active: activeTab === 'upload' }"
            @click="activeTab = 'upload'"
          >
            📷 {{ texts.uploadTitle }}
          </button>
          <button 
            class="mobile-tab"
            :class="{ active: activeTab === 'layout' }"
            @click="activeTab = 'layout'"
          >
            🎯 {{ texts.layoutTitle }}
          </button>
          <button 
            class="mobile-tab"
            :class="{ active: activeTab === 'tools' }"
            @click="activeTab = 'tools'"
          >
            🎨 {{ texts.annotationTitle }}
          </button>
          <button 
            class="mobile-tab"
            :class="{ active: activeTab === 'export' }"
            @click="activeTab = 'export'"
          >
            💾 {{ texts.exportTitle }}
          </button>
        </div>
        
        <div class="mobile-panel" v-if="activeTab === 'upload'">
          <div class="mode-selector">
            <button 
              class="mode-btn"
              :class="{ active: currentMode === 'layout' }"
              @click="setMode('layout')"
            >
              {{ texts.layoutMode }}
            </button>
            <button 
              class="mode-btn"
              :class="{ active: currentMode === 'stitch' }"
              @click="setMode('stitch')"
            >
              {{ texts.stitchMode }}
            </button>
          </div>
          <ImageUploader />
        </div>
        
        <div class="mobile-panel" v-if="activeTab === 'layout'">
          <div v-if="currentMode === 'layout'">
            <LayoutSelector />
            <CanvasSettings @scale-changed="handleScaleChanged" />
          </div>
          <div v-if="currentMode === 'stitch'">
            <StitchSettings />
            <CanvasSettings @scale-changed="handleScaleChanged" />
          </div>
        </div>
        
        <div class="mobile-panel" v-if="activeTab === 'tools'">
          <AnnotationTools ref="annotationToolsRef" @tool-changed="handleToolChanged" />
        </div>
        
        <div class="mobile-panel" v-if="activeTab === 'export'">
          <ExportSettings />
        </div>
      </div>
      
      <!-- 桌面端布局 -->
      <div class="desktop-layout" v-if="!isMobile">
        <!-- 左侧：图片上传和模式选择 -->
        <div class="left-sidebar">
          <div class="mode-selector">
            <button 
              class="mode-btn"
              :class="{ active: currentMode === 'layout' }"
              @click="setMode('layout')"
            >
              {{ texts.layoutMode }}
            </button>
            <button 
              class="mode-btn"
              :class="{ active: currentMode === 'stitch' }"
              @click="setMode('stitch')"
            >
              {{ texts.stitchMode }}
            </button>
          </div>
          
          <ImageUploader />
          
          <div v-if="currentMode === 'layout'">
            <LayoutSelector />
          </div>
          
          <div v-if="currentMode === 'stitch'">
            <StitchSettings />
          </div>
        </div>
        
        <!-- 中间：主要工作区域 -->
        <div class="main-workspace">
          <!-- 工具栏 -->
          <div class="tools-bar">
            <AnnotationTools ref="annotationToolsRef" @tool-changed="handleToolChanged" />
          </div>
          
          <!-- 画布区域 -->
          <div class="canvas-area">
            <CanvasEditor ref="canvasEditorRef" />
          </div>
        </div>
        
        <!-- 右侧：设置面板 -->
        <div class="right-sidebar">
          <div v-if="currentMode === 'layout'">
            <CanvasSettings @scale-changed="handleScaleChanged" />
          </div>
          
          <div v-if="currentMode === 'stitch'">
            <CanvasSettings @scale-changed="handleScaleChanged" />
          </div>
          
          <ExportSettings />
        </div>
      </div>
      
      <!-- 移动端画布区域 -->
      <div class="mobile-canvas-area" v-if="isMobile">
        <CanvasEditor ref="canvasEditorRef" />
      </div>
    </div>
    
    <!-- 键盘快捷键帮助 -->
    <KeyboardShortcuts ref="keyboardShortcutsRef" />
    
    <!-- 状态栏 -->
    <StatusBar />
    
    <!-- 进度指示器 -->
    <ProgressIndicator ref="progressIndicatorRef" />
    
    <!-- 通知提示 -->
    <NotificationToast ref="notificationToastRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useImageStore } from '@/stores/imageStore'
import { useLanguageStore, type Language } from '@/stores/languageStore'
import ImageUploader from '@/components/ImageUploader.vue'
import LayoutSelector from '@/components/LayoutSelector.vue'
import CanvasSettings from '@/components/CanvasSettings.vue'
import StitchSettings from '@/components/StitchSettings.vue'
import AnnotationTools from '@/components/AnnotationTools.vue'
import ExportSettings from '@/components/ExportSettings.vue'
import CanvasEditor from '@/components/CanvasEditor.vue'
import KeyboardShortcuts from '@/components/KeyboardShortcuts.vue'
import StatusBar from '@/components/StatusBar.vue'
import ProgressIndicator from '@/components/ProgressIndicator.vue'
import NotificationToast from '@/components/NotificationToast.vue'
import SimpleLogo from '@/components/SimpleLogo.vue'

const imageStore = useImageStore()
const languageStore = useLanguageStore()

const { currentMode } = storeToRefs(imageStore)
const { setMode } = imageStore

const { texts, currentLanguageInfo, availableLanguages, currentLanguage } = storeToRefs(languageStore)
const { setLanguage, loadLanguageFromStorage } = languageStore

// 响应式状态
const windowWidth = ref(window.innerWidth)
const activeTab = ref('upload')

// 移动端检测
const isMobile = computed(() => windowWidth.value < 768)

// 语言选择器状态
const showLanguageDropdown = ref(false)

const annotationToolsRef = ref<InstanceType<typeof AnnotationTools> | null>(null)
const canvasEditorRef = ref<InstanceType<typeof CanvasEditor> | null>(null)
const keyboardShortcutsRef = ref<InstanceType<typeof KeyboardShortcuts> | null>(null)
const progressIndicatorRef = ref<InstanceType<typeof ProgressIndicator> | null>(null)
const notificationToastRef = ref<InstanceType<typeof NotificationToast> | null>(null)

// 语言选择器相关方法
const toggleLanguageDropdown = () => {
  showLanguageDropdown.value = !showLanguageDropdown.value
}

const selectLanguage = (language: Language) => {
  setLanguage(language)
  showLanguageDropdown.value = false
}

// 点击外部关闭语言选择器
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.language-selector')) {
    showLanguageDropdown.value = false
  }
}

const showHelp = () => {
  if (keyboardShortcutsRef.value) {
    keyboardShortcutsRef.value.open()
  }
}

const handleToolChanged = () => {
  if (annotationToolsRef.value && canvasEditorRef.value) {
    const activeTool = annotationToolsRef.value.getActiveTool()
    const settings = annotationToolsRef.value.getCurrentToolSettings()
    canvasEditorRef.value.setCurrentTool(activeTool, settings)
  }
}

const handleScaleChanged = (scale: number) => {
  if (canvasEditorRef.value) {
    canvasEditorRef.value.setDisplayScale(scale)
  }
}

// 监听显示帮助事件
const handleShowHelp = () => {
  showHelp()
}

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  // 加载语言设置
  loadLanguageFromStorage()
  
  // 添加事件监听
  document.addEventListener('show-help', handleShowHelp)
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('show-help', handleShowHelp)
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: white;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-text {
  text-align: left;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.brand-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.help-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #666;
}

.help-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.help-icon {
  font-size: 16px;
}

.help-text {
  font-weight: 500;
}

.app-header .subtitle {
  margin: 5px 0 0;
  color: #666;
  font-size: 14px;
}

.app-container {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* 左侧边栏 */
.left-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  overflow-y: auto;
  flex-shrink: 0;
}

/* 主工作区域 */
.main-workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* 工具栏 */
.tools-bar {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 15px 20px;
  flex-shrink: 0;
}

/* 画布区域 */
.canvas-area {
  flex: 1;
  padding: 20px;
  overflow: auto;
  background: #fafafa;
  min-height: 0;
}

/* 右侧边栏 */
.right-sidebar {
  width: 280px;
  background: white;
  border-left: 1px solid #e0e0e0;
  padding: 20px;
  overflow-y: auto;
  flex-shrink: 0;
}

.mode-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.mode-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 14px;
}

.mode-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.mode-btn:hover {
  border-color: #007bff;
}

/* 语言选择器样式 */
.language-selector {
  position: relative;
  display: inline-block;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #666;
  min-width: 120px;
}

.lang-btn:hover,
.lang-btn.active {
  background: #e0e0e0;
  color: #333;
}

.dropdown-arrow {
  transition: transform 0.3s;
  font-size: 12px;
}

.lang-btn.active .dropdown-arrow {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 160px;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 4px;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.language-option:last-child {
  border-bottom: none;
}

.language-option:hover {
  background: #f5f5f5;
}

.language-option.active {
  background: #e3f2fd;
  color: #1976d2;
}

.lang-flag {
  font-size: 16px;
}

.lang-name {
  font-size: 14px;
  font-weight: 500;
}

.lang-btn {
  margin-left: 12px;
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid #b0bec5;
  background: #f5f5f5;
  font-size: 15px;
  cursor: pointer;
}

.back-landing-btn {
  margin-left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid #b0bec5;
  background: #f5f5f5;
  font-size: 15px;
  color: #333;
  text-decoration: none;
  transition: background 0.2s;
}

.back-landing-btn:hover {
  background: #e0e0e0;
}

/* 移动端样式 */
@media (max-width: 768px) {
  .app-header {
    padding: 15px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .header-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .brand-logo {
    gap: 8px;
  }
  
  .brand-title {
    font-size: 18px;
  }
  
  .brand-subtitle {
    font-size: 12px;
  }
  
  .header-actions {
    gap: 8px;
  }
  
  .lang-btn {
    padding: 6px 8px;
    font-size: 12px;
    min-width: auto;
  }
  
  .app-container {
    flex: 1;
    min-height: 0;
    flex-direction: column;
    overflow: hidden;
  }
  
  .desktop-layout {
    display: none;
  }
  
  .mobile-toolbar {
    display: block;
    background: white;
    border-bottom: 1px solid #e0e0e0;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .mobile-tab-bar {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .mobile-tab {
    flex: 1;
    padding: 12px 8px;
    border: none;
    background: white;
    cursor: pointer;
    font-size: 11px;
    color: #666;
    transition: all 0.2s;
    border-bottom: 2px solid transparent;
  }
  
  .mobile-tab.active {
    color: #007bff;
    border-bottom-color: #007bff;
    background: #f8f9fa;
  }
  
  .mobile-tab:hover {
    background: #f5f5f5;
  }
  
  .mobile-panel {
    padding: 15px;
    max-height: 40vh;
    overflow-y: auto;
    background: white;
  }
  
  .mobile-canvas-area {
    flex: 1;
    padding: 10px;
    background: #f5f5f5;
    overflow: auto;
  }
  
  .mode-selector {
    margin-bottom: 15px;
  }
  
  .mode-btn {
    padding: 12px;
    font-size: 14px;
    border-radius: 6px;
  }
  
  .language-dropdown {
    right: 0;
    left: auto;
    min-width: 140px;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 16px;
  }
  
  .mobile-tab {
    padding: 10px 4px;
    font-size: 10px;
  }
  
  .mobile-panel {
    padding: 12px;
  }
  
  .mobile-canvas-area {
    padding: 8px;
  }
}

/* 桌面端样式 */
@media (min-width: 769px) {
  .mobile-toolbar {
    display: none;
  }
  
  .mobile-canvas-area {
    display: none;
  }
  
  .desktop-layout {
    display: flex !important;
    height: 100%;
    flex: 1;
    overflow: hidden;
  }
  
  .app-container {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
  
  .left-sidebar {
    display: flex;
    flex-direction: column;
    width: 280px;
    background: white;
    border-right: 1px solid #e0e0e0;
    padding: 20px;
    overflow-y: auto;
    flex-shrink: 0;
    height: 100%;
  }
  
  .main-workspace {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
    min-width: 0;
  }
  
  .right-sidebar {
    display: flex;
    flex-direction: column;
    width: 280px;
    background: white;
    border-left: 1px solid #e0e0e0;
    padding: 20px;
    overflow-y: auto;
    flex-shrink: 0;
    height: 100%;
  }
  
  .tools-bar {
    background: white;
    border-bottom: 1px solid #e0e0e0;
    padding: 15px 20px;
    flex-shrink: 0;
  }
  
  .canvas-area {
    flex: 1;
    padding: 20px;
    overflow: auto;
    background: #fafafa;
    min-height: 0;
  }
}
</style>
