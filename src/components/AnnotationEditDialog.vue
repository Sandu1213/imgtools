<template>
  <div v-if="visible" class="annotation-edit-dialog" @click="handleBackdropClick">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h3>{{ getDialogTitle() }}</h3>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="dialog-body">
        <!-- 文字标注编辑 -->
        <div v-if="annotation?.type === 'text'" class="form-group">
          <label>文字内容:</label>
          <textarea 
            v-model="editForm.text" 
            class="form-control"
            rows="3"
            placeholder="请输入文字内容"
          ></textarea>
        </div>
        
        <!-- 通用样式设置 -->
        <div class="form-row">
          <div class="form-group">
            <label>字体大小:</label>
            <input 
              type="number" 
              v-model.number="editForm.fontSize" 
              class="form-control"
              min="8"
              max="72"
            />
          </div>
          
          <div class="form-group" v-if="annotation?.type === 'text'">
            <label>字体:</label>
            <select v-model="editForm.fontFamily" class="form-control">
              <option value="Arial">Arial</option>
              <option value="微软雅黑">微软雅黑</option>
              <option value="宋体">宋体</option>
              <option value="黑体">黑体</option>
              <option value="楷体">楷体</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>填充颜色:</label>
            <div class="color-input-wrapper">
              <input 
                type="color" 
                v-model="editForm.fill" 
                class="color-input"
              />
              <input 
                type="text" 
                v-model="editForm.fill" 
                class="color-text"
                placeholder="#000000"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label>描边颜色:</label>
            <div class="color-input-wrapper">
              <input 
                type="color" 
                v-model="editForm.stroke" 
                class="color-input"
              />
              <input 
                type="text" 
                v-model="editForm.stroke" 
                class="color-text"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>描边宽度:</label>
            <input 
              type="number" 
              v-model.number="editForm.strokeWidth" 
              class="form-control"
              min="0"
              max="20"
            />
          </div>
          
          <div class="form-group" v-if="annotation?.type === 'text'">
            <label>阴影模糊:</label>
            <input 
              type="number" 
              v-model.number="editForm.shadowBlur" 
              class="form-control"
              min="0"
              max="20"
            />
          </div>
        </div>
        
        <div v-if="annotation?.type === 'text'" class="form-group">
          <label>阴影颜色:</label>
          <div class="color-input-wrapper">
            <input 
              type="color" 
              v-model="editForm.shadowColor" 
              class="color-input"
            />
            <input 
              type="text" 
              v-model="editForm.shadowColor" 
              class="color-text"
              placeholder="#000000"
            />
          </div>
        </div>
        
        <!-- 位置设置 -->
        <div class="form-row">
          <div class="form-group">
            <label>X 坐标:</label>
            <input 
              type="number" 
              v-model.number="editForm.x" 
              class="form-control"
            />
          </div>
          
          <div class="form-group">
            <label>Y 坐标:</label>
            <input 
              type="number" 
              v-model.number="editForm.y" 
              class="form-control"
            />
          </div>
        </div>
        
        <!-- 尺寸设置 -->
        <div v-if="annotation?.type !== 'arrow'" class="form-row">
          <div class="form-group">
            <label>宽度:</label>
            <input 
              type="number" 
              v-model.number="editForm.width" 
              class="form-control"
              min="10"
            />
          </div>
          
          <div class="form-group">
            <label>高度:</label>
            <input 
              type="number" 
              v-model.number="editForm.height" 
              class="form-control"
              min="10"
            />
          </div>
        </div>
      </div>
      
      <div class="dialog-footer">
        <button class="btn btn-cancel" @click="close">取消</button>
        <button class="btn btn-primary" @click="save">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useImageStore, type AnnotationItem } from '@/stores/imageStore'

const imageStore = useImageStore()

const visible = ref(false)
const editForm = ref<Partial<AnnotationItem>>({})

const annotation = computed(() => {
  if (!imageStore.selectedAnnotationId) return null
  return imageStore.annotations.find(a => a.id === imageStore.selectedAnnotationId)
})

const getDialogTitle = () => {
  if (!annotation.value) return '编辑标注'
  const typeMap = {
    text: '编辑文字',
    arrow: '编辑箭头',
    rectangle: '编辑方框',
    circle: '编辑圆形'
  }
  return typeMap[annotation.value.type] || '编辑标注'
}

const open = () => {
  if (annotation.value) {
    editForm.value = { ...annotation.value }
    visible.value = true
  }
}

const close = () => {
  visible.value = false
  editForm.value = {}
}

const handleBackdropClick = () => {
  close()
}

const save = () => {
  if (annotation.value && editForm.value) {
    imageStore.updateAnnotation(annotation.value.id, editForm.value)
    close()
  }
}

// 监听选中的标注变化
watch(
  () => imageStore.selectedAnnotationId,
  (newId) => {
    if (newId && annotation.value) {
      editForm.value = { ...annotation.value }
    }
  }
)

// 暴露方法给父组件
defineExpose({
  open,
  close
})
</script>

<style scoped>
.annotation-edit-dialog {
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
  max-width: 500px;
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

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  color: #555;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-input {
  width: 40px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
}

.color-text {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .dialog-content {
    width: 95%;
    margin: 10px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 8px;
  }
  
  .dialog-body {
    padding: 16px;
  }
}
</style>
