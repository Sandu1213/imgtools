<template>
  <div class="notification-container">
    <Transition name="notification" appear>
      <div 
        v-if="show" 
        class="notification"
        :class="[`notification-${type}`]"
      >
        <div class="notification-icon">
          <span v-if="type === 'success'">✓</span>
          <span v-else-if="type === 'error'">✗</span>
          <span v-else-if="type === 'warning'">⚠</span>
          <span v-else>ℹ</span>
        </div>
        <div class="notification-content">
          <div class="notification-title">{{ title }}</div>
          <div v-if="message" class="notification-message">{{ message }}</div>
        </div>
        <button class="notification-close" @click="hide">×</button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const show = ref(false)
const type = ref<'success' | 'error' | 'warning' | 'info'>('info')
const title = ref('')
const message = ref('')
const autoHideTimer = ref<number | null>(null)

const showNotification = (
  notificationType: 'success' | 'error' | 'warning' | 'info',
  notificationTitle: string,
  notificationMessage?: string,
  autoHide = true
) => {
  type.value = notificationType
  title.value = notificationTitle
  message.value = notificationMessage || ''
  show.value = true
  
  if (autoHideTimer.value) {
    clearTimeout(autoHideTimer.value)
  }
  
  if (autoHide) {
    autoHideTimer.value = setTimeout(() => {
      hide()
    }, 4000)
  }
}

const hide = () => {
  show.value = false
  if (autoHideTimer.value) {
    clearTimeout(autoHideTimer.value)
    autoHideTimer.value = null
  }
}

defineExpose({
  showNotification,
  hide
})
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  pointer-events: none;
}

.notification {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-left: 4px solid #4CAF50;
  max-width: 400px;
  pointer-events: auto;
}

.notification-success {
  border-left-color: #4CAF50;
}

.notification-error {
  border-left-color: #f44336;
}

.notification-warning {
  border-left-color: #ff9800;
}

.notification-info {
  border-left-color: #2196F3;
}

.notification-icon {
  font-size: 20px;
  line-height: 1;
  margin-top: 2px;
}

.notification-success .notification-icon {
  color: #4CAF50;
}

.notification-error .notification-icon {
  color: #f44336;
}

.notification-warning .notification-icon {
  color: #ff9800;
}

.notification-info .notification-icon {
  color: #2196F3;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.notification-message {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.notification-close:hover {
  background: #f0f0f0;
  color: #666;
}

/* 过渡动画 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 移动端优化 */
@media (max-width: 768px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .notification {
    max-width: none;
  }
}
</style>
