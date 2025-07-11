import type { LayoutTemplate } from '@/stores/imageStore'

export const layoutTemplates: LayoutTemplate[] = [
  // 2张图片布局
  {
    id: '2-1',
    name: '2张图片 - 横向',
    imageCount: 2,
    cells: [
      { x: 0, y: 0, width: 0.5, height: 1 },
      { x: 0.5, y: 0, width: 0.5, height: 1 }
    ]
  },
  {
    id: '2-2',
    name: '2张图片 - 纵向',
    imageCount: 2,
    cells: [
      { x: 0, y: 0, width: 1, height: 0.5 },
      { x: 0, y: 0.5, width: 1, height: 0.5 }
    ]
  },
  
  // 3张图片布局
  {
    id: '3-1',
    name: '3张图片 - 一上二下',
    imageCount: 3,
    cells: [
      { x: 0, y: 0, width: 1, height: 0.5 },
      { x: 0, y: 0.5, width: 0.5, height: 0.5 },
      { x: 0.5, y: 0.5, width: 0.5, height: 0.5 }
    ]
  },
  {
    id: '3-2',
    name: '3张图片 - 一左二右',
    imageCount: 3,
    cells: [
      { x: 0, y: 0, width: 0.5, height: 1 },
      { x: 0.5, y: 0, width: 0.5, height: 0.5 },
      { x: 0.5, y: 0.5, width: 0.5, height: 0.5 }
    ]
  },
  {
    id: '3-3',
    name: '3张图片 - 横向',
    imageCount: 3,
    cells: [
      { x: 0, y: 0, width: 0.333, height: 1 },
      { x: 0.333, y: 0, width: 0.333, height: 1 },
      { x: 0.666, y: 0, width: 0.334, height: 1 }
    ]
  },
  
  // 4张图片布局
  {
    id: '4-1',
    name: '4张图片 - 田字格',
    imageCount: 4,
    cells: [
      { x: 0, y: 0, width: 0.5, height: 0.5 },
      { x: 0.5, y: 0, width: 0.5, height: 0.5 },
      { x: 0, y: 0.5, width: 0.5, height: 0.5 },
      { x: 0.5, y: 0.5, width: 0.5, height: 0.5 }
    ]
  },
  {
    id: '4-2',
    name: '4张图片 - 横向',
    imageCount: 4,
    cells: [
      { x: 0, y: 0, width: 0.25, height: 1 },
      { x: 0.25, y: 0, width: 0.25, height: 1 },
      { x: 0.5, y: 0, width: 0.25, height: 1 },
      { x: 0.75, y: 0, width: 0.25, height: 1 }
    ]
  },
  {
    id: '4-3',
    name: '4张图片 - 纵向',
    imageCount: 4,
    cells: [
      { x: 0, y: 0, width: 1, height: 0.25 },
      { x: 0, y: 0.25, width: 1, height: 0.25 },
      { x: 0, y: 0.5, width: 1, height: 0.25 },
      { x: 0, y: 0.75, width: 1, height: 0.25 }
    ]
  },
  
  // 6张图片布局
  {
    id: '6-1',
    name: '6张图片 - 2x3',
    imageCount: 6,
    cells: [
      { x: 0, y: 0, width: 0.5, height: 0.333 },
      { x: 0.5, y: 0, width: 0.5, height: 0.333 },
      { x: 0, y: 0.333, width: 0.5, height: 0.333 },
      { x: 0.5, y: 0.333, width: 0.5, height: 0.333 },
      { x: 0, y: 0.666, width: 0.5, height: 0.334 },
      { x: 0.5, y: 0.666, width: 0.5, height: 0.334 }
    ]
  },
  {
    id: '6-2',
    name: '6张图片 - 3x2',
    imageCount: 6,
    cells: [
      { x: 0, y: 0, width: 0.333, height: 0.5 },
      { x: 0.333, y: 0, width: 0.333, height: 0.5 },
      { x: 0.666, y: 0, width: 0.334, height: 0.5 },
      { x: 0, y: 0.5, width: 0.333, height: 0.5 },
      { x: 0.333, y: 0.5, width: 0.333, height: 0.5 },
      { x: 0.666, y: 0.5, width: 0.334, height: 0.5 }
    ]
  },
  
  // 9张图片布局
  {
    id: '9-1',
    name: '9张图片 - 3x3',
    imageCount: 9,
    cells: [
      { x: 0, y: 0, width: 0.333, height: 0.333 },
      { x: 0.333, y: 0, width: 0.333, height: 0.333 },
      { x: 0.666, y: 0, width: 0.334, height: 0.333 },
      { x: 0, y: 0.333, width: 0.333, height: 0.333 },
      { x: 0.333, y: 0.333, width: 0.333, height: 0.333 },
      { x: 0.666, y: 0.333, width: 0.334, height: 0.333 },
      { x: 0, y: 0.666, width: 0.333, height: 0.334 },
      { x: 0.333, y: 0.666, width: 0.333, height: 0.334 },
      { x: 0.666, y: 0.666, width: 0.334, height: 0.334 }
    ]
  }
]

// 生成更多布局（5, 7, 8, 10-16张）
for (let count = 5; count <= 16; count++) {
  if ([5, 7, 8, 10, 11, 12, 13, 14, 15, 16].includes(count)) {
    // 计算最优的行列数
    const cols = Math.ceil(Math.sqrt(count))
    const rows = Math.ceil(count / cols)
    
    const cells = []
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      cells.push({
        x: col / cols,
        y: row / rows,
        width: 1 / cols,
        height: 1 / rows
      })
    }
    
    layoutTemplates.push({
      id: `${count}-auto`,
      name: `${count}张图片 - 自动布局`,
      imageCount: count,
      cells
    })
  }
}

export function getLayoutsByImageCount(count: number): LayoutTemplate[] {
  return layoutTemplates.filter(template => template.imageCount === count)
}
