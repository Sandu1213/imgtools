<template>
  <div class="canvas-editor">
    <div class="canvas-toolbar">
      <div class="toolbar-left">
        <button 
          class="tool-btn"
          @click="resetCanvas"
          title="重置画布"
        >
          🔄 重置
        </button>
        <button 
          class="tool-btn"
          @click="fitToScreen"
          title="适应屏幕"
        >
          🖼️ 适应
        </button>
        <button 
          class="tool-btn"
          @click="zoomIn"
          title="放大"
        >
          🔍 放大
        </button>
        <button 
          class="tool-btn"
          @click="zoomOut"
          title="缩小"
        >
          🔎 缩小
        </button>
      </div>
      <div class="toolbar-right">
        <span class="zoom-info">{{ Math.round(zoom * 100) }}%</span>
      </div>
    </div>
    
    <div class="canvas-container" ref="canvasContainer">
      <canvas 
        ref="canvas"
        class="main-canvas"
        :width="actualCanvasWidth"
        :height="actualCanvasHeight"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @click="handleCanvasClick"
        @dblclick="handleCanvasDoubleClick"
        @contextmenu="handleCanvasContextMenu"
        @mouseleave="handleMouseLeave"
      />
      
      <!-- 图片控制按钮 -->
      <div 
        v-if="imageControlsVisible && currentMode === 'layout'" 
        class="image-controls" 
        :style="{ 
          left: (controlsPosition.x * zoom + panX) + 'px', 
          top: (controlsPosition.y * zoom + panY) + 'px' 
        }"
      >
        <button class="control-btn scale-btn" @click.stop="hoveredImageIndex !== null && scaleImage(hoveredImageIndex, 1.2)" title="放大图片">
          <span class="btn-icon">🔍</span>
          <span class="btn-text">+</span>
        </button>
        <button class="control-btn scale-btn" @click.stop="hoveredImageIndex !== null && scaleImage(hoveredImageIndex, 0.8)" title="缩小图片">
          <span class="btn-icon">🔍</span>
          <span class="btn-text">-</span>
        </button>
        <button class="control-btn" @click.stop="hoveredImageIndex !== null && selectImage(hoveredImageIndex)" title="选择图片">
          <span class="btn-icon">�</span>
        </button>
        <button class="control-btn" @click.stop="hoveredImageIndex !== null && resetImage(hoveredImageIndex)" title="还原大小">
          <span class="btn-icon">↩️</span>
        </button>
      </div>
    </div>
    
    <div class="canvas-info">
      <span>画布尺寸: {{ actualCanvasWidth }} × {{ actualCanvasHeight }}</span>
      <span>图片数量: {{ images.length }}</span>
      <span>标注数量: {{ annotations.length }}</span>
    </div>
    
    <!-- 标注编辑对话框 -->
    <AnnotationEditDialog ref="editDialog" />
    
    <!-- 右键菜单 -->
    <ContextMenu ref="contextMenu" @edit="handleAnnotationEdit" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useImageStore } from '@/stores/imageStore'
import type { AnnotationItem } from '@/stores/imageStore'
import AnnotationEditDialog from './AnnotationEditDialog.vue'
import ContextMenu from './ContextMenu.vue'

const imageStore = useImageStore()
const { images, currentMode, currentLayout, canvasSettings, annotations, stitchSettings, selectedAnnotationId } = storeToRefs(imageStore)
const { addAnnotation, selectAnnotation, updateAnnotation } = imageStore

const canvas = ref<HTMLCanvasElement | null>(null)
const canvasContainer = ref<HTMLDivElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

// 对话框和菜单引用
const editDialog = ref<InstanceType<typeof AnnotationEditDialog> | null>(null)
const contextMenu = ref<InstanceType<typeof ContextMenu> | null>(null)

const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const isHoveringImage = ref(false)
const draggedImageIndex = ref<number | null>(null)
const imagePositions = ref<Array<{ x: number, y: number, width: number, height: number, index: number }>>([])

// 新增：图片悬停控制相关状态
const hoveredImageIndex = ref<number | null>(null)
const imageControlsVisible = ref(false)
const controlsPosition = ref({ x: 0, y: 0 })

// 新增：标注编辑相关状态
const isDraggingAnnotation = ref(false)
const isResizingAnnotation = ref(false)
const draggedAnnotationId = ref<string | null>(null)
const resizeHandle = ref<string | null>(null) // 'nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'
const annotationDragStart = ref({ x: 0, y: 0, originalX: 0, originalY: 0 })

const loadedImages = ref<Map<string, HTMLImageElement>>(new Map())

// 用于存储当前激活的工具信息
const currentTool = ref<string | null>(null)
const currentToolSettings = ref<any>(null)

// 计算实际画布尺寸（用于长图拼接时的动态调整）
const actualCanvasWidth = computed(() => {
  if (currentMode.value === 'stitch' && images.value.length > 0) {
    return calculateStitchCanvasSize().width
  }
  return canvasSettings.value.width
})

const actualCanvasHeight = computed(() => {
  if (currentMode.value === 'stitch' && images.value.length > 0) {
    return calculateStitchCanvasSize().height
  }
  return canvasSettings.value.height
})

// 提供方法给父组件设置当前工具
const setCurrentTool = (tool: string | null, settings: any = null) => {
  currentTool.value = tool
  currentToolSettings.value = settings
}

// 在画布中心添加文字标注
const addTextAtCenter = (text: string, settings: any) => {
  if (!canvas.value) return
  
  const centerX = canvas.value.width / 2 / zoom.value
  const centerY = canvas.value.height / 2 / zoom.value
  
  const id = Date.now().toString()
  const annotation: any = {
    id,
    type: 'text',
    x: centerX,
    y: centerY,
    text,
    fontSize: settings?.fontSize || 24,
    fontFamily: settings?.fontFamily || '微软雅黑',
    fill: settings?.color || '#000000'
  }
  
  // 只有在启用阴影时才添加阴影属性
  if (settings?.enableShadow) {
    annotation.shadowColor = settings.shadowColor
    annotation.shadowBlur = settings.shadowBlur
  }
  
  addAnnotation(annotation)
  drawCanvas()
}

// 处理标注编辑
const handleAnnotationEdit = (annotationId: string) => {
  if (editDialog.value) {
    selectAnnotation(annotationId)
    editDialog.value.open()
  }
}

// 处理标注双击编辑
const handleAnnotationDoubleClick = (annotationId: string) => {
  handleAnnotationEdit(annotationId)
}

// 处理标注右键菜单
const handleAnnotationContextMenu = (event: MouseEvent, annotationId: string) => {
  event.preventDefault()
  if (contextMenu.value) {
    contextMenu.value.show(event.clientX, event.clientY, annotationId)
  }
}

// 键盘事件处理
const handleKeyDown = (event: KeyboardEvent) => {
  // F1 显示帮助
  if (event.key === 'F1') {
    event.preventDefault()
    // 通过事件通知父组件显示帮助
    document.dispatchEvent(new CustomEvent('show-help'))
    return
  }
  
  // ESC 取消当前工具
  if (event.key === 'Escape') {
    currentTool.value = null
    currentToolSettings.value = null
    selectAnnotation(null)
    return
  }
  
  // 工具快捷键
  if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
    switch (event.key.toLowerCase()) {
      case 't':
        currentTool.value = 'text'
        return
      case 'a':
        currentTool.value = 'arrow'
        return
      case 'r':
        currentTool.value = 'rectangle'
        return
      case 'c':
        currentTool.value = 'circle'
        return
    }
  }
  
  // 撤销/重做快捷键
  if (event.ctrlKey) {
    if (event.key === 'z' && !event.shiftKey) {
      event.preventDefault()
      imageStore.undo()
      drawCanvas()
      return
    }
    if (event.key === 'y' || (event.key === 'z' && event.shiftKey)) {
      event.preventDefault()
      imageStore.redo()
      drawCanvas()
      return
    }
  }
  
  // 如果没有选中标注，不处理其他快捷键
  if (!selectedAnnotationId.value) return
  
  // 删除选中的标注
  if (event.key === 'Delete' || event.key === 'Backspace') {
    imageStore.removeAnnotation(selectedAnnotationId.value)
    return
  }
  
  // 复制标注
  if (event.ctrlKey && event.key === 'c') {
    event.preventDefault()
    imageStore.duplicateAnnotation(selectedAnnotationId.value)
    return
  }
  
  // 微调位置
  const moveDistance = event.shiftKey ? 10 : 1
  const annotation = annotations.value.find(a => a.id === selectedAnnotationId.value)
  if (annotation) {
    let deltaX = 0
    let deltaY = 0
    
    switch (event.key) {
      case 'ArrowUp':
        deltaY = -moveDistance
        break
      case 'ArrowDown':
        deltaY = moveDistance
        break
      case 'ArrowLeft':
        deltaX = -moveDistance
        break
      case 'ArrowRight':
        deltaX = moveDistance
        break
      default:
        return
    }
    
    event.preventDefault()
    updateAnnotation(selectedAnnotationId.value, {
      x: annotation.x + deltaX,
      y: annotation.y + deltaY
    })
    drawCanvas()
  }
}

// 暴露给父组件
defineExpose({
  setCurrentTool,
  addTextAtCenter,
  setDisplayScale: (scale: number) => {
    zoom.value = scale
    updateCanvasTransform()
  }
})

onMounted(async () => {
  await nextTick()
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
    
    // 添加窗口大小变化监听器
    const handleResize = () => {
      setTimeout(() => {
        fitToScreen()
      }, 100)
    }
    
    window.addEventListener('resize', handleResize)
    
    // 初始化画布
    fitToScreen()
    drawCanvas()
    
    // 移动端优化：添加触摸事件支持
    if ('ontouchstart' in window) {
      setupTouchEvents()
    }
  }
  
  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeyDown)
})

// 设置移动端触摸事件
const setupTouchEvents = () => {
  if (!canvas.value) return
  
  let lastTouchDistance = 0
  let isPinching = false
  
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      // 双指缩放
      isPinching = true
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      lastTouchDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
    }
  }
  
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && isPinching) {
      e.preventDefault()
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      )
      
      if (lastTouchDistance > 0) {
        const scale = distance / lastTouchDistance
        zoom.value = Math.max(0.1, Math.min(5, zoom.value * scale))
        updateCanvasTransform()
      }
      
      lastTouchDistance = distance
    }
  }
  
  const handleTouchEnd = () => {
    isPinching = false
    lastTouchDistance = 0
  }
  
  canvas.value.addEventListener('touchstart', handleTouchStart, { passive: false })
  canvas.value.addEventListener('touchmove', handleTouchMove, { passive: false })
  canvas.value.addEventListener('touchend', handleTouchEnd)
}

// 清理事件监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// 监听图片变化
watch(images, async () => {
  await loadImages()
  await nextTick()
  drawCanvas()
}, { deep: true })

// 监听其他设置变化
watch([currentMode, currentLayout, canvasSettings, annotations, stitchSettings], async () => {
  await nextTick()
  drawCanvas()
}, { deep: true })

const calculateStitchCanvasSize = () => {
  if (!images.value.length) {
    return { width: canvasSettings.value.width, height: canvasSettings.value.height }
  }

  const direction = stitchSettings.value.direction
  const spacing = canvasSettings.value.spacing  // 使用统一的间距设置
  let totalWidth = 0
  let totalHeight = 0
  let maxWidth = 0
  let maxHeight = 0

  images.value.forEach((imageItem, index) => {
    const img = loadedImages.value.get(imageItem.id)
    if (!img) return

    const aspectRatio = img.width / img.height
    let drawWidth: number
    let drawHeight: number

    if (direction === 'horizontal') {
      // 横向拼接：固定高度，自适应宽度
      drawHeight = canvasSettings.value.height - canvasSettings.value.border.top - canvasSettings.value.border.bottom
      drawWidth = drawHeight * aspectRatio
      totalWidth += drawWidth + (index > 0 ? spacing : 0)
      maxHeight = Math.max(maxHeight, drawHeight)
    } else {
      // 纵向拼接：固定宽度，自适应高度
      drawWidth = canvasSettings.value.width - canvasSettings.value.border.left - canvasSettings.value.border.right
      drawHeight = drawWidth / aspectRatio
      totalHeight += drawHeight + (index > 0 ? spacing : 0)
      maxWidth = Math.max(maxWidth, drawWidth)
    }
  })

  if (direction === 'horizontal') {
    return {
      width: totalWidth + canvasSettings.value.border.left + canvasSettings.value.border.right,
      height: canvasSettings.value.height
    }
  } else {
    return {
      width: canvasSettings.value.width,
      height: totalHeight + canvasSettings.value.border.top + canvasSettings.value.border.bottom
    }
  }
}

const loadImages = async () => {
  const promises = images.value.map(imageItem => {
    return new Promise<void>((resolve) => {
      if (loadedImages.value.has(imageItem.id)) {
        resolve()
        return
      }
      
      const img = new Image()
      img.onload = () => {
        loadedImages.value.set(imageItem.id, img)
        resolve()
      }
      img.onerror = () => {
        console.error('Failed to load image:', imageItem.file.name)
        resolve()
      }
      img.src = imageItem.url
    })
  })
  
  await Promise.all(promises)
}

const drawCanvas = async () => {
  if (!canvas.value || !ctx.value) return
  
  // 等待所有图片加载完成
  await loadImages()
  
  const canvasWidth = actualCanvasWidth.value
  const canvasHeight = actualCanvasHeight.value
  
  // 更新 canvas 元素尺寸
  canvas.value.width = canvasWidth
  canvas.value.height = canvasHeight
  
  // 清空画布
  ctx.value.clearRect(0, 0, canvasWidth, canvasHeight)
  
  // 绘制背景
  ctx.value.fillStyle = canvasSettings.value.backgroundColor
  ctx.value.fillRect(0, 0, canvasWidth, canvasHeight)
  
  // 绘制背景图片
  if (canvasSettings.value.backgroundImage) {
    const bgImg = new Image()
    bgImg.onload = () => {
      ctx.value?.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight)
      drawContent()
    }
    bgImg.src = canvasSettings.value.backgroundImage
  } else {
    drawContent()
  }
}

const drawContent = () => {
  if (currentMode.value === 'layout') {
    drawLayoutMode()
  } else if (currentMode.value === 'stitch') {
    drawStitchMode()
  }
  
  drawAnnotations()
}

const drawLayoutMode = () => {
  if (!currentLayout.value || !ctx.value) return
  
  const layout = currentLayout.value
  const availableImages = images.value.slice(0, layout.imageCount)
  
  availableImages.forEach((imageItem, index) => {
    const cell = layout.cells[index]
    if (!cell) return
    
    const img = loadedImages.value.get(imageItem.id)
    if (!img) return
    
    // 计算可用区域（减去边框）
    const availableWidth = canvasSettings.value.width - canvasSettings.value.border.left - canvasSettings.value.border.right
    const availableHeight = canvasSettings.value.height - canvasSettings.value.border.top - canvasSettings.value.border.bottom
    
    const cellX = cell.x * availableWidth + canvasSettings.value.border.left
    const cellY = cell.y * availableHeight + canvasSettings.value.border.top
    const cellWidth = cell.width * availableWidth
    const cellHeight = cell.height * availableHeight
    
    // 应用间距
    const spacing = canvasSettings.value.spacing
    let adjustedX = cellX
    let adjustedY = cellY
    let adjustedWidth = cellWidth
    let adjustedHeight = cellHeight
    
    if (spacing > 0) {
      adjustedX = cellX + spacing / 2
      adjustedY = cellY + spacing / 2
      adjustedWidth = cellWidth - spacing
      adjustedHeight = cellHeight - spacing
    }
    
    // 绘制图片
    drawImageInCell(img, imageItem, adjustedX, adjustedY, adjustedWidth, adjustedHeight)
  })
}

const drawStitchMode = () => {
  if (!ctx.value || images.value.length === 0) return
  
  const direction = stitchSettings.value.direction
  const spacing = canvasSettings.value.spacing  // 使用统一的间距设置
  
  // 重置图片位置数组
  imagePositions.value = []
  
  // 绘制图片
  let currentX = canvasSettings.value.border.left
  let currentY = canvasSettings.value.border.top
  
  images.value.forEach((imageItem, index) => {
    const img = loadedImages.value.get(imageItem.id)
    if (!img) return
    
    const aspectRatio = img.width / img.height
    let drawWidth: number
    let drawHeight: number
    
    if (direction === 'horizontal') {
      drawHeight = actualCanvasHeight.value - canvasSettings.value.border.top - canvasSettings.value.border.bottom
      drawWidth = drawHeight * aspectRatio
    } else {
      drawWidth = actualCanvasWidth.value - canvasSettings.value.border.left - canvasSettings.value.border.right
      drawHeight = drawWidth / aspectRatio
    }
    
    // 应用图片的缩放设置
    const scaleX = imageItem.scaleX || 1
    const scaleY = imageItem.scaleY || 1
    const rotation = imageItem.rotation || 0
    drawWidth *= scaleX
    drawHeight *= scaleY
    
    // 存储图片位置信息
    imagePositions.value.push({
      x: currentX,
      y: currentY,
      width: drawWidth,
      height: drawHeight,
      index
    })
    
    // 绘制图片
    ctx.value!.save()
    
    // 如果有圆角，使用圆角剪切路径
    if (canvasSettings.value.cornerRadius > 0) {
      const radius = canvasSettings.value.cornerRadius
      ctx.value!.beginPath()
      ctx.value!.moveTo(currentX + radius, currentY)
      ctx.value!.lineTo(currentX + drawWidth - radius, currentY)
      ctx.value!.quadraticCurveTo(currentX + drawWidth, currentY, currentX + drawWidth, currentY + radius)
      ctx.value!.lineTo(currentX + drawWidth, currentY + drawHeight - radius)
      ctx.value!.quadraticCurveTo(currentX + drawWidth, currentY + drawHeight, currentX + drawWidth - radius, currentY + drawHeight)
      ctx.value!.lineTo(currentX + radius, currentY + drawHeight)
      ctx.value!.quadraticCurveTo(currentX, currentY + drawHeight, currentX, currentY + drawHeight - radius)
      ctx.value!.lineTo(currentX, currentY + radius)
      ctx.value!.quadraticCurveTo(currentX, currentY, currentX + radius, currentY)
      ctx.value!.closePath()
      ctx.value!.clip()
    }
    
    // 应用旋转
    if (rotation !== 0) {
      const centerX = currentX + drawWidth / 2
      const centerY = currentY + drawHeight / 2
      ctx.value!.translate(centerX, centerY)
      ctx.value!.rotate((rotation * Math.PI) / 180)
      ctx.value!.translate(-centerX, -centerY)
    }

    ctx.value!.drawImage(img, currentX, currentY, drawWidth, drawHeight)
    ctx.value!.restore()
    
    // 更新位置
    if (direction === 'horizontal') {
      currentX += drawWidth + spacing
    } else {
      currentY += drawHeight + spacing
    }
  })
}

const drawImageInCell = (img: HTMLImageElement, imageItem: any, x: number, y: number, width: number, height: number) => {
  if (!ctx.value) return
  
  // 计算图片的适应尺寸
  const imgAspectRatio = img.width / img.height
  const cellAspectRatio = width / height
  
  let drawWidth: number
  let drawHeight: number
  let drawX: number
  let drawY: number
  
  if (imgAspectRatio > cellAspectRatio) {
    // 图片更宽，以高度为准
    drawHeight = height
    drawWidth = height * imgAspectRatio
    drawX = x - (drawWidth - width) / 2
    drawY = y
  } else {
    // 图片更高，以宽度为准
    drawWidth = width
    drawHeight = width / imgAspectRatio
    drawX = x
    drawY = y - (drawHeight - height) / 2
  }
  
  // 应用图片的缩放设置
  const scaleX = imageItem.scaleX || 1
  const scaleY = imageItem.scaleY || 1
  const rotation = imageItem.rotation || 0
  
  // 计算缩放后的尺寸
  const scaledWidth = drawWidth * scaleX
  const scaledHeight = drawHeight * scaleY
  
  // 重新计算位置以保持居中
  const scaledX = drawX + (drawWidth - scaledWidth) / 2
  const scaledY = drawY + (drawHeight - scaledHeight) / 2
  
  // 剪切区域
  ctx.value.save()
  ctx.value.beginPath()
  
  // 如果有圆角，使用圆角剪切路径
  if (canvasSettings.value.cornerRadius > 0) {
    const radius = canvasSettings.value.cornerRadius
    ctx.value.moveTo(x + radius, y)
    ctx.value.lineTo(x + width - radius, y)
    ctx.value.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.value.lineTo(x + width, y + height - radius)
    ctx.value.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.value.lineTo(x + radius, y + height)
    ctx.value.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.value.lineTo(x, y + radius)
    ctx.value.quadraticCurveTo(x, y, x + radius, y)
    ctx.value.closePath()
  } else {
    ctx.value.rect(x, y, width, height)
  }
  
  ctx.value.clip()
  
  // 应用旋转
  if (rotation !== 0) {
    const centerX = scaledX + scaledWidth / 2
    const centerY = scaledY + scaledHeight / 2
    ctx.value.translate(centerX, centerY)
    ctx.value.rotate((rotation * Math.PI) / 180)
    ctx.value.translate(-centerX, -centerY)
  }
  
  ctx.value.drawImage(img, scaledX, scaledY, scaledWidth, scaledHeight)
  
  ctx.value.restore()
}

const drawAnnotations = () => {
  if (!ctx.value) return
  
  annotations.value.forEach(annotation => {
    ctx.value!.save()
    
    switch (annotation.type) {
      case 'text':
        drawTextAnnotation(annotation)
        break
      case 'arrow':
        drawArrowAnnotation(annotation)
        break
      case 'rectangle':
        drawRectangleAnnotation(annotation)
        break
      case 'circle':
        drawCircleAnnotation(annotation)
        break
    }
    
    // 如果这个标注被选中，绘制编辑句柄
    if (selectedAnnotationId.value === annotation.id) {
      drawAnnotationHandles(annotation)
    }
    
    ctx.value!.restore()
  })
}

const drawTextAnnotation = (annotation: AnnotationItem) => {
  if (!ctx.value || !annotation.text) return
  
  ctx.value.fillStyle = annotation.fill || '#000000'
  ctx.value.font = `${annotation.fontSize || 24}px ${annotation.fontFamily || 'Arial'}`
  
  // 添加阴影效果（只有在定义了阴影属性时）
  if (annotation.shadowColor && annotation.shadowBlur !== undefined) {
    ctx.value.shadowColor = annotation.shadowColor
    ctx.value.shadowBlur = annotation.shadowBlur
    ctx.value.shadowOffsetX = 2
    ctx.value.shadowOffsetY = 2
  }
  
  ctx.value.fillText(annotation.text, annotation.x, annotation.y)
  
  // 重置阴影
  if (annotation.shadowColor) {
    ctx.value.shadowColor = 'transparent'
    ctx.value.shadowBlur = 0
    ctx.value.shadowOffsetX = 0
    ctx.value.shadowOffsetY = 0
  }
}

const drawArrowAnnotation = (annotation: AnnotationItem) => {
  if (!ctx.value || !annotation.points || annotation.points.length < 4) return
  
  const [x1, y1, x2, y2] = annotation.points
  
  ctx.value.strokeStyle = annotation.stroke || '#ff0000'
  ctx.value.lineWidth = annotation.strokeWidth || 4
  
  // 绘制箭头线
  ctx.value.beginPath()
  ctx.value.moveTo(x1, y1)
  ctx.value.lineTo(x2, y2)
  ctx.value.stroke()
  
  // 绘制箭头头部
  const headSize = 15
  const angle = Math.atan2(y2 - y1, x2 - x1)
  
  ctx.value.beginPath()
  ctx.value.moveTo(x2, y2)
  ctx.value.lineTo(
    x2 - headSize * Math.cos(angle - Math.PI / 6),
    y2 - headSize * Math.sin(angle - Math.PI / 6)
  )
  ctx.value.moveTo(x2, y2)
  ctx.value.lineTo(
    x2 - headSize * Math.cos(angle + Math.PI / 6),
    y2 - headSize * Math.sin(angle + Math.PI / 6)
  )
  ctx.value.stroke()
}

const drawRectangleAnnotation = (annotation: AnnotationItem) => {
  if (!ctx.value || !annotation.width || !annotation.height) return
  
  ctx.value.strokeStyle = annotation.stroke || '#0000ff'
  ctx.value.lineWidth = annotation.strokeWidth || 2
  
  if (annotation.fill) {
    ctx.value.fillStyle = annotation.fill
    ctx.value.globalAlpha = 0.3
    ctx.value.fillRect(annotation.x, annotation.y, annotation.width, annotation.height)
    ctx.value.globalAlpha = 1
  }
  
  ctx.value.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height)
}

const drawCircleAnnotation = (annotation: AnnotationItem) => {
  if (!ctx.value || !annotation.width || !annotation.height) return
  
  const centerX = annotation.x + annotation.width / 2
  const centerY = annotation.y + annotation.height / 2
  const radiusX = annotation.width / 2
  const radiusY = annotation.height / 2
  
  ctx.value.strokeStyle = annotation.stroke || '#00ff00'
  ctx.value.lineWidth = annotation.strokeWidth || 2
  
  ctx.value.beginPath()
  ctx.value.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
  
  if (annotation.fill) {
    ctx.value.fillStyle = annotation.fill
    ctx.value.globalAlpha = 0.3
    ctx.value.fill()
    ctx.value.globalAlpha = 1
  }
  
  ctx.value.stroke()
}

// 绘制标注的编辑句柄
const drawAnnotationHandles = (annotation: AnnotationItem) => {
  if (!ctx.value) return
  
  const handleSize = 8
  const handleColor = '#007bff'
  const borderColor = '#ffffff'
  
  ctx.value.save()
  
  let bounds = getAnnotationBounds(annotation)
  if (!bounds) return
  
  const { x, y, width, height } = bounds
  
  // 绘制选中边框
  ctx.value.strokeStyle = handleColor
  ctx.value.lineWidth = 2
  ctx.value.setLineDash([5, 5])
  ctx.value.strokeRect(x, y, width, height)
  ctx.value.setLineDash([])
  
  // 绘制调整句柄
  const handles = [
    { x: x - handleSize/2, y: y - handleSize/2, type: 'nw' },
    { x: x + width/2 - handleSize/2, y: y - handleSize/2, type: 'n' },
    { x: x + width - handleSize/2, y: y - handleSize/2, type: 'ne' },
    { x: x + width - handleSize/2, y: y + height/2 - handleSize/2, type: 'e' },
    { x: x + width - handleSize/2, y: y + height - handleSize/2, type: 'se' },
    { x: x + width/2 - handleSize/2, y: y + height - handleSize/2, type: 's' },
    { x: x - handleSize/2, y: y + height - handleSize/2, type: 'sw' },
    { x: x - handleSize/2, y: y + height/2 - handleSize/2, type: 'w' }
  ]
  
  handles.forEach(handle => {
    // 绘制白色边框
    ctx.value!.fillStyle = borderColor
    ctx.value!.fillRect(handle.x - 1, handle.y - 1, handleSize + 2, handleSize + 2)
    
    // 绘制蓝色句柄
    ctx.value!.fillStyle = handleColor
    ctx.value!.fillRect(handle.x, handle.y, handleSize, handleSize)
  })
  
  ctx.value.restore()
}

// 获取标注的边界框
const getAnnotationBounds = (annotation: AnnotationItem) => {
  switch (annotation.type) {
    case 'text':
      if (!annotation.text) return null
      // 估算文字尺寸
      const fontSize = annotation.fontSize || 24
      const textWidth = annotation.text.length * fontSize * 0.6
      const textHeight = fontSize
      return {
        x: annotation.x,
        y: annotation.y - textHeight,
        width: textWidth,
        height: textHeight
      }
    case 'rectangle':
    case 'circle':
      return {
        x: annotation.x,
        y: annotation.y,
        width: annotation.width || 100,
        height: annotation.height || 100
      }
    case 'arrow':
      if (!annotation.points || annotation.points.length < 4) return null
      const [x1, y1, x2, y2] = annotation.points
      return {
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1)
      }
    default:
      return null
  }
}

// 获取鼠标位置下的图片索引
const getImageIndexAtPosition = (x: number, y: number): number | null => {
  for (let i = imagePositions.value.length - 1; i >= 0; i--) {
    const pos = imagePositions.value[i]
    if (x >= pos.x && x <= pos.x + pos.width && y >= pos.y && y <= pos.y + pos.height) {
      return pos.index
    }
  }
  return null
}

// 检测鼠标是否在标注上
const getAnnotationAtPosition = (x: number, y: number): AnnotationItem | null => {
  // 从后往前检查（后绘制的在上层）
  for (let i = annotations.value.length - 1; i >= 0; i--) {
    const annotation = annotations.value[i]
    const bounds = getAnnotationBounds(annotation)
    if (!bounds) continue
    
    if (x >= bounds.x && x <= bounds.x + bounds.width &&
        y >= bounds.y && y <= bounds.y + bounds.height) {
      return annotation
    }
  }
  return null
}

// 检测鼠标是否在调整句柄上
const getResizeHandleAtPosition = (x: number, y: number, annotation: AnnotationItem): string | null => {
  const bounds = getAnnotationBounds(annotation)
  if (!bounds) return null
  
  const handleSize = 8
  const { x: ax, y: ay, width, height } = bounds
  
  const handles = [
    { x: ax - handleSize/2, y: ay - handleSize/2, type: 'nw' },
    { x: ax + width/2 - handleSize/2, y: ay - handleSize/2, type: 'n' },
    { x: ax + width - handleSize/2, y: ay - handleSize/2, type: 'ne' },
    { x: ax + width - handleSize/2, y: ay + height/2 - handleSize/2, type: 'e' },
    { x: ax + width - handleSize/2, y: ay + height - handleSize/2, type: 'se' },
    { x: ax + width/2 - handleSize/2, y: ay + height - handleSize/2, type: 's' },
    { x: ax - handleSize/2, y: ay + height - handleSize/2, type: 'sw' },
    { x: ax - handleSize/2, y: ay + height/2 - handleSize/2, type: 'w' }
  ]
  
  for (const handle of handles) {
    if (x >= handle.x && x <= handle.x + handleSize &&
        y >= handle.y && y <= handle.y + handleSize) {
      return handle.type
    }
  }
  
  return null
}

// 移动标注
const moveAnnotation = (annotation: AnnotationItem, deltaX: number, deltaY: number) => {
  const newX = annotationDragStart.value.originalX + deltaX
  const newY = annotationDragStart.value.originalY + deltaY
  
  if (annotation.type === 'arrow' && annotation.points) {
    // 箭头需要移动所有点
    const [x1, y1, x2, y2] = annotation.points
    const originalStartX = x1
    const originalStartY = y1
    const arrowDeltaX = newX - originalStartX
    const arrowDeltaY = newY - originalStartY
    
    updateAnnotation(annotation.id, {
      x: newX,
      y: newY,
      points: [
        x1 + arrowDeltaX,
        y1 + arrowDeltaY,
        x2 + arrowDeltaX,
        y2 + arrowDeltaY
      ]
    })
  } else {
    updateAnnotation(annotation.id, {
      x: newX,
      y: newY
    })
  }
}

// 调整标注大小
const resizeAnnotation = (annotation: AnnotationItem, handleType: string, deltaX: number, deltaY: number) => {
  const bounds = getAnnotationBounds(annotation)
  if (!bounds) return
  
  let newX = annotation.x
  let newY = annotation.y
  let newWidth = annotation.width || bounds.width
  let newHeight = annotation.height || bounds.height
  
  switch (handleType) {
    case 'nw':
      newX = annotation.x + deltaX
      newY = annotation.y + deltaY
      newWidth = (annotation.width || bounds.width) - deltaX
      newHeight = (annotation.height || bounds.height) - deltaY
      break
    case 'ne':
      newY = annotation.y + deltaY
      newWidth = (annotation.width || bounds.width) + deltaX
      newHeight = (annotation.height || bounds.height) - deltaY
      break
    case 'sw':
      newX = annotation.x + deltaX
      newWidth = (annotation.width || bounds.width) - deltaX
      newHeight = (annotation.height || bounds.height) + deltaY
      break
    case 'se':
      newWidth = (annotation.width || bounds.width) + deltaX
      newHeight = (annotation.height || bounds.height) + deltaY
      break
    case 'n':
      newY = annotation.y + deltaY
      newHeight = (annotation.height || bounds.height) - deltaY
      break
    case 's':
      newHeight = (annotation.height || bounds.height) + deltaY
      break
    case 'w':
      newX = annotation.x + deltaX
      newWidth = (annotation.width || bounds.width) - deltaX
      break
    case 'e':
      newWidth = (annotation.width || bounds.width) + deltaX
      break
  }
  
  // 限制最小尺寸
  newWidth = Math.max(20, newWidth)
  newHeight = Math.max(20, newHeight)
  
  const updates: Partial<AnnotationItem> = { x: newX, y: newY }
  
  if (annotation.type !== 'text') {
    updates.width = newWidth
    updates.height = newHeight
  }
  
  // 特殊处理箭头
  if (annotation.type === 'arrow' && annotation.points) {
    // 计算箭头的新坐标点
    updates.points = [newX, newY, newX + newWidth, newY + newHeight]
  }
  
  updateAnnotation(annotation.id, updates)
}

// 新增：检查鼠标是否在图片区域内
const checkImageHover = (mouseX: number, mouseY: number) => {
  const canvasRect = canvas.value?.getBoundingClientRect()
  if (!canvasRect) return

  // 转换为画布坐标
  const canvasX = (mouseX - canvasRect.left) / zoom.value - panX.value
  const canvasY = (mouseY - canvasRect.top) / zoom.value - panY.value

  // 检查是否在任何图片区域内
  for (let i = 0; i < imagePositions.value.length; i++) {
    const pos = imagePositions.value[i]
    if (canvasX >= pos.x && canvasX <= pos.x + pos.width &&
        canvasY >= pos.y && canvasY <= pos.y + pos.height) {
      if (hoveredImageIndex.value !== i) {
        hoveredImageIndex.value = i
        imageControlsVisible.value = true
        // 计算控制按钮的位置（图片右上角，但要确保不超出画布边界）
        const controlsWidth = 200 // 工具栏预估宽度
        const controlsHeight = 40 // 工具栏预估高度
        
        controlsPosition.value = {
          x: Math.min(pos.x + pos.width - 20, actualCanvasWidth.value / zoom.value - controlsWidth / zoom.value),
          y: Math.max(pos.y - 10, controlsHeight / zoom.value)
        }
      }
      return
    }
  }
  
  // 如果没有悬停在任何图片上
  if (hoveredImageIndex.value !== null) {
    hoveredImageIndex.value = null
    imageControlsVisible.value = false
  }
}

const updateCursor = (x: number, y: number) => {
  if (!canvas.value) return
  
  // 检查是否在选中标注的调整句柄上
  if (selectedAnnotationId.value) {
    const selectedAnnotation = annotations.value.find(a => a.id === selectedAnnotationId.value)
    if (selectedAnnotation) {
      const handleType = getResizeHandleAtPosition(x, y, selectedAnnotation)
      if (handleType) {
        const cursors: Record<string, string> = {
          'nw': 'nw-resize',
          'ne': 'ne-resize',
          'sw': 'sw-resize',
          'se': 'se-resize',
          'n': 'n-resize',
          's': 's-resize',
          'e': 'e-resize',
          'w': 'w-resize'
        }
        canvas.value.style.cursor = cursors[handleType] || 'default'
        return
      }
    }
  }
  
  // 检查是否在标注上
  const annotation = getAnnotationAtPosition(x, y)
  if (annotation) {
    canvas.value.style.cursor = 'move'
    return
  }
  
  const imageIndex = getImageIndexAtPosition(x, y)
  if (imageIndex !== null && currentMode.value === 'stitch') {
    canvas.value.style.cursor = 'grab'
    isHoveringImage.value = true
  } else if (currentTool.value) {
    canvas.value.style.cursor = 'crosshair'
    isHoveringImage.value = false
  } else {
    canvas.value.style.cursor = 'default'
    isHoveringImage.value = false
  }
}

// 事件处理
const handleMouseDown = (event: MouseEvent) => {
  event.preventDefault()
  
  const rect = canvas.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = (event.clientX - rect.left - panX.value) / zoom.value
  const y = (event.clientY - rect.top - panY.value) / zoom.value
  
  // 优先检查是否点击了标注的调整句柄
  if (selectedAnnotationId.value) {
    const selectedAnnotation = annotations.value.find(a => a.id === selectedAnnotationId.value)
    if (selectedAnnotation) {
      const handleType = getResizeHandleAtPosition(x, y, selectedAnnotation)
      if (handleType) {
        isResizingAnnotation.value = true
        resizeHandle.value = handleType
        annotationDragStart.value = { x, y, originalX: x, originalY: y }
        return
      }
    }
  }
  
  // 检查是否点击了标注
  const clickedAnnotation = getAnnotationAtPosition(x, y)
  if (clickedAnnotation) {
    selectAnnotation(clickedAnnotation.id)
    isDraggingAnnotation.value = true
    draggedAnnotationId.value = clickedAnnotation.id
    annotationDragStart.value = { 
      x, y, 
      originalX: clickedAnnotation.x, 
      originalY: clickedAnnotation.y 
    }
    drawCanvas() // 重绘以显示选中状态
    return
  }
  
  // 如果没有点击标注，取消选择
  if (selectedAnnotationId.value) {
    selectAnnotation(null)
    drawCanvas()
  }
  
  // 检查是否点击在图片上
  const imageIndex = getImageIndexAtPosition(x, y)
  if (imageIndex !== null && currentMode.value === 'stitch') {
    draggedImageIndex.value = imageIndex
    canvas.value!.style.cursor = 'grabbing'
    isDragging.value = true
    dragStart.value = { x: event.clientX, y: event.clientY }
    return
  }
  
  // 普通拖拽
  isDragging.value = true
  dragStart.value = { x: event.clientX, y: event.clientY }
}

const handleMouseMove = (event: MouseEvent) => {
  const rect = canvas.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = (event.clientX - rect.left - panX.value) / zoom.value
  const y = (event.clientY - rect.top - panY.value) / zoom.value
  
  // 处理标注调整大小
  if (isResizingAnnotation.value && draggedAnnotationId.value && resizeHandle.value) {
    const annotation = annotations.value.find(a => a.id === draggedAnnotationId.value)
    if (annotation) {
      const deltaX = x - annotationDragStart.value.x
      const deltaY = y - annotationDragStart.value.y
      
      resizeAnnotation(annotation, resizeHandle.value, deltaX, deltaY)
      drawCanvas()
    }
    return
  }
  
  // 处理标注拖拽
  if (isDraggingAnnotation.value && draggedAnnotationId.value) {
    const annotation = annotations.value.find(a => a.id === draggedAnnotationId.value)
    if (annotation) {
      const deltaX = x - annotationDragStart.value.x
      const deltaY = y - annotationDragStart.value.y
      
      moveAnnotation(annotation, deltaX, deltaY)
      drawCanvas()
    }
    return
  }
  
  // 更新鼠标样式
  if (!isDragging.value && !isDraggingAnnotation.value && !isResizingAnnotation.value) {
    updateCursor(x, y)
    checkImageHover(event.clientX, event.clientY)
  }
  
  if (!isDragging.value) return
  
  // 如果正在拖拽图片
  if (draggedImageIndex.value !== null) {
    // 这里可以添加图片拖拽重排序逻辑
    // 暂时只更新拖拽起始点
    dragStart.value = { x: event.clientX, y: event.clientY }
    return
  }
  
  // 普通画布拖拽
  const deltaX = event.clientX - dragStart.value.x
  const deltaY = event.clientY - dragStart.value.y
  
  panX.value += deltaX
  panY.value += deltaY
  
  dragStart.value = { x: event.clientX, y: event.clientY }
  
  updateCanvasTransform()
}

const handleMouseUp = (event: MouseEvent) => {
  // 结束标注编辑
  if (isDraggingAnnotation.value || isResizingAnnotation.value) {
    isDraggingAnnotation.value = false
    isResizingAnnotation.value = false
    draggedAnnotationId.value = null
    resizeHandle.value = null
    return
  }
  
  if (draggedImageIndex.value !== null) {
    // 处理图片拖拽重排序
    const rect = canvas.value?.getBoundingClientRect()
    if (rect) {
      const x = (event.clientX - rect.left - panX.value) / zoom.value
      const y = (event.clientY - rect.top - panY.value) / zoom.value
      
      const targetIndex = getImageIndexAtPosition(x, y)
      if (targetIndex !== null && targetIndex !== draggedImageIndex.value) {
        // 交换图片位置
        const draggedImage = images.value[draggedImageIndex.value]
        const targetImage = images.value[targetIndex]
        
        // 交换数组中的位置
        images.value[draggedImageIndex.value] = targetImage
        images.value[targetIndex] = draggedImage
        
        // 重新绘制
        drawCanvas()
      }
    }
    
    draggedImageIndex.value = null
  }
  
  isDragging.value = false
  
  // 恢复鼠标样式
  if (canvas.value) {
    const rect = canvas.value.getBoundingClientRect()
    const x = (event.clientX - rect.left - panX.value) / zoom.value
    const y = (event.clientY - rect.top - panY.value) / zoom.value
    updateCursor(x, y)
  }
}

const handleMouseLeave = () => {
  isDragging.value = false
  draggedImageIndex.value = null
  isHoveringImage.value = false
  
  // 重置标注编辑状态
  isDraggingAnnotation.value = false
  isResizingAnnotation.value = false
  draggedAnnotationId.value = null
  resizeHandle.value = null
  
  // 隐藏图片控制按钮
  hoveredImageIndex.value = null
  imageControlsVisible.value = false
  
  if (canvas.value) {
    canvas.value.style.cursor = 'default'
  }
}

const handleCanvasClick = (event: MouseEvent) => {
  // 如果正在拖拽图片，不处理点击事件
  if (draggedImageIndex.value !== null) return
  
  const rect = canvas.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = (event.clientX - rect.left - panX.value) / zoom.value
  const y = (event.clientY - rect.top - panY.value) / zoom.value
  
  // 如果有激活的工具，创建标注
  if (currentTool.value) {
    createAnnotation(currentTool.value, x, y, currentToolSettings.value)
  }
}

const createAnnotation = (type: string, x: number, y: number, settings: any) => {
  const id = Date.now().toString()
  
  switch (type) {
    case 'text':
      const text = prompt('请输入文字内容：') || '文字'
      addAnnotation({
        id,
        type: 'text',
        x,
        y,
        text,
        fontSize: settings?.fontSize || 24,
        fontFamily: settings?.fontFamily || '微软雅黑',
        fill: settings?.color || '#000000'
      })
      break
      
    case 'arrow':
      // 箭头需要两个点，这里创建一个默认箭头
      addAnnotation({
        id,
        type: 'arrow',
        x,
        y,
        points: [x, y, x + 100, y + 50],
        stroke: settings?.stroke || '#ff0000',
        strokeWidth: settings?.strokeWidth || 4
      })
      break
      
    case 'rectangle':
      addAnnotation({
        id,
        type: 'rectangle',
        x,
        y,
        width: 100,
        height: 60,
        stroke: settings?.stroke || '#0000ff',
        fill: settings?.fill || '#0000ff',
        strokeWidth: settings?.strokeWidth || 2
      })
      break
      
    case 'circle':
      addAnnotation({
        id,
        type: 'circle',
        x,
        y,
        width: 100,
        height: 100,
        stroke: settings?.stroke || '#00ff00',
        fill: settings?.fill || '#00ff00',
        strokeWidth: settings?.strokeWidth || 2
      })
      break
  }
  
  // 重新绘制画布
  drawCanvas()
}

// 处理画布双击事件
const handleCanvasDoubleClick = (event: MouseEvent) => {
  const rect = canvas.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = (event.clientX - rect.left - panX.value) / zoom.value
  const y = (event.clientY - rect.top - panY.value) / zoom.value
  
  // 检查是否双击了某个标注
  const clickedAnnotation = getAnnotationAtPosition(x, y)
  if (clickedAnnotation) {
    handleAnnotationDoubleClick(clickedAnnotation.id)
  }
}

// 处理画布右键事件
const handleCanvasContextMenu = (event: MouseEvent) => {
  const rect = canvas.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = (event.clientX - rect.left - panX.value) / zoom.value
  const y = (event.clientY - rect.top - panY.value) / zoom.value
  
  // 检查是否右键点击了某个标注
  const clickedAnnotation = getAnnotationAtPosition(x, y)
  if (clickedAnnotation) {
    handleAnnotationContextMenu(event, clickedAnnotation.id)
  }
}

const updateCanvasTransform = () => {
  if (!canvas.value) return
  
  canvas.value.style.transform = `translate(${panX.value}px, ${panY.value}px) scale(${zoom.value})`
}

// 工具栏方法
const resetCanvas = () => {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
  updateCanvasTransform()
}

const fitToScreen = () => {
  if (!canvas.value || !canvasContainer.value) return
  
  const containerWidth = canvasContainer.value.clientWidth
  const containerHeight = canvasContainer.value.clientHeight
  const canvasWidth = actualCanvasWidth.value
  const canvasHeight = actualCanvasHeight.value
  
  const scaleX = containerWidth / canvasWidth
  const scaleY = containerHeight / canvasHeight
  
  zoom.value = Math.min(scaleX, scaleY) * 0.9
  panX.value = (containerWidth - canvasWidth * zoom.value) / 2
  panY.value = (containerHeight - canvasHeight * zoom.value) / 2
  
  updateCanvasTransform()
}

const zoomIn = () => {
  zoom.value = Math.min(5, zoom.value * 1.2)
  updateCanvasTransform()
}

const zoomOut = () => {
  zoom.value = Math.max(0.1, zoom.value / 1.2)
  updateCanvasTransform()
}

// 新增：图片操作方法
const scaleImage = (index: number, factor: number) => {
  if (index >= 0 && index < images.value.length) {
    const image = images.value[index]
    const currentScale = image.scaleX || 1
    const newScale = Math.max(0.1, Math.min(3, currentScale * factor))
    
    imageStore.updateImageProperties(image.id, {
      scaleX: newScale,
      scaleY: newScale
    })
  }
}

// const rotateImage = (index: number) => {
//   if (index >= 0 && index < images.value.length) {
//     const image = images.value[index]
//     const currentRotation = image.rotation || 0
//     const newRotation = (currentRotation + 90) % 360
    
//     imageStore.updateImageProperties(image.id, {
//       rotation: newRotation
//     })
//   }
// }

const resetImage = (index: number) => {
  if (index >= 0 && index < images.value.length) {
    const image = images.value[index]
    
    imageStore.updateImageProperties(image.id, {
      scaleX: 1,
      scaleY: 1,
      rotation: 0
    })
  }
}

const selectImage = (index: number) => {
  if (index >= 0 && index < images.value.length) {
    // 高亮选中的图片，可以添加选中状态或其他交互
    console.log('Selected image:', images.value[index])
    // 这里可以实现图片选中的逻辑，比如添加边框高亮等
  }
}
</script>

<style scoped>
.canvas-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.canvas-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.tool-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.tool-btn:hover {
  background: #f8f9fa;
  border-color: #007bff;
}

.zoom-info {
  font-size: 12px;
  color: #666;
  font-weight: bold;
}

.canvas-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-canvas {
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s ease;
}

.canvas-info {
  display: flex;
  justify-content: space-between;
  padding: 8px 15px;
  background: white;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  color: #666;
}

/* 图片控制按钮样式 */
.image-controls {
  position: absolute;
  display: flex;
  flex-direction: row;
  gap: 6px;
  z-index: 1000;
  pointer-events: all;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.control-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.08);
  position: relative;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-color: #007bff;
}

.control-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 14px;
  line-height: 1;
}

.btn-text {
  font-size: 10px;
  font-weight: bold;
  position: absolute;
  top: 2px;
  right: 2px;
  color: #007bff;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scale-btn .btn-text {
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .canvas-editor {
    height: auto;
    min-height: 400px;
  }
  
  .canvas-toolbar {
    padding: 8px;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .toolbar-left {
    gap: 6px;
  }
  
  .tool-btn {
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 6px;
  }
  
  .zoom-info {
    font-size: 12px;
  }
  
  .canvas-container {
    min-height: 300px;
    padding: 10px;
  }
  
  .main-canvas {
    max-width: 100%;
    max-height: 70vh;
    width: auto !important;
    height: auto !important;
  }
  
  .canvas-info {
    padding: 6px 10px;
    font-size: 11px;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .canvas-info span {
    white-space: nowrap;
  }
  
  .image-controls {
    padding: 4px;
    gap: 4px;
  }
  
  .control-btn {
    width: 32px;
    height: 32px;
  }
  
  .btn-icon {
    font-size: 12px;
  }
  
  .btn-text {
    font-size: 9px;
    width: 10px;
    height: 10px;
  }
}

@media (max-width: 480px) {
  .canvas-editor {
    min-height: 300px;
  }
  
  .canvas-toolbar {
    padding: 6px;
    justify-content: center;
  }
  
  .toolbar-left,
  .toolbar-right {
    gap: 4px;
  }
  
  .tool-btn {
    padding: 6px 8px;
    font-size: 11px;
    min-width: 60px;
  }
  
  .canvas-container {
    min-height: 250px;
    padding: 8px;
  }
  
  .main-canvas {
    max-height: 60vh;
  }
  
  .canvas-info {
    padding: 4px 8px;
    font-size: 10px;
    flex-direction: column;
    gap: 4px;
  }
  
  .image-controls {
    padding: 3px;
    gap: 3px;
  }
  
  .control-btn {
    width: 28px;
    height: 28px;
  }
  
  .btn-icon {
    font-size: 11px;
  }
}
</style>