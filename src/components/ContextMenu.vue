<template>
  <div 
    v-if="visible" 
    class="context-menu"
    :style="{ left: x + 'px', top: y + 'px' }"
    @click.stop
  >
    <div class="menu-item" @click="handleEdit">
      <span class="menu-icon">✏️</span>
      <span>编辑</span>
    </div>
    
    <div class="menu-item" @click="handleDuplicate">
      <span class="menu-icon">📋</span>
      <span>复制</span>
    </div>
    
    <div class="menu-separator"></div>
    
    <div class="menu-item" @click="handleMoveToTop">
      <span class="menu-icon">⬆️</span>
      <span>置顶</span>
    </div>
    
    <div class="menu-item" @click="handleMoveToBottom">
      <span class="menu-icon">⬇️</span>
      <span>置底</span>
    </div>
    
    <div class="menu-separator"></div>
    
    <div class="menu-item danger" @click="handleDelete">
      <span class="menu-icon">🗑️</span>
      <span>删除</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watchEffect } from 'vue'
import { useImageStore } from '@/stores/imageStore'

const imageStore = useImageStore()

const visible = ref(false)
const x = ref(0)
const y = ref(0)
const targetId = ref<string | null>(null)

const show = (clientX: number, clientY: number, annotationId: string) => {
  x.value = clientX
  y.value = clientY
  targetId.value = annotationId
  visible.value = true
  
  // 确保菜单在视窗内
  nextTick(() => {
    const menu = document.querySelector('.context-menu') as HTMLElement
    if (menu) {
      const rect = menu.getBoundingClientRect()
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      
      if (rect.right > windowWidth) {
        x.value = windowWidth - rect.width - 5
      }
      if (rect.bottom > windowHeight) {
        y.value = windowHeight - rect.height - 5
      }
    }
  })
}

const hide = () => {
  visible.value = false
  targetId.value = null
}

const handleEdit = () => {
  if (targetId.value) {
    emit('edit', targetId.value)
  }
  hide()
}

const handleDuplicate = () => {
  if (targetId.value) {
    imageStore.duplicateAnnotation(targetId.value)
  }
  hide()
}

const handleMoveToTop = () => {
  if (targetId.value) {
    imageStore.moveAnnotationToTop(targetId.value)
  }
  hide()
}

const handleMoveToBottom = () => {
  if (targetId.value) {
    imageStore.moveAnnotationToBottom(targetId.value)
  }
  hide()
}

const handleDelete = () => {
  if (targetId.value) {
    imageStore.removeAnnotation(targetId.value)
  }
  hide()
}

// 点击其他地方时隐藏菜单
const handleDocumentClick = () => {
  hide()
}

// 监听文档点击事件
watchEffect(() => {
  if (visible.value) {
    document.addEventListener('click', handleDocumentClick)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }
})

const emit = defineEmits<{
  edit: [id: string]
}>()

defineExpose({
  show,
  hide
})
</script>

<style scoped>
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  z-index: 1001;
  min-width: 140px;
  font-size: 14px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item.danger {
  color: #f44336;
}

.menu-item.danger:hover {
  background: #ffebee;
}

.menu-icon {
  margin-right: 8px;
  font-size: 12px;
  width: 16px;
  display: inline-block;
}

.menu-separator {
  height: 1px;
  background: #e0e0e0;
  margin: 4px 0;
}

/* 动画效果 */
.context-menu {
  animation: contextMenuShow 0.2s ease-out;
}

@keyframes contextMenuShow {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
