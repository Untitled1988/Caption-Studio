/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Lang = 'zh';

export interface Subtitle {
  id: number;
  start: string;
  end: string;
  text: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  duration: string;
  thumbnail: string;
  status: 'identified' | 'processing' | 'waiting' | 'ready';
  progress: number;
  subtitles: Subtitle[];
}

export interface AppSettings {
  whisperModel: string;
  defaultLanguage: string;
  uploadDir: string;
  outputDir: string;
  cachePath: string;
  cacheSize: string;
}

export const TRANSLATIONS = {
  zh: {
    // Header
    appName: '本地字幕工坊',
    versionLocal: 'v2.4.0 本地版',
    versionStable: 'v2.4.0-稳定版',
    offlineFirst: '本地离线',
    offlineActive: '离线模式已激活',

    // Sidebar Workspace
    studioWorkspace: '工作室工作区',
    workspace: '工作区选择',
    single: '单文件转写',
    batchMerge: '多文件合并',
    queue: '任务队列',
    export: '导出字幕',
    archive: '历史存档',
    uploadNew: '上传新文件',
    activeQueue: '当前队列',
    exportHistory: '导出记录',
    systemHealth: '系统健康',
    cpuUsage: 'CPU 占用: {cpu}% | 离线',
    settings: '系统设置',
    help: '使用帮助',

    // Left Panel Settings
    filesSelected: '已选择 {count} 个文件',
    totalSize: '总计: {sz}',
    changeSelection: '更改选择',
    language: '识别语言',
    autoDetect: '自动检测',
    chinese: '简体中文',
    transcriptionModel: '转写模型选择',
    whisperMedium: 'Whisper 均衡级 (Medium)',
    batchButton: '一键识别并合并',
    startTranscription: '开始转写',

    // Storage Info
    localStorage: '本地存储空间',
    storageCached: '50 GB 中的 {cached} 已本地缓存。',

    // Center Panel - Task Queue
    taskQueue: '待处理队列',
    activeTaskQueue: '当前任务队列',
    filesLoaded: '已加载 {count} 个文件',
    waitingFiles: '点击或拖拽视频至此导入',
    uploadSegmentsDesc: '支持导入 MP4, MKV, MP3 等主流格式。所有模型计算 100% 发生于您的本地显卡上，确保绝对保密运作。',
    browseFiles: '导入音视频',
    startProcessing: '开始字幕转写',
    consoleLogs: '本地终端日志',
    waitingModelOutput: '_ 准备运行 Whisper 本地推理内核...',
    itemsTotal: '共 {count} 个片段',

    // Center Panel - Results
    batchResults: '处理结果预览',
    totalDuration: '总时长: {dur}',
    reset: '清空工作区',
    downloadAll: '打包下载 (SRT / TXT / JSON / MD)',
    zipPackDesc: '所有转写好的文件将自动打包。',
    readyLabel: '转换完成',
    readyForExport: '等待导出',

    // Right Panel - Preview Empty
    realTimePreview: '视频播放与实时预览',
    uploadToSee: '请先在左侧导入并转写音视频文件。',
    previewSnycedDesc: '播放视频时，下方字幕编辑器将同步高亮滚动对应时间轴。',
    exportPreset: '导出预设选择',
    vttSrtBundle: 'VTT / SRT 压缩包',
    hardcodedVideo: '内嵌字幕视频',

    // Right Panel - Processing
    processingTitle: '语音转写中...',
    processingSubtitle: '正在加载本地 Whisper 模型进行高速解码，请稍候。',
    localEngine: '本地推理引擎',
    privacy: '机密安全',
    onDeviceText: '100% 离线自主运算',

    // Right Panel - Export Preview
    mergedSrt: '合并字幕 (SRT)',
    plainText: '纯文本 (TXT)',
    timestamps: '带时间轴 (TXT)',
    jsonFormat: '数据包 (JSON)',
    copy: '复制到剪贴板',
    downloadSrt: '导出 SRT',
    plainTxtFile: '导出纯文本 TXT',
    jsonDataFile: '导出 JSON 数据',
    markdownFile: '导出 Markdown',
    copiedToast: '内容已成功复制到剪贴板！',

    // Settings Modal
    systemSettings: '本地字幕工坊 - 系统设置',
    transcriptionEngine: 'Whisper 引擎配置 (支持本地显卡加速)',
    whisperModelLabel: 'Whisper 语音模型',
    defaultLanguageLabel: '默认转写核心语言',
    storagePaths: '本地保存路径与目录（自动同步）',
    uploadDirectoryPath: '视频导入缓存路径',
    outputDirectoryPath: '字幕保存输出目录',
    cacheDirectoryPath: 'Whisper 离线模型加载路径',
    maintenance: '临时缓存维护与空间清理',
    tempStorageUsage: '当前已为您占用 {sz} 本地存储。',
    clearCache: '清理全部本地缓存',
    cancel: '取消',
    saveChanges: '保存并应用更改',
    browseBtn: '更改...',

    // Errors Page
    ffmpegError: '未检测到系统 FFmpeg',
    ffmpegErrorDesc: '本地解码合并需要 FFmpeg 环境。请在系统环境变量中配置以便运行。',
    howToInstall: '查看安装配置教程',
    modelError: '离线重型模型未就绪',
    modelErrorDesc: '是否要下载 Whisper "Medium" 均衡级离线模型（约 1.5GB）？',
    downloadNow: '立即高速下行',

    // Extra Bilingual Assets / Demo Files
    loadSamples: '加载演示视频片段'
  }
};

export const INITIAL_DEMO_FILES: FileItem[] = [
  {
    id: '1',
    name: '会议视频片段_01.mp4',
    size: '34.2 MB',
    duration: '00:36',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz7ynYRGoaTJQDbrKcIGYCEkwBgUpfVkuT4ALfwwAd2m4ahWriFHry48K9HakfsCF9-JkRwMk3KhXHEl3b-Lkd53DTmkk0dJmEKTiOJcJqfGvjQYec_JAzQ99XuNxib9I8qQfknK7CW0HUPpTcv-XAg2z-xteNuHSDRSSBr0svkDGnW8gepEmigaQH5z8yIKLatCPDnBaLVR2wMHHc5Mg6QyoVkWIjyxk3vwkbEzeUvEmYnUONYvbv60if-OlM6i2fOcm7CFwaZ7g1',
    status: 'identified',
    progress: 100,
    subtitles: [
      { id: 1, start: '00:00:00,000', end: '00:00:05,000', text: '大家好，欢迎来到关于本地部署字幕及语音转写工具的这节课程。' },
      { id: 2, start: '00:00:05,000', end: '00:00:08,240', text: '今天，我们将实际展示并探索我们的工具如何完全离线处理大规模的媒体视频数据。' },
      { id: 3, start: '00:00:08,240', end: '00:00:12,500', text: '即使在外网完全断开、无网络连接的密闭环境下，它依然能完美运行。' },
      { id: 4, start: '00:00:12,500', end: '00:00:15,100', text: '可以说它在保障隐私安全的前提下，兼顾了快速、灵活、省时的绝对优势。' },
      { id: 5, start: '00:00:15,100', end: '00:00:20,000', text: '我们真心希望这个完全由本地显卡驱动的字幕工坊能成为您工作流的得力助手。' }
    ]
  },
  {
    id: '2',
    name: '技术讲座录音_02.mp4',
    size: '41.5 MB',
    duration: '00:42',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_BcocHhwN1GnUcAo8S4WtTh4Xj7GMSD5VYysxKU8Nw616OGrPFwmX5DV7p4iwDd4oui-DTXI4kHerwxX1qBAmzo8Ii_1kN8_JVEO01peKCt3NQmyrpK8HJUHdZLojs6tnFZw1dm78qHpNe7PEKvuku9OqROtclnegyOuc8lHGMYixWrvhwBFck3-WTbm0Tv9-DTAtphJ_Z7-bCWuCycp369lkU9CoEwlXi7OI-JDMNw1mYU41RXeCj1K7Vkt-0Y40inOPtA0HjoFB',
    status: 'processing',
    progress: 45,
    subtitles: [
      { id: 6, start: '00:00:20,000', end: '00:00:24,300', text: '下面让我们深入探究一下本套本地轻量系统对多卡及单卡硬件的具体要求。' },
      { id: 7, start: '00:00:24,300', end: '00:00:28,000', text: '事实上，绝大多数近年生产的消费级笔记本电脑都能非常流畅和高速地加载该模型。' },
      { id: 8, start: '00:00:28,000', end: '00:00:32,100', text: '得益于直接调用本地 GPU 硬件加速的技术，所有的处理和对齐时间都被最大化压缩了。' }
    ]
  },
  {
    id: '3',
    name: '自媒体短视频_03.mp4',
    size: '28.3 MB',
    duration: '00:28',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlrd9hEVRoORBCfxMaeCXGilyzH1E8Zl2u8uQ_wVHJwfSARVR13xY6ZGmrIusuy0JpDYpQa03evxz0GRCJ3sJdZqjAYk6Op-eyYWPXJQzbiXi_JMYnh7mtC_MQGpcqTv--5J0E0IGrmDHf4lBY12UMEfnENaP2vJhlMQielbgq5zyqy5lKoKuHs2GNi_PlvoC67JD-e4Jk_kWNoNwdutb9EeC9wHZpLt5Y9Z5LxNWCUnffGqCAu5XkOenT1Nwf2u-RXdIsqTFcuP3h',
    status: 'waiting',
    progress: 0,
    subtitles: [
      { id: 9, start: '00:00:32,100', end: '00:00:35,500', text: '最后这一步，让我们来详细说说如何把生成出的多段字幕一键对正拼合。' },
      { id: 10, start: '00:00:35,500', end: '00:00:40,000', text: '您可以通过右上角的软件设置，轻松变更在本地磁盘里的默认导出和存放目录。' },
      { id: 11, start: '00:00:40,000', end: '00:00:45,000', text: '所有的多个微视频字幕线如今已经全部实现了完美的时间轴同步与对齐。' }
    ]
  }
];

export const INITIAL_DEMO_SINGLE_FILE: FileItem = {
  id: 'single_1',
  name: '本地录音课程_单文件.mp4',
  size: '18.4 MB',
  duration: '01:12',
  thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz7ynYRGoaTJQDbrKcIGYCEkwBgUpfVkuT4ALfwwAd2m4ahWriFHry48K9HakfsCF9-JkRwMk3KhXHEl3b-Lkd53DTmkk0dJmEKTiOJcJqfGvjQYec_JAzQ99XuNxib9I8qQfknK7CW0HUPpTcv-XAg2z-xteNuHSDRSSBr0svkDGnW8gepEmigaQH5z8yIKLatCPDnBaLVR2wMHHc5Mg6QyoVkWIjyxk3vwkbEzeUvEmYnUONYvbv60if-OlM6i2fOcm7CFwaZ7g1',
  status: 'identified',
  progress: 100,
  subtitles: [
    { id: 1, start: '00:00:00,000', end: '00:00:06,000', text: '您好！当前正在使用的是单文件本地转写工作流。' },
    { id: 2, start: '00:00:06,000', end: '00:00:12,500', text: '相比于多视频批量拼合，单文件模式专注于为您提供极简的单视频转写体验。' },
    { id: 3, start: '00:00:12,500', end: '00:00:19,800', text: '您只需在左边将视频直接拖拽进来，或点击“导入音视频”按钮即可快速转换。' },
    { id: 4, start: '00:00:19,800', end: '00:00:26,400', text: '转写完毕之后，不仅可以直接在右侧对字幕进行双击编辑和微调。' },
    { id: 5, start: '00:00:26,400', end: '00:00:32,000', text: '也可以使用上方选项卡，自由导出为 SRT 字幕、TXT 文本或 JSON 等通用格式。' }
  ]
};
