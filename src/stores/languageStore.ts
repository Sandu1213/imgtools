import { defineStore } from 'pinia'

// 支持的语言类型
export type Language = 'zh-CN'| 'en' | 'zh-TW' | 'de' | 'fr' | 'it' | 'ja' | 'ko' | 'pt' | 'es' | 'ru'

// 多语言文本定义
export interface LanguageTexts {
  // 页面标题
  title: string
  subtitle: string
  
  // 模式选择
  layoutMode: string
  stitchMode: string
  
  // 工具栏
  textTool: string
  arrowTool: string
  rectTool: string
  circleTool: string
  
  // 图片上传
  uploadTitle: string
  uploadSubtitle: string
  uploadBtn: string
  dragUpload: string
  
  // 布局选择
  layoutTitle: string
  
  // 画布设置
  canvasTitle: string
  canvasSize: string
  canvasBackground: string
  canvasBorder: string
  canvasSpacing: string
  
  // 拼接设置
  stitchTitle: string
  stitchDirection: string
  stitchSpacing: string
  horizontal: string
  vertical: string
  
  // 标注工具
  annotationTitle: string
  fontSize: string
  fontFamily: string
  fontColor: string
  fontWeight: string
  textShadow: string
  
  // 导出设置
  exportTitle: string
  exportFormat: string
  exportQuality: string
  exportBtn: string
  
  // 快捷键
  shortcuts: string
  shortcutHelp: string
  
  // 状态栏
  imageCount: string
  canvasInfo: string
  
  // 通用
  save: string
  cancel: string
  confirm: string
  delete: string
  copy: string
  paste: string
  undo: string
  redo: string
  clearAll: string
  randomSort: string
  
  // 语言名称
  languageName: string
}

// 所有语言的文本数据
const languageTexts: Record<Language, LanguageTexts> = {
  'en': {
    title: 'PhotoGrid Pro',
    subtitle: 'Create stunning photo collages and seamless panoramas with ease',
    layoutMode: 'Mosaic Grid',
    stitchMode: 'Panorama Stitch',
    textTool: 'Text',
    arrowTool: 'Arrow',
    rectTool: 'Rectangle',
    circleTool: 'Circle',
    uploadTitle: 'Image Upload',
    uploadSubtitle: 'Upload images to start creating',
    uploadBtn: 'Select Images',
    dragUpload: 'Drag images here or click to select',
    layoutTitle: 'Layout Selection',
    canvasTitle: 'Canvas Settings',
    canvasSize: 'Canvas Size',
    canvasBackground: 'Background',
    canvasBorder: 'Border',
    canvasSpacing: 'Spacing',
    stitchTitle: 'Stitch Settings',
    stitchDirection: 'Direction',
    stitchSpacing: 'Spacing',
    horizontal: 'Horizontal',
    vertical: 'Vertical',
    annotationTitle: 'Annotation Tools',
    fontSize: 'Font Size',
    fontFamily: 'Font Family',
    fontColor: 'Font Color',
    fontWeight: 'Font Weight',
    textShadow: 'Text Shadow',
    exportTitle: 'Export Settings',
    exportFormat: 'Format',
    exportQuality: 'Quality',
    exportBtn: 'Export',
    shortcuts: 'Shortcuts',
    shortcutHelp: 'Shortcut Help',
    imageCount: 'Images',
    canvasInfo: 'Canvas Info',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    copy: 'Copy',
    paste: 'Paste',
    undo: 'Undo',
    redo: 'Redo',
    clearAll: 'Clear All',
    randomSort: 'Random Sort',
    languageName: 'English'
  },
  'zh-CN': {
    title: 'PhotoGrid Pro',
    subtitle: '轻松创建精美照片拼图和无缝全景图',
    layoutMode: '网格拼图',
    stitchMode: '全景拼接',
    textTool: '文字',
    arrowTool: '箭头',
    rectTool: '矩形',
    circleTool: '圆形',
    uploadTitle: '图片上传',
    uploadSubtitle: '上传图片开始创作',
    uploadBtn: '选择图片',
    dragUpload: '拖拽图片到这里或点击选择',
    layoutTitle: '布局选择',
    canvasTitle: '画布设置',
    canvasSize: '画布尺寸',
    canvasBackground: '背景',
    canvasBorder: '边框',
    canvasSpacing: '间距',
    stitchTitle: '拼接设置',
    stitchDirection: '方向',
    stitchSpacing: '间距',
    horizontal: '横向',
    vertical: '竖向',
    annotationTitle: '标注工具',
    fontSize: '字体大小',
    fontFamily: '字体',
    fontColor: '字体颜色',
    fontWeight: '字体粗细',
    textShadow: '文字阴影',
    exportTitle: '导出设置',
    exportFormat: '格式',
    exportQuality: '质量',
    exportBtn: '导出',
    shortcuts: '快捷键',
    shortcutHelp: '快捷键帮助',
    imageCount: '图片数量',
    canvasInfo: '画布信息',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    copy: '复制',
    paste: '粘贴',
    undo: '撤销',
    redo: '重做',
    clearAll: '清空所有',
    randomSort: '随机排序',
    languageName: '简体中文'
  },
  'zh-TW': {
    title: 'PhotoGrid Pro',
    subtitle: '專業的線上圖片拼圖和長圖拼接工具',
    layoutMode: '佈局拼圖',
    stitchMode: '長圖拼接',
    textTool: '文字',
    arrowTool: '箭頭',
    rectTool: '矩形',
    circleTool: '圓形',
    uploadTitle: '圖片上傳',
    uploadSubtitle: '上傳圖片開始創作',
    uploadBtn: '選擇圖片',
    dragUpload: '拖拽圖片到這裡或點擊選擇',
    layoutTitle: '佈局選擇',
    canvasTitle: '畫布設置',
    canvasSize: '畫布尺寸',
    canvasBackground: '背景',
    canvasBorder: '邊框',
    canvasSpacing: '間距',
    stitchTitle: '拼接設置',
    stitchDirection: '方向',
    stitchSpacing: '間距',
    horizontal: '横向',
    vertical: '竖向',
    annotationTitle: '標註工具',
    fontSize: '字體大小',
    fontFamily: '字體',
    fontColor: '字體顏色',
    fontWeight: '字體粗細',
    textShadow: '文字陰影',
    exportTitle: '導出設置',
    exportFormat: '格式',
    exportQuality: '質量',
    exportBtn: '導出',
    shortcuts: '快捷鍵',
    shortcutHelp: '快捷鍵幫助',
    imageCount: '圖片數量',
    canvasInfo: '畫布信息',
    save: '保存',
    cancel: '取消',
    confirm: '確認',
    delete: '刪除',
    copy: '複製',
    paste: '粘貼',
    undo: '撤銷',
    redo: '重做',
    clearAll: '清空所有',
    randomSort: '隨機排序',
    languageName: '繁體中文'
  },
  'de': {
    title: 'PhotoGrid Pro',
    subtitle: 'Professionelles Online-Bildpuzzle und Langbild-Stitching-Tool',
    layoutMode: 'Layout-Puzzle',
    stitchMode: 'Langbild-Stitching',
    textTool: 'Text',
    arrowTool: 'Pfeil',
    rectTool: 'Rechteck',
    circleTool: 'Kreis',
    uploadTitle: 'Bilder hochladen',
    uploadSubtitle: 'Bilder hochladen, um zu beginnen',
    uploadBtn: 'Bilder auswählen',
    dragUpload: 'Bilder hierhin ziehen oder klicken zum Auswählen',
    layoutTitle: 'Layout-Auswahl',
    canvasTitle: 'Leinwand-Einstellungen',
    canvasSize: 'Leinwandgröße',
    canvasBackground: 'Hintergrund',
    canvasBorder: 'Rand',
    canvasSpacing: 'Abstand',
    stitchTitle: 'Stitching-Einstellungen',
    stitchDirection: 'Richtung',
    stitchSpacing: 'Abstand',
    horizontal: 'Horizontal',
    vertical: 'Vertikal',
    annotationTitle: 'Anmerkungstools',
    fontSize: 'Schriftgröße',
    fontFamily: 'Schriftart',
    fontColor: 'Schriftfarbe',
    fontWeight: 'Schriftstärke',
    textShadow: 'Textschatten',
    exportTitle: 'Export-Einstellungen',
    exportFormat: 'Format',
    exportQuality: 'Qualität',
    exportBtn: 'Exportieren',
    shortcuts: 'Tastenkürzel',
    shortcutHelp: 'Tastenkürzel-Hilfe',
    imageCount: 'Bilder',
    canvasInfo: 'Leinwand-Info',
    save: 'Speichern',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    delete: 'Löschen',
    copy: 'Kopieren',
    paste: 'Einfügen',
    undo: 'Rückgängig',
    redo: 'Wiederholen',
    clearAll: 'Alle löschen',
    randomSort: 'Zufällig sortieren',
    languageName: 'Deutsch'
  },
  'fr': {
    title: 'PhotoGrid Pro',
    subtitle: 'Outil professionnel de puzzle d\'images et d\'assemblage d\'images longues en ligne',
    layoutMode: 'Puzzle de Mise en Page',
    stitchMode: 'Assemblage d\'Images Longues',
    textTool: 'Texte',
    arrowTool: 'Flèche',
    rectTool: 'Rectangle',
    circleTool: 'Cercle',
    uploadTitle: 'Téléchargement d\'Images',
    uploadSubtitle: 'Téléchargez des images pour commencer',
    uploadBtn: 'Sélectionner des Images',
    dragUpload: 'Glissez les images ici ou cliquez pour sélectionner',
    layoutTitle: 'Sélection de Mise en Page',
    canvasTitle: 'Paramètres du Canevas',
    canvasSize: 'Taille du Canevas',
    canvasBackground: 'Arrière-plan',
    canvasBorder: 'Bordure',
    canvasSpacing: 'Espacement',
    stitchTitle: 'Paramètres d\'Assemblage',
    stitchDirection: 'Direction',
    stitchSpacing: 'Espacement',
    horizontal: 'Horizontal',
    vertical: 'Vertical',
    annotationTitle: 'Outils d\'Annotation',
    fontSize: 'Taille de Police',
    fontFamily: 'Police',
    fontColor: 'Couleur de Police',
    fontWeight: 'Épaisseur de Police',
    textShadow: 'Ombre de Texte',
    exportTitle: 'Paramètres d\'Export',
    exportFormat: 'Format',
    exportQuality: 'Qualité',
    exportBtn: 'Exporter',
    shortcuts: 'Raccourcis',
    shortcutHelp: 'Aide des Raccourcis',
    imageCount: 'Images',
    canvasInfo: 'Info du Canevas',
    save: 'Enregistrer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    delete: 'Supprimer',
    copy: 'Copier',
    paste: 'Coller',
    undo: 'Annuler',
    redo: 'Refaire',
    clearAll: 'Effacer Tout',
    randomSort: 'Tri Aléatoire',
    languageName: 'Français'
  },
  'it': {
    title: 'PhotoGrid Pro',
    subtitle: 'Strumento professionale online per puzzle di immagini e cucitura di immagini lunghe',
    layoutMode: 'Puzzle di Layout',
    stitchMode: 'Cucitura Immagini Lunghe',
    textTool: 'Testo',
    arrowTool: 'Freccia',
    rectTool: 'Rettangolo',
    circleTool: 'Cerchio',
    uploadTitle: 'Caricamento Immagini',
    uploadSubtitle: 'Carica immagini per iniziare',
    uploadBtn: 'Seleziona Immagini',
    dragUpload: 'Trascina immagini qui o clicca per selezionare',
    layoutTitle: 'Selezione Layout',
    canvasTitle: 'Impostazioni Canvas',
    canvasSize: 'Dimensione Canvas',
    canvasBackground: 'Sfondo',
    canvasBorder: 'Bordo',
    canvasSpacing: 'Spaziatura',
    stitchTitle: 'Impostazioni Cucitura',
    stitchDirection: 'Direzione',
    stitchSpacing: 'Spaziatura',
    horizontal: 'Orizzontale',
    vertical: 'Verticale',
    annotationTitle: 'Strumenti Annotazione',
    fontSize: 'Dimensione Font',
    fontFamily: 'Font',
    fontColor: 'Colore Font',
    fontWeight: 'Peso Font',
    textShadow: 'Ombra Testo',
    exportTitle: 'Impostazioni Export',
    exportFormat: 'Formato',
    exportQuality: 'Qualità',
    exportBtn: 'Esporta',
    shortcuts: 'Scorciatoie',
    shortcutHelp: 'Aiuto Scorciatoie',
    imageCount: 'Immagini',
    canvasInfo: 'Info Canvas',
    save: 'Salva',
    cancel: 'Annulla',
    confirm: 'Conferma',
    delete: 'Elimina',
    copy: 'Copia',
    paste: 'Incolla',
    undo: 'Annulla',
    redo: 'Ripeti',
    clearAll: 'Cancella Tutto',
    randomSort: 'Ordine Casuale',
    languageName: 'Italiano'
  },
  'ja': {
    title: 'PhotoGrid Pro',
    subtitle: 'プロフェッショナルなオンライン画像パズルと長画像結合ツール',
    layoutMode: 'レイアウトパズル',
    stitchMode: '長画像結合',
    textTool: 'テキスト',
    arrowTool: '矢印',
    rectTool: '四角形',
    circleTool: '円',
    uploadTitle: '画像アップロード',
    uploadSubtitle: '画像をアップロードして開始',
    uploadBtn: '画像を選択',
    dragUpload: '画像をここにドラッグまたはクリックして選択',
    layoutTitle: 'レイアウト選択',
    canvasTitle: 'キャンバス設定',
    canvasSize: 'キャンバスサイズ',
    canvasBackground: '背景',
    canvasBorder: '境界線',
    canvasSpacing: '間隔',
    stitchTitle: '結合設定',
    stitchDirection: '方向',
    stitchSpacing: '間隔',
    horizontal: '横向',
    vertical: '竖向',
    annotationTitle: '注釈ツール',
    fontSize: 'フォントサイズ',
    fontFamily: 'フォント',
    fontColor: 'フォント色',
    fontWeight: 'フォント太さ',
    textShadow: 'テキストシャドウ',
    exportTitle: 'エクスポート設定',
    exportFormat: 'フォーマット',
    exportQuality: '品質',
    exportBtn: 'エクスポート',
    shortcuts: 'ショートカット',
    shortcutHelp: 'ショートカットヘルプ',
    imageCount: '画像数',
    canvasInfo: 'キャンバス情報',
    save: '保存',
    cancel: 'キャンセル',
    confirm: '確認',
    delete: '削除',
    copy: 'コピー',
    paste: '貼り付け',
    undo: '元に戻す',
    redo: 'やり直し',
    clearAll: 'すべてクリア',
    randomSort: 'ランダムソート',
    languageName: '日本語'
  },
  'ko': {
    title: 'PhotoGrid Pro',
    subtitle: '전문 온라인 이미지 퍼즐 및 긴 이미지 결합 도구',
    layoutMode: '레이아웃 퍼즐',
    stitchMode: '긴 이미지 결합',
    textTool: '텍스트',
    arrowTool: '화살표',
    rectTool: '사각형',
    circleTool: '원',
    uploadTitle: '이미지 업로드',
    uploadSubtitle: '이미지를 업로드하여 시작',
    uploadBtn: '이미지 선택',
    dragUpload: '이미지를 여기로 드래그하거나 클릭하여 선택',
    layoutTitle: '레이아웃 선택',
    canvasTitle: '캔버스 설정',
    canvasSize: '캔버스 크기',
    canvasBackground: '배경',
    canvasBorder: '테두리',
    canvasSpacing: '간격',
    stitchTitle: '결합 설정',
    stitchDirection: '방향',
    stitchSpacing: '간격',
    horizontal: '수평',
    vertical: '수직',
    annotationTitle: '주석 도구',
    fontSize: '글꼴 크기',
    fontFamily: '글꼴',
    fontColor: '글꼴 색상',
    fontWeight: '글꼴 두께',
    textShadow: '텍스트 그림자',
    exportTitle: '내보내기 설정',
    exportFormat: '형식',
    exportQuality: '품질',
    exportBtn: '내보내기',
    shortcuts: '단축키',
    shortcutHelp: '단축키 도움말',
    imageCount: '이미지 수',
    canvasInfo: '캔버스 정보',
    save: '저장',
    cancel: '취소',
    confirm: '확인',
    delete: '삭제',
    copy: '복사',
    paste: '붙여넣기',
    undo: '실행 취소',
    redo: '다시 실행',
    clearAll: '모두 지우기',
    randomSort: '무작위 정렬',
    languageName: '한국어'
  },
  'pt': {
    title: 'PhotoGrid Pro',
    subtitle: 'Ferramenta profissional online para quebra-cabeças de imagem e costura de imagens longas',
    layoutMode: 'Quebra-Cabeças de Layout',
    stitchMode: 'Costura de Imagem Longa',
    textTool: 'Texto',
    arrowTool: 'Seta',
    rectTool: 'Retângulo',
    circleTool: 'Círculo',
    uploadTitle: 'Carregamento de Imagens',
    uploadSubtitle: 'Carregue imagens para começar',
    uploadBtn: 'Selecionar Imagens',
    dragUpload: 'Arraste imagens aqui ou clique para selecionar',
    layoutTitle: 'Seleção de Layout',
    canvasTitle: 'Configurações da Tela',
    canvasSize: 'Tamanho da Tela',
    canvasBackground: 'Fundo',
    canvasBorder: 'Borda',
    canvasSpacing: 'Espaçamento',
    stitchTitle: 'Configurações de Costura',
    stitchDirection: 'Direção',
    stitchSpacing: 'Espaçamento',
    horizontal: 'Horizontal',
    vertical: 'Vertical',
    annotationTitle: 'Ferramentas de Anotação',
    fontSize: 'Tamanho da Fonte',
    fontFamily: 'Fonte',
    fontColor: 'Cor da Fonte',
    fontWeight: 'Peso da Fonte',
    textShadow: 'Sombra do Texto',
    exportTitle: 'Configurações de Exportação',
    exportFormat: 'Formato',
    exportQuality: 'Qualidade',
    exportBtn: 'Exportar',
    shortcuts: 'Atalhos',
    shortcutHelp: 'Ajuda de Atalhos',
    imageCount: 'Imagens',
    canvasInfo: 'Info da Tela',
    save: 'Salvar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Excluir',
    copy: 'Copiar',
    paste: 'Colar',
    undo: 'Desfazer',
    redo: 'Refazer',
    clearAll: 'Limpar Tudo',
    randomSort: 'Ordenação Aleatória',
    languageName: 'Português'
  },
  'es': {
    title: 'PhotoGrid Pro',
    subtitle: 'Herramienta profesional en línea para rompecabezas de imágenes y costura de imágenes largas',
    layoutMode: 'Rompecabezas de Diseño',
    stitchMode: 'Costura de Imagen Larga',
    textTool: 'Texto',
    arrowTool: 'Flecha',
    rectTool: 'Rectángulo',
    circleTool: 'Círculo',
    uploadTitle: 'Carga de Imágenes',
    uploadSubtitle: 'Carga imágenes para comenzar',
    uploadBtn: 'Seleccionar Imágenes',
    dragUpload: 'Arrastra imágenes aquí o haz clic para seleccionar',
    layoutTitle: 'Selección de Diseño',
    canvasTitle: 'Configuraciones del Lienzo',
    canvasSize: 'Tamaño del Lienzo',
    canvasBackground: 'Fondo',
    canvasBorder: 'Borde',
    canvasSpacing: 'Espaciado',
    stitchTitle: 'Configuraciones de Costura',
    stitchDirection: 'Dirección',
    stitchSpacing: 'Espaciado',
    horizontal: 'Horizontal',
    vertical: 'Vertical',
    annotationTitle: 'Herramientas de Anotación',
    fontSize: 'Tamaño de Fuente',
    fontFamily: 'Fuente',
    fontColor: 'Color de Fuente',
    fontWeight: 'Peso de Fuente',
    textShadow: 'Sombra de Texto',
    exportTitle: 'Configuraciones de Exportación',
    exportFormat: 'Formato',
    exportQuality: 'Calidad',
    exportBtn: 'Exportar',
    shortcuts: 'Atajos',
    shortcutHelp: 'Ayuda de Atajos',
    imageCount: 'Imágenes',
    canvasInfo: 'Info del Lienzo',
    save: 'Guardar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Eliminar',
    copy: 'Copiar',
    paste: 'Pegar',
    undo: 'Deshacer',
    redo: 'Rehacer',
    clearAll: 'Limpiar Todo',
    randomSort: 'Ordenación Aleatoria',
    languageName: 'Español'
  },
  'ru': {
    title: 'PhotoGrid Pro',
    subtitle: 'Профессиональный онлайн-инструмент для создания пазлов изображений и склейки длинных изображений',
    layoutMode: 'Макетный Пазл',
    stitchMode: 'Склейка Длинных Изображений',
    textTool: 'Текст',
    arrowTool: 'Стрелка',
    rectTool: 'Прямоугольник',
    circleTool: 'Круг',
    uploadTitle: 'Загрузка Изображений',
    uploadSubtitle: 'Загрузите изображения для начала',
    uploadBtn: 'Выбрать Изображения',
    dragUpload: 'Перетащите изображения сюда или нажмите для выбора',
    layoutTitle: 'Выбор Макета',
    canvasTitle: 'Настройки Холста',
    canvasSize: 'Размер Холста',
    canvasBackground: 'Фон',
    canvasBorder: 'Граница',
    canvasSpacing: 'Расстояние',
    stitchTitle: 'Настройки Склейки',
    stitchDirection: 'Направление',
    stitchSpacing: 'Расстояние',
    horizontal: 'Горизонтально',
    vertical: 'Вертикально',
    annotationTitle: 'Инструменты Аннотации',
    fontSize: 'Размер Шрифта',
    fontFamily: 'Шрифт',
    fontColor: 'Цвет Шрифта',
    fontWeight: 'Толщина Шрифта',
    textShadow: 'Тень Текста',
    exportTitle: 'Настройки Экспорта',
    exportFormat: 'Формат',
    exportQuality: 'Качество',
    exportBtn: 'Экспорт',
    shortcuts: 'Горячие Клавиши',
    shortcutHelp: 'Справка по Горячим Клавишам',
    imageCount: 'Изображения',
    canvasInfo: 'Информация о Холсте',
    save: 'Сохранить',
    cancel: 'Отменить',
    confirm: 'Подтвердить',
    delete: 'Удалить',
    copy: 'Копировать',
    paste: 'Вставить',
    undo: 'Отменить',
    redo: 'Повторить',
    clearAll: 'Очистить Все',
    randomSort: 'Случайная Сортировка',
    languageName: 'Русский'
  }
}

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLanguage: 'zh-CN' as Language,
    availableLanguages: [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
      { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'it', name: 'Italiano', flag: '🇮🇹' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'ko', name: '한국어', flag: '🇰🇷' },
      { code: 'pt', name: 'Português', flag: '🇧🇷' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'ru', name: 'Русский', flag: '🇷🇺' }
    ] as Array<{ code: Language; name: string; flag: string }>
  }),

  getters: {
    // 获取当前语言的所有文本
    texts: (state): LanguageTexts => {
      return languageTexts[state.currentLanguage]
    },

    // 获取当前语言信息
    currentLanguageInfo: (state) => {
      return state.availableLanguages.find(lang => lang.code === state.currentLanguage)
    }
  },

  actions: {
    // 设置当前语言
    setLanguage(language: Language) {
      this.currentLanguage = language
      // 保存到本地存储
      localStorage.setItem('preferred-language', language)
    },

    // 从本地存储加载语言设置
    loadLanguageFromStorage() {
      const saved = localStorage.getItem('preferred-language') as Language
      if (saved && this.availableLanguages.some(lang => lang.code === saved)) {
        this.currentLanguage = saved
      }
    },

    // 获取指定语言的文本
    getTexts(language: Language): LanguageTexts {
      return languageTexts[language] || languageTexts['zh-CN']
    }
  }
})
