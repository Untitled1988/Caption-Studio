/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Workflow, 
  Layers, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Lock, 
  ArrowRight,
  Server,
  CloudOff,
  Terminal,
  Activity,
  UserCheck,
  Zap,
  Cpu
} from 'lucide-react';
import { Lang, FileItem, AppSettings, TRANSLATIONS, INITIAL_DEMO_FILES, INITIAL_DEMO_SINGLE_FILE } from './types';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import TaskQueue from './components/TaskQueue';
import PreviewPlayer from './components/PreviewPlayer';
import ConsoleLogPanel from './components/ConsoleLogPanel';

export default function App() {
  const lang: Lang = 'zh';
  const t = TRANSLATIONS[lang];

  // Workspace Mode: 'single' (单文件转写) | 'batch' (多文件合并)
  const [workspaceMode, setWorkspaceMode] = useState<'single' | 'batch'>('single');

  // Separated file queues and app states for perfect tab separation
  const [singleFiles, setSingleFiles] = useState<FileItem[]>([]);
  const [batchFiles, setBatchFiles] = useState<FileItem[]>([]);

  const [selectedSingleFileId, setSelectedSingleFileId] = useState<string | null>(null);
  const [selectedBatchFileId, setSelectedBatchFileId] = useState<string | null>(null);

  const [singleAppState, setSingleAppState] = useState<'empty' | 'processing' | 'results'>('empty');
  const [batchAppState, setBatchAppState] = useState<'empty' | 'processing' | 'results'>('empty');

  // Dynamic references based on chosen workspace mode
  const files = workspaceMode === 'single' ? singleFiles : batchFiles;
  const setFiles = workspaceMode === 'single' ? setSingleFiles : setBatchFiles;
  const selectedFileId = workspaceMode === 'single' ? selectedSingleFileId : selectedBatchFileId;
  const setSelectedFileId = workspaceMode === 'single' ? setSelectedSingleFileId : setSelectedBatchFileId;
  const appState = workspaceMode === 'single' ? singleAppState : batchAppState;
  const setAppState = workspaceMode === 'single' ? setSingleAppState : setBatchAppState;

  // System path configurations
  const [settings, setSettings] = useState<AppSettings>({
    whisperModel: 'medium',
    defaultLanguage: 'zh',
    uploadDir: '/Users/studio/local-caption/uploads',
    outputDir: '/Users/studio/local-caption/exports',
    cachePath: '/Users/studio/.cache/whisper',
    cacheSize: '4.2 GB'
  });
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cpuUsage, setCpuUsage] = useState(12);

  // CPU utilization heartbeat simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsage((prev) => {
        const base = appState === 'processing' ? 82 : 12;
        const jitter = Math.floor(Math.random() * 8) - 4;
        return Math.max(1, Math.min(99, base + jitter));
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [appState]);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Switch selected file
  const handleSelectFile = (id: string) => {
    setSelectedFileId(id);
  };

  // Subtitle modification updater
  const handleModifySubtitle = (fileId: string, subtitleId: number, newText: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) => {
        if (file.id === fileId) {
          return {
            ...file,
            subtitles: file.subtitles.map((sub) => {
              if (sub.id === subtitleId) {
                return { ...sub, text: newText };
              }
              return sub;
            })
          };
        }
        return file;
      })
    );
  };

  // Upload simulation
  const handleSimulatedUpload = (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');
    
    if (!isVideo && !isAudio) {
      alert('仅支持音视频媒体文件！');
      return;
    }

    const randomId = (files.length + 1).toString();
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    
    const thumbPool = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBz7ynYRGoaTJQDbrKcIGYCEkwBgUpfVkuT4ALfwwAd2m4ahWriFHry48K9HakfsCF9-JkRwMk3KhXHEl3b-Lkd53DTmkk0dJmEKTiOJcJqfGvjQYec_JAzQ99XuNxib9I8qQfknK7CW0HUPpTcv-XAg2z-xteNuHSDRSSBr0svkDGnW8gepEmigaQH5z8yIKLatCPDnBaLVR2wMHHc5Mg6QyoVkWIjyxk3vwkbEzeUvEmYnUONYvbv60if-OlM6i2fOcm7CFwaZ7g1',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA_BcocHhwN1GnUcAo8S4WtTh4Xj7GMSD5VYysxKU8Nw616OGrPFwmX5DV7p4iwDd4oui-DTXI4kHerwxX1qBAmzo8Ii_1kN8_JVEO01peKCt3NQmyrpK8HJUHdZLojs6tnFZw1dm78qHpNe7PEKvuku9OqROtclnegyOuc8lHGMYixWrvhwBFck3-WTbm0Tv9-DTAtphJ_Z7-bCWuCycp369lkU9CoEwlXi7OI-JDMNw1mYU41RXeCj1K7Vkt-0Y40inOPtA0HjoFB',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDlrd9hEVRoORBCfxMaeCXGilyzH1E8Zl2u8uQ_wVHJwfSARVR13xY6ZGmrIusuy0JpDYpQa03evxz0GRCJ3sJdZqjAYk6Op-eyYWPXJQzbiXi_JMYnh7mtC_MQGpcqTv--5J0E0IGrmDHf4lBY12UMEfnENaP2vJhlMQielbgq5zyqy5lKoKuHs2GNi_PlvoC67JD-e4Jk_kWNoNwdutb9EeC9wHZpLt5Y9Z5LxNWCUnffGqCAu5XkOenT1Nwf2u-RXdIsqTFcuP3h'
    ];
    
    // Create new imported item
    const newFile: FileItem = {
      id: randomId,
      name: file.name,
      size: `${sizeMb} MB`,
      duration: '00:15',
      thumbnail: thumbPool[Math.floor(Math.random() * thumbPool.length)],
      status: 'waiting',
      progress: 0,
      subtitles: [
        { id: 101, start: '00:00:00,000', end: '00:00:05,000', text: `这是为单文件 ${file.name} 在本地智能断句后生成的语音字幕。` },
        { id: 102, start: '00:00:05,000', end: '00:00:10,000', text: '本算法 100% 离线自主执行，未携带任何外发网络封包。' },
        { id: 103, start: '00:00:10,000', end: '00:00:15,000', text: '双击右侧可以快捷润色调优，一键在设置目录下打包并存盘！' }
      ]
    };

    setFiles((prev) => [...prev, newFile]);
    setSelectedFileId(randomId);
    setAppState('results');
    showToast(`已成功识别并添加视频: ${file.name}`);
  };

  // Samples loader
  const handleUploadSample = () => {
    if (workspaceMode === 'single') {
      setSingleFiles([INITIAL_DEMO_SINGLE_FILE]);
      setSelectedSingleFileId(INITIAL_DEMO_SINGLE_FILE.id);
      setSingleAppState('results');
      showToast('极简单文件演示项目加载成功！');
    } else {
      setBatchFiles(INITIAL_DEMO_FILES);
      setSelectedBatchFileId(INITIAL_DEMO_FILES[0].id);
      setBatchAppState('results');
      showToast('多段视频合并演示包已就绪！');
    }
  };

  // Inference simulator for transcription
  const handleStartMerge = () => {
    if (files.length === 0) {
      alert('请先导入音频/视频媒体文件，或直接加载预设演示！');
      return;
    }

    setAppState('processing');
    setConsoleLogs([]);

    const singleLogSequence = [
      '[SYS] [10:22:01] 正在配置离线单文件解码流上下文...',
      '[SYS] [10:22:02] 初始化英伟达 CUDA 硬件内核 (VAD 特征识别挂载中)...',
      '[SYS] [10:22:03] 装载本地 Whisper 均衡级 (Medium) 模型至图形显卡闪存...',
      `[SYS] [10:22:04] 正在分析解析目标流: [${files[0]?.name || '单个媒体.mp4'}] 的全音轨...`,
      '[SYS] [10:22:06] 启动语音静音剔除和高能声谱断句器算法...',
      `[SYS] [10:22:07] [已转换 40%] 实时解算时间戳边界中，过滤杂音抖度...`,
      `[SYS] [10:22:09] 匹配对应中国华语标准文本，自动保存至本地 SQLite 缓存...`,
      `[SYS] [10:22:10] 自主转写完成！成功生成离线 SRT/VTT 数据时轨。解构显显存占用。`
    ];

    const batchLogSequence = [
      '[SYS] [10:22:01] 正在前置加载合并工具多轨道流上下文...',
      '[SYS] [10:22:02] 初始化英伟达 CUDA 硬件内核 (显存多段合并模块就绪)...',
      '[SYS] [10:22:03] 装载本地 Whisper 均衡级 (Medium) 模型至图形显卡闪存...',
      `[SYS] [10:22:04] 分析提取片段 1: [${files[0]?.name || '片段_01.mp4'}] 声频纹理...`,
      '[SYS] [10:22:05] VAD 静音层自适应切分，解码高精段落中...',
      `[SYS] [10:22:06] [解析中] "大家好，欢迎来到关于本地..." 字幕对齐中...`,
      '[SYS] [10:22:07] 正在抓取片段 2 的声轨，并在 SQLite 缓存做拼接对齐...',
      `[SYS] [10:22:08] 对齐片段 2，同步多视频由于采样产生的毫秒级重叠缝隙...`,
      `[SYS] [10:22:09] 跨多片断音合并并计算全局时间轴定位线...`,
      `[SYS] [10:22:10] 聚合完成！多段视频大字幕合成资产输出预设完毕。`
    ];

    const logSequence = workspaceMode === 'single' ? singleLogSequence : batchLogSequence;

    let index = 0;
    const logInterval = setInterval(() => {
      if (index < logSequence.length) {
        setConsoleLogs((prev) => [...prev, logSequence[index]]);
        
        // Update items progress
        setFiles((prev) => 
          prev.map((f, fileIdx) => {
            if (fileIdx === 0) return { ...f, status: 'ready', progress: 100 };
            if (fileIdx === 1) return { ...f, status: 'processing', progress: Math.min(100, index * 15) };
            return { ...f, status: 'waiting', progress: 0 };
          })
        );
        index++;
      } else {
        clearInterval(logInterval);
        setFiles((prev) => prev.map(f => ({ ...f, status: 'ready', progress: 100 })));
        setAppState('results');
        showToast(workspaceMode === 'single' ? '单文件语音智能识别已完成！' : '批量多文件智能合并与转写已就绪！');
      }
    }, 500);
  };

  const handleReset = () => {
    setFiles([]);
    setSelectedFileId(null);
    setAppState('empty');
    setConsoleLogs([]);
    showToast('当前工作流已被重置清空');
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    showToast('存储配置与系统目录已经自动更新保存！');
  };

  const handleClearCache = () => {
    setSettings((prev) => ({ ...prev, cacheSize: '0 MB' }));
    showToast('本地缓存数据已全部清除释放，显卡性能已完全恢复。');
  };

  const selectedFile = files.find(f => f.id === selectedFileId) || null;

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans flex flex-col overflow-hidden text-slate-800">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-700/50 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></div>
          <span className="text-[11px] font-mono tracking-wide font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Title bar Header and Whisper settings parameters */}
      <Header 
        lang={lang} 
        setLang={() => {}}
        openSettings={() => setSettingsOpen(true)}
        whisperModel={settings.whisperModel}
        setWhisperModel={(model) => setSettings((prev) => ({ ...prev, whisperModel: model }))}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left interactive Task Sidebar */}
        <TaskQueue 
          lang={lang}
          appState={appState}
          files={files}
          selectedFileId={selectedFileId}
          onSelectFile={handleSelectFile}
          onUploadSample={handleUploadSample}
          onStartMerge={handleStartMerge}
          onReset={handleReset}
          onSimulatedUpload={handleSimulatedUpload}
          workspaceMode={workspaceMode}
          onSetWorkspaceMode={(mode) => {
            setWorkspaceMode(mode);
            setConsoleLogs([]);
          }}
          onReorderFiles={setFiles}
        />

        {/* Dynamic Center Workstation view */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {appState === 'empty' ? (
            /* EMPTY VIEW */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none overflow-y-auto max-h-screen">
              <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex flex-col items-center space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-full text-xs font-bold font-mono">
                    <CloudOff className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{t.offlineActive}</span>
                  </div>
                  
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                    {workspaceMode === 'single' ? '单视频全离线高精准智能字幕生成' : '多视频自动拼合并智能转写工作台'}
                  </h2>
                  <p className="text-xs text-slate-500 max-w-lg leading-relaxed font-medium">
                    {workspaceMode === 'single'
                      ? '基于业内主流 Whisper 模型，由您的本地图形处理器 (GPU) 100% 离线自主运算。仅需一键即可快速提取独立音视频的时间码与中文字幕。'
                      : '整合多段零散的录像剪辑，在无需重叠的前提下一键扫描并批量合并。所有提取的会话信息均进行无缝贴合。'}
                  </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col gap-1.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800">
                      <Lock className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-800">防泄密本地化运行</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      不依赖任何公有云 API 做解析。媒体内容绝不出网，保障军工级安全。
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col gap-1.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800">
                      <Layers className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-800">
                      {workspaceMode === 'single' ? '单文件高能断句' : '多视频智能对齐合并'}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {workspaceMode === 'single' 
                        ? '支持自适应静音剔除（VAD），自动在适当时间间隔断开段落时间。' 
                        : '一键将时间间隔不同、多个音频段落自动对角粘合，导出独立大字幕。'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col gap-1.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800">
                      <Zap className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-800">丰富存储导出</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      支持一键将字幕文本在本地打包输出为 SRT, 纯 TXT 或标准 JSON 等格式。
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleUploadSample}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg hover:shadow-teal-800/10 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{workspaceMode === 'single' ? '导入单文件演示' : '导入多合并演示包'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : appState === 'processing' ? (
            /* PROCESSING */
            <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 flex flex-col items-center justify-center text-center space-y-6 flex-1">
                
                <div className="relative flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-teal-700 animate-spin"></div>
                  <div className="absolute w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 shadow-inner">
                    <Workflow className="w-6 h-6 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg text-slate-800">
                    {workspaceMode === 'single' ? '本地 Whisper 引擎正在极速识别并渲染单文件中...' : '正在对多个视频做音频特征提取、智能断合流中...'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    这可能需要数秒钟。我们正在调用本地 CUDA 核运算，不消耗任何互联网网费流量。
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 flex gap-6 text-slate-600 select-none font-sans font-bold text-xs">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-teal-700 animate-pulse" />
                    <span>GPU 核心温度: 58°C</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l border-slate-200 pl-6">
                    <Cpu className="w-4 h-4 text-teal-700" />
                    <span>CUDA (已激活 FP16 精度)</span>
                  </div>
                </div>
              </div>

              {/* Streaming logs console */}
              <ConsoleLogPanel lang={lang} logs={consoleLogs} />
            </div>
          ) : (
            /* RESULTS CAPTION EDITOR */
            <div className="flex-1 flex flex-col overflow-hidden">
              <PreviewPlayer 
                lang={lang}
                selectedFile={selectedFile}
                onModifySubtitle={handleModifySubtitle}
                showToast={showToast}
              />
            </div>
          )}
        </div>
      </main>

      {/* Settings Panel Modal */}
      <SettingsModal 
        lang={lang}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
        onClearCache={handleClearCache}
      />

      {/* Footer System Belt */}
      <footer className="bg-white border-t border-slate-200 px-6 py-2.5 flex justify-between items-center text-[10px] text-slate-400 font-mono select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>本地 AI 智能卡内核已连接</span>
          </span>
          <span>显存架构 CUDA v76</span>
          <span className="hidden sm:inline">模型路径: {settings.cachePath}</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold">
          <span>本地 CPU: {cpuUsage}%</span>
          <span>|</span>
          <span>安全离线隔离会话主线程</span>
        </div>
      </footer>
    </div>
  );
}
