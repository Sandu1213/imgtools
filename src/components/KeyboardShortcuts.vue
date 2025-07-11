<template>
  <div v-if="visible" class="keyboard-shortcuts-dialog" @click="handleBackdropClick">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h3>键盘快捷键</h3>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="dialog-body">
        <div class="shortcuts-section">
          <h4>画布操作</h4>
          <div class="shortcut-item">
            <span class="shortcut-key">鼠标滚轮</span>
            <span class="shortcut-desc">缩放画布</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-key">拖拽</span>
            <span class="shortcut-desc">平移画布</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-key">双击</span>
            <span class="shortcut-desc">编辑标注</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-key">右键</span>
            <span class="shortcut-desc">显示上下文菜单</span>
          </div>
        </div>
        
        <div class="shortcuts-section">
          <h4>标注编辑</h4>
          <div class="shortcut-item">
            <span class="shortcut-key">Delete / Backspace</span>
            <span class="shortcut-desc">删除选中标注</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-key">Ctrl + C</span>
            <span class="shortcut-desc">复制选中标注</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-key">↑ ↓ ← →</span>
            <span class="shortcut-desc">微调标注位置</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-key">Shift + 方向键</span>
            <span class="shortcut-desc">快速调整位置</span>
          </div>
        </div>
        
        <div class="shortcuts-section">
          <h4>工具栏</h4>
          <div class="shortcut-item">
            <span class="shortcut-key">T</span>
            <span class="shortcut-desc">文字工具</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-key">A</span>
            <span class="shortcut-desc">箭头工具</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-key">R</span>
            <span class="shortcut-desc">矩形工具</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-key">C</span>
            <span class="shortcut-desc">圆形工具</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-key">Esc</span>
            <span class="shortcut-desc">取消当前工具</span>
          </div>
        </div>
        
        <div class="shortcuts-section">
          <h4>其他</h4>
          <div class="shortcut-item">
            <span class="shortcut-key">F1</span>
            <span class="shortcut-desc">显示/隐藏帮助</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-key">Ctrl + S</span>
            <span class="shortcut-desc">快速导出</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-key">Ctrl + Z</span>
            <span class="shortcut-desc">撤销操作</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-key">Ctrl + Y</span>
            <span class="shortcut-desc">重做操作</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)

const open = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
}

const handleBackdropClick = () => {
  close()
}

// 暴露方法给父组件
defineExpose({
  open,
  close
})
</script>

<style scoped>
.keyboard-shortcuts-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.dialog-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.dialog-body {
  padding: 20px;
}

.shortcuts-section {
  margin-bottom: 24px;
}

.shortcuts-section:last-child {
  margin-bottom: 0;
}

.shortcuts-section h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 4px;
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.shortcut-item:last-child {
  border-bottom: none;
}

.shortcut-key {
  font-family: 'Courier New', monospace;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  min-width: 120px;
  text-align: center;
}

.shortcut-desc {
  color: #333;
  font-size: 14px;
  flex: 1;
  margin-left: 16px;
}

/* 动画效果 */
.keyboard-shortcuts-dialog {
  animation: shortcutsShow 0.3s ease-out;
}

@keyframes shortcutsShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.dialog-content {
  animation: shortcutsContentShow 0.3s ease-out;
}

@keyframes shortcutsContentShow {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .dialog-content {
    width: 95%;
    margin: 10px;
  }
  
  .shortcut-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .shortcut-key {
    min-width: auto;
  }
  
  .shortcut-desc {
    margin-left: 0;
  }
}
</style>
