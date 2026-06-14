/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { 
  Layers, 
  Link as LinkIcon, 
  FolderPlus, 
  Sparkles, 
  CheckCircle2, 
  Circle,
  HelpCircle,
  TrendingUp,
  Cpu,
  RefreshCw,
  Info,
  Check,
  GripVertical
} from 'lucide-react';
import { Lang, FileItem, TRANSLATIONS } from '../types';

interface TaskQueueProps {
  lang: Lang;
  appState: 'empty' | 'processing' | 'results';
  files: FileItem[];
  selectedFileId: string | null;
  onSelectFile: (id: string) => void;
  onUploadSample: () => void;
  onStartMerge: () => void;
  onReset: () => void;
  onSimulatedUpload: (file: File) => void;
  workspaceMode: 'single' | 'batch';
  onSetWorkspaceMode: (mode: 'single' | 'batch') => void;
  onReorderFiles: (newFiles: FileItem[]) => void;
}

export default function TaskQueue({
  lang,
  appState,
  files,
  selectedFileId,
  onSelectFile,
  onUploadSample,
  onStartMerge,
  onReset,
  onSimulatedUpload,
  workspaceMode,
  onSetWorkspaceMode,
  onReorderFiles
}: TaskQueueProps) {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragEnterItem = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    
    const updatedFiles = [...files];
    const [draggedItem] = updatedFiles.splice(draggedIndex, 1);
    updatedFiles.splice(index, 0, draggedItem);
    
    onReorderFiles(updatedFiles);
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      onSimulatedUpload(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const chosenFile = e.target.files[0];
      onSimulatedUpload(chosenFile);
    }
  };

  const totalLoadedSize = files.reduce((acc, f) => {
    const space = parseFloat(f.size) || 0;
    return acc + space;
  }, 0);

  return (
    <aside className="w-full lg:w-[320px] bg-slate-50 border-r border-slate-200 flex flex-col p-4 select-none shrink-0">
      
      {/* Workspace category navigation selector (Image #2) */}
      <div className="mb-4">
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
          {t.workspace}
        </h2>
        <div className="flex flex-col gap-1.5">
          <button 
            type="button"
            onClick={() => onSetWorkspaceMode('single')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all cursor-pointer ${
              workspaceMode === 'single'
                ? 'bg-slate-200 text-teal-800 font-extrabold border border-slate-300/40 shadow-sm'
                : 'text-slate-500 hover:bg-slate-200 hover:text-slate-850 font-semibold'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-sm font-semibold">upload_file</span>
              <span>{t.single}</span>
            </div>
            {workspaceMode === 'single' && files.length > 0 && (
              <span className="bg-teal-700 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                {files.length}
              </span>
            )}
          </button>
          
          <button 
            type="button"
            onClick={() => onSetWorkspaceMode('batch')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all cursor-pointer ${
              workspaceMode === 'batch'
                ? 'bg-slate-200 text-teal-800 font-extrabold border border-slate-300/40 shadow-sm'
                : 'text-slate-500 hover:bg-slate-200 hover:text-slate-855 font-semibold'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-sm">merge</span>
              <span>{t.batchMerge}</span>
            </div>
            {workspaceMode === 'batch' && files.length > 0 && (
              <span className="bg-teal-700 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                {files.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Files Upload / Loaded List Container */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {appState === 'empty' ? (
          /* EMPTY State (Image #2) */
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex-1 border-2 border-dashed border-slate-200 hover:border-teal-600 rounded-xl flex flex-col items-center justify-center p-4 text-center transition-all bg-white hover:bg-teal-50/20"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              className="hidden" 
              accept="video/*,audio/*"
            />
            
            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mb-4 text-teal-700 shadow-sm">
              <span className="material-symbols-outlined text-[28px] animate-pulse">
                {workspaceMode === 'single' ? 'upload_file' : 'add_to_photos'}
              </span>
            </div>

            <p className="font-sans text-sm font-bold text-slate-800 mb-1">
              {workspaceMode === 'single' ? t.single : t.batchMerge}
            </p>
            <p className="font-sans text-[11px] text-slate-400 mb-6 px-2 leading-relaxed font-semibold">
              {workspaceMode === 'single' 
                ? '导入单个音视频进行本地快速转写。计算 100% 发生于您的本地客户端上，确保绝对安全保密。' 
                : t.uploadSegmentsDesc}
            </p>

            <div className="flex flex-col gap-2 w-full px-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-teal-700 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-teal-800 active:scale-95 transition-all w-full cursor-pointer"
              >
                {t.browseFiles}
              </button>
              
              <button 
                onClick={onUploadSample}
                className="bg-white border border-teal-200 text-teal-800 px-4 py-1.5 rounded-lg font-bold text-[11px] hover:bg-teal-50 active:scale-95 transition-all w-full flex items-center justify-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-700 flex-shrink-0 animate-bounce" />
                <span>{t.loadSamples}</span>
              </button>
            </div>
          </div>
        ) : (
          /* PROCESSING or RESULTS State List */
          <div className="flex-1 flex flex-col min-h-0 bg-white border border-slate-200 rounded-xl p-2.5 overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {appState === 'results' ? t.batchResults : t.taskQueue}
              </span>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
                共 {files.length} 个音视频片段
              </span>
            </div>

            {/* List entries */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
              {files.map((file, index) => {
                const isSelected = file.id === selectedFileId;
                const progressWidth = file.progress;
                const isDragging = draggedIndex === index;

                return (
                  <div 
                    key={file.id}
                    onClick={() => onSelectFile(file.id)}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragEnter={() => handleDragEnterItem(index)}
                    onDragOver={(e) => e.preventDefault()}
                    className={`p-2.5 rounded-lg border transition-all duration-150 cursor-grab active:cursor-grabbing flex flex-col gap-2 ${
                      isDragging 
                        ? 'opacity-30 border-dashed border-teal-300 bg-teal-50/20 shadow-none'
                        : isSelected 
                          ? 'border-teal-500 bg-teal-50/50 shadow-sm ring-1 ring-teal-500/20' 
                          : 'border-slate-150 bg-white hover:border-slate-350 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Drag grip icon */}
                      <div className="text-slate-355 hover:text-slate-500 cursor-grab active:cursor-grabbing flex-shrink-0 mr-0.5">
                        <GripVertical className="w-3.5 h-3.5 stroke-[2]" />
                      </div>

                      {/* Video clip miniature thumbnail with simulated playback overlay */}
                      <div className="h-10 w-10 flex-shrink-0 bg-slate-900 rounded-md overflow-hidden relative border border-slate-150">
                        <img 
                          alt="thumbnail" 
                          src={file.thumbnail} 
                          className="w-full h-full object-cover opacity-80" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          {file.status === 'ready' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3.5]" />
                          ) : (
                            <span className="material-symbols-outlined text-[14px] text-white opacity-95">play_arrow</span>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`text-[12px] font-bold truncate ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                            {file.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono font-medium">{file.duration}</span>
                        </div>

                        {/* Interactive segment status feedback */}
                        <div className="flex items-center gap-1.5 mt-1">
                          {file.status === 'ready' ? (
                            <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-100">
                               <span>{t.readyLabel}</span>
                            </div>
                          ) : file.status === 'processing' ? (
                            <div className="flex items-center gap-1 text-[10px] text-teal-700 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-ping"></span>
                              <span>智能转写中 ({file.progress}%)</span>
                            </div>
                          ) : file.status === 'identified' ? (
                            <div className="flex items-center gap-1 text-[10px] text-teal-600 font-semibold bg-teal-50 px-1 py-0.2 rounded">
                              <span>已成功装载</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                              <span>等待队列</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress tracking line for processing files */}
                    {file.status === 'processing' && (
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all duration-300"
                          style={{ width: `${progressWidth}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Simulated Workspace actions under listings */}
            <div className="pt-2.5 border-t border-slate-100 mt-2 flex flex-col gap-1.5">
              {appState === 'results' ? (
                <button 
                  onClick={onReset}
                  className="w-full py-2 bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.reset}</span>
                </button>
              ) : appState === 'processing' ? (
                <button 
                  disabled
                  className="w-full py-2 bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                  <span>{t.processingTitle}</span>
                </button>
              ) : (
                <button 
                  onClick={onStartMerge}
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-teal-700/10 flex items-center justify-center gap-1"
                >
                  <span>{t.startProcessing}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Disk & Storage Space Cache Gauge */}
        <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Info className="w-3.5 h-3.5 text-teal-700" />
            <span className="text-[11px] text-slate-700 font-bold">
              {t.localStorage}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-teal-600 h-full rounded-full transition-all duration-300"
              style={{ width: appState === 'empty' ? '5%' : '24.8%' }}
            ></div>
          </div>
          <p className="mt-1.5 text-[10px] text-slate-400 font-medium font-sans">
            {t.storageCached
              .replace('{cached}', appState === 'empty' ? '0 GB' : '12.4 GB')
              .replace('{total}', '50 GB')
            }
          </p>
        </div>
      </div>
    </aside>
  );
}
