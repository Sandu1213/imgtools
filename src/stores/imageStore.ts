import { defineStore } from 'pinia'

export interface ImageItem {
  id: string
  file: File
  url: string
  width: number
  height: number
  x?: number
  y?: number
  scaleX?: number
  scaleY?: number
  rotation?: number
}

export interface LayoutTemplate {
  id: string
  name: string
  imageCount: number
  cells: Array<{
    x: number
    y: number
    width: number
    height: number
  }>
}

export interface AnnotationItem {
  id: string
  type: 'text' | 'arrow' | 'rectangle' | 'circle'
  x: number
  y: number
  width?: number
  height?: number
  text?: string
  fontSize?: number
  fontFamily?: string
  fill?: string
  stroke?: string
  strokeWidth?: number
  points?: number[]
  shadowColor?: string
  shadowBlur?: number
}

export interface HistoryState {
  annotations: AnnotationItem[]
  selectedAnnotationId: string | null
}

export const useImageStore = defineStore('image', {
  state: () => ({
    images: [] as ImageItem[],
    currentMode: 'layout' as 'layout' | 'stitch',
    currentLayout: null as LayoutTemplate | null,
    annotations: [] as AnnotationItem[],
    selectedAnnotationId: null as string | null,
    // 历史记录
    history: [] as HistoryState[],
    historyIndex: -1,
    maxHistorySize: 50,
    canvasSettings: {
      width: 1000,
      height: 1000,
      backgroundColor: '#ffffff',
      backgroundImage: null as string | null,
      border: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      },
      spacing: 10,
      cornerRadius: 8
    },
    stitchSettings: {
      direction: 'vertical' as 'vertical' | 'horizontal',
      spacing: 10,
      alignment: 'start' as 'start' | 'center' | 'end'
    }
  }),
  
  actions: {
    addImage(file: File) {
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        this.images.push({
          id: Date.now().toString(),
          file,
          url,
          width: img.width,
          height: img.height,
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          rotation: 0
        })
      }
      img.src = url
    },
    
    removeImage(id: string) {
      const index = this.images.findIndex(img => img.id === id)
      if (index >= 0) {
        URL.revokeObjectURL(this.images[index].url)
        this.images.splice(index, 1)
      }
    },
    
    reorderImages(newOrder: ImageItem[]) {
      this.images = newOrder
    },
    
    updateImageProperties(id: string, properties: Partial<Omit<ImageItem, 'id' | 'file' | 'url'>>) {
      const image = this.images.find(img => img.id === id)
      if (image) {
        Object.assign(image, properties)
      }
    },
    
    setMode(mode: 'layout' | 'stitch') {
      this.currentMode = mode
    },
    
    setLayout(layout: LayoutTemplate) {
      this.currentLayout = layout
    },
    
    addAnnotation(annotation: AnnotationItem) {
      this.saveState()
      this.annotations.push(annotation)
    },
    
    selectAnnotation(id: string | null) {
      this.selectedAnnotationId = id
    },
    
    updateAnnotation(id: string, updates: Partial<AnnotationItem>) {
      const annotation = this.annotations.find(a => a.id === id)
      if (annotation) {
        Object.assign(annotation, updates)
      }
    },
    
    removeAnnotation(id: string) {
      this.saveState()
      const index = this.annotations.findIndex(a => a.id === id)
      if (index >= 0) {
        this.annotations.splice(index, 1)
        // 如果删除的是当前选中的标注，清空选中状态
        if (this.selectedAnnotationId === id) {
          this.selectedAnnotationId = null
        }
      }
    },
    
    duplicateAnnotation(id: string) {
      this.saveState()
      const annotation = this.annotations.find(a => a.id === id)
      if (annotation) {
        const duplicate = {
          ...annotation,
          id: Date.now().toString(),
          x: annotation.x + 20,
          y: annotation.y + 20
        }
        this.annotations.push(duplicate)
        this.selectedAnnotationId = duplicate.id
        return duplicate
      }
      return null
    },
    
    moveAnnotationToTop(id: string) {
      const index = this.annotations.findIndex(a => a.id === id)
      if (index >= 0) {
        const annotation = this.annotations.splice(index, 1)[0]
        this.annotations.push(annotation)
      }
    },
    
    moveAnnotationToBottom(id: string) {
      const index = this.annotations.findIndex(a => a.id === id)
      if (index >= 0) {
        const annotation = this.annotations.splice(index, 1)[0]
        this.annotations.unshift(annotation)
      }
    },
    
    moveAnnotationUp(id: string) {
      const index = this.annotations.findIndex(a => a.id === id)
      if (index > 0) {
        const annotation = this.annotations.splice(index, 1)[0]
        this.annotations.splice(index + 1, 0, annotation)
      }
    },
    
    moveAnnotationDown(id: string) {
      const index = this.annotations.findIndex(a => a.id === id)
      if (index >= 0 && index < this.annotations.length - 1) {
        const annotation = this.annotations.splice(index, 1)[0]
        this.annotations.splice(index - 1, 0, annotation)
      }
    },
    
    clearAnnotations() {
      this.saveState()
      this.annotations = []
      this.selectedAnnotationId = null
    },
    
    // 历史记录方法
    saveState() {
      const state: HistoryState = {
        annotations: JSON.parse(JSON.stringify(this.annotations)),
        selectedAnnotationId: this.selectedAnnotationId
      }
      
      // 移除当前索引之后的历史记录
      if (this.historyIndex < this.history.length - 1) {
        this.history.splice(this.historyIndex + 1)
      }
      
      // 添加新状态
      this.history.push(state)
      
      // 限制历史记录数量
      if (this.history.length > this.maxHistorySize) {
        this.history.shift()
      } else {
        this.historyIndex++
      }
    },
    
    undo() {
      if (this.historyIndex > 0) {
        this.historyIndex--
        const state = this.history[this.historyIndex]
        this.annotations = JSON.parse(JSON.stringify(state.annotations))
        this.selectedAnnotationId = state.selectedAnnotationId
      }
    },
    
    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++
        const state = this.history[this.historyIndex]
        this.annotations = JSON.parse(JSON.stringify(state.annotations))
        this.selectedAnnotationId = state.selectedAnnotationId
      }
    },
    
    canUndo() {
      return this.historyIndex > 0
    },
    
    canRedo() {
      return this.historyIndex < this.history.length - 1
    },
    
    updateCanvasSettings(settings: Partial<typeof this.canvasSettings>) {
      Object.assign(this.canvasSettings, settings)
    },
    
    updateStitchSettings(settings: Partial<typeof this.stitchSettings>) {
      Object.assign(this.stitchSettings, settings)
    }
  }
})
