/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Copy, 
  Download, 
  VideoOff, 
  Subtitles, 
  FileText, 
  Terminal, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Lang, FileItem, Subtitle, TRANSLATIONS } from '../types';

interface AutoResizeTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
  className?: string;
  placeholder?: string;
}

function AutoResizeTextarea({ value, className, onChange, onClick, placeholder }: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onClick={onClick}
      placeholder={placeholder}
      className={`${className || ''} overflow-hidden resize-none`}
    />
  );
}

interface PreviewPlayerProps {
  lang: Lang;
  selectedFile: FileItem | null;
  onModifySubtitle: (fileId: string, subtitleId: number, newText: string) => void;
  showToast: (msg: string) => void;
}

type TabType = 'srt' | 'txt' | 'timestamps' | 'json';

export default function PreviewPlayer({
  lang,
  selectedFile,
  onModifySubtitle,
  showToast
}: PreviewPlayerProps) {
  const t = TRANSLATIONS[lang];

  const [activeTab, setActiveTab] = useState<TabType>('srt');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0); // in milliseconds
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);



  // Parse duration string like "00:36" or "00:42" to total milliseconds
  const getDurationMs = (dur: string) => {
    const parts = dur.split(':');
    const mins = parseInt(parts[0], 10) || 0;
    const secs = parseInt(parts[1], 10) || 0;
    return (mins * 60 + secs) * 1000;
  };

  const getMsFromTimestamp = (ts: string) => {
    // format like "00:00:05,240"
    const parts = ts.split(':');
    const hours = parseInt(parts[0], 10) || 0;
    const mins = parseInt(parts[1], 10) || 0;
    const remaining = parts[2] || '0,0';
    const subparts = remaining.split(',');
    const secs = parseInt(subparts[0], 10) || 0;
    const ms = parseInt(subparts[1], 10) || 0;
    return ((hours * 60 + mins) * 60 + secs) * 1000 + ms;
  };

  const totalDurationMs = selectedFile ? getDurationMs(selectedFile.duration) : 1000;

  // Cleanup on unmount or file switch
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTimeMs(0);
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
    }
  }, [selectedFile]);

  // Handle simulated playback tick
  useEffect(() => {
    if (isPlaying) {
      playbackTimerRef.current = setInterval(() => {
        setCurrentTimeMs((prev) => {
          const next = prev + 100;
          if (next >= totalDurationMs) {
            setIsPlaying(false);
            if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
            return totalDurationMs;
          }
          return next;
        });
      }, 100);
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    }

    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, [isPlaying, totalDurationMs]);

  if (!selectedFile) {
    return (
      <aside className="w-full lg:w-[360px] bg-slate-50 flex flex-col border-l border-slate-200">
        <div className="h-12 border-b border-slate-200 flex items-center px-4">
          <span className="font-sans text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
            <Subtitles className="w-3.5 h-3.5 text-slate-600" />
            {t.realTimePreview}
          </span>
        </div>
        <div className="flex-1 flex flex-col p-4 gap-4 h-full">
          {/* Video Preview Placeholder */}
          <div className="aspect-video bg-slate-900 rounded-lg flex flex-col items-center justify-center relative overflow-hidden shadow-inner border border-slate-950">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <VideoOff className="text-slate-700/60 w-12 h-12 mb-2 stroke-[1.5]" />
            <span className="text-[10px] text-slate-600 tracking-wider font-semibold uppercase">
              视频播放器已断开
            </span>
          </div>
          {/* Preview Empty State Text */}
          <div className="flex-1 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-xl p-6 border-dashed">
            <div className="mb-3 p-3 rounded-full bg-slate-50 text-slate-400">
              <FileText className="w-6 h-6 stroke-[1.5] text-slate-400" />
            </div>
            <p className="font-sans text-xs font-bold text-slate-700 mb-1">
              {t.uploadToSee}
            </p>
            <p className="font-sans text-[11px] text-slate-400 italic">
              {t.previewSnycedDesc}
            </p>
          </div>
          {/* Export Settings (Inactive) */}
          <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
            <h4 className="font-sans text-[10px] font-bold text-slate-400 tracking-widest uppercase">
              {t.exportPreset}
            </h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2 rounded border border-slate-100 opacity-40">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">subtitles</span>
                  <span className="text-xs font-medium text-slate-500">{t.vttSrtBundle}</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-slate-400">check_circle</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded border border-slate-100 opacity-40">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-slate-400">movie</span>
                  <span className="text-xs font-medium text-slate-500">{t.hardcodedVideo}</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-slate-400">radio_button_unchecked</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Active highlighted subtitle finder based on simulated timestamp
  const getActiveSubtitleIndex = () => {
    return selectedFile.subtitles.findIndex((sub) => {
      const startMs = getMsFromTimestamp(sub.start);
      const endMs = getMsFromTimestamp(sub.end);
      return currentTimeMs >= startMs && currentTimeMs < endMs;
    });
  };

  const activeIndex = getActiveSubtitleIndex();

  // Auto-scroll the active subtitle block into view
  useEffect(() => {
    if (activeIndex !== -1 && listContainerRef.current) {
      const activeEl = listContainerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [activeIndex, activeTab]);

  const handleTimestampJump = (ts: string) => {
    const ms = getMsFromTimestamp(ts);
    setCurrentTimeMs(ms);
    setIsPlaying(true);
  };

  // Build string outputs for different tabs
  const getSrtOutput = () => {
    return selectedFile.subtitles
      .map((sub, index) => {
        return `${index + 1}\n${sub.start} --> ${sub.end}\n${sub.text}`;
      })
      .join('\n\n');
  };

  const getTxtOutput = () => {
    return selectedFile.subtitles
      .map((sub) => sub.text)
      .join('\n');
  };

  const getTimestampsOutput = () => {
    return selectedFile.subtitles
      .map((sub) => {
        return `[${sub.start.split(',')[0]} - ${sub.end.split(',')[0]}] ${sub.text}`;
      })
      .join('\n');
  };

  const getJsonOutput = () => {
    return JSON.stringify(selectedFile.subtitles, null, 2);
  };

  const currentOutputText = () => {
    switch (activeTab) {
      case 'srt': return getSrtOutput();
      case 'txt': return getTxtOutput();
      case 'timestamps': return getTimestampsOutput();
      case 'json': return getJsonOutput();
    }
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(currentOutputText());
    showToast(t.copiedToast);
  };

  const triggerDownload = (filename: string, text: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`已成功下载本地文件: ${filename}`);
  };

  const handleDownloadSingle = () => {
    const ext = activeTab === 'json' ? 'json' : activeTab === 'txt' ? 'txt' : 'srt';
    const name = selectedFile.name.replace('.mp4', `.${ext}`);
    triggerDownload(name, currentOutputText());
  };

  // Convert milliseconds back to beautiful display timer MM:SS
  const formatProgressTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="flex-1 bg-white border-l border-slate-200 flex flex-col overflow-hidden">
      {/* Tab Switch Row */}
      <div className="h-14 border-b border-slate-200 flex flex-wrap items-center px-4 bg-slate-50 justify-between gap-y-2 py-2">
        <div className="flex gap-2">
          {(['srt', 'txt', 'timestamps', 'json'] as TabType[]).map((tab) => {
            const label = tab === 'srt' ? t.mergedSrt : tab === 'txt' ? t.plainText : tab === 'timestamps' ? t.timestamps : t.jsonFormat;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/10' 
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopyClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold active:scale-95 transition-all cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{t.copy}</span>
          </button>
          
          <button 
            onClick={handleDownloadSingle}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-800 hover:bg-teal-900 border border-teal-800 text-white rounded-lg text-xs font-bold active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>保存</span>
          </button>
        </div>
      </div>

      {/* Embedded High Fidelity Media Simulator Workspace */}
      <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Playback simulation screen */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="aspect-video bg-slate-900 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group shadow-lg border border-slate-950">
            <img 
              alt={selectedFile.name} 
              src={selectedFile.thumbnail}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
              referrerPolicy="no-referrer"
            />
            {/* Dark glass backdrop overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30"></div>

            {/* Simulated Live Caption Center Overlap */}
            <div className="absolute bottom-12 left-4 right-4 text-center px-4">
              <span className="inline-block bg-black/75 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold text-white tracking-wide border border-white/5 backdrop-blur-sm select-auto">
                {activeIndex !== -1 
                  ? selectedFile.subtitles[activeIndex].text
                  : '（点击下方段落，或点击播放并预览字幕同步效果）'}
              </span>
            </div>

            {/* Video duration playback bar overlay */}
            <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between gap-4">
              <span className="text-[10px] text-white/90 font-bold font-mono bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs select-none">
                {formatProgressTime(currentTimeMs)}
              </span>
              <div className="flex-1 bg-white/20 h-1.5 rounded-full overflow-hidden relative cursor-pointer" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = clickX / rect.width;
                setCurrentTimeMs(Math.floor(ratio * totalDurationMs));
              }}>
                <div 
                  className="bg-teal-500 h-full rounded-full transition-all duration-75 relative" 
                  style={{ width: `${(currentTimeMs / totalDurationMs) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md"></div>
                </div>
              </div>
              <span className="text-[10px] text-white/90 font-bold font-mono bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs select-none">
                {selectedFile.duration}
              </span>
            </div>
          </div>

          {/* Simple Simulator Controls */}
          <div className="flex justify-center items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <button 
              onClick={() => setCurrentTimeMs(0)}
              className="p-2 bg-white border border-slate-200 hover:bg-slate-100 hover:text-red-700 rounded-lg active:scale-95 transition-all text-slate-600 cursor-pointer"
              title="重头播放"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md hover:shadow-teal-700/10 font-bold text-xs uppercase tracking-wide flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>暂停</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" strokeWidth={3} />
                  <span>播放预览</span>
                </>
              )}
            </button>

            <span className="text-[11px] font-bold text-slate-500 bg-slate-200/50 px-2.5 py-1 rounded">
              已开启 GPU 硬件加速
            </span>
          </div>
        </div>

        {/* Subtitle segments workspace with inline editable segments */}
        <div className="flex-1 flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-inner">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest select-none">
              {activeTab === 'srt' && 'SRT 格式字幕 (点击卡片播放/定位，可编辑文本)'}
              {activeTab === 'txt' && '简谐纯文本 (点击卡片播放/定位，可编辑文本)'}
              {activeTab === 'timestamps' && '时间标示文本 (点击卡片播放/定位，可编辑文本)'}
              {activeTab === 'json' && 'JSON 数据段 (点击卡片播放/定位，可编辑文本)'}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-teal-50 border border-teal-200 rounded text-teal-800 text-[10px] font-bold">
              <CheckCircle className="w-3 h-3 stroke-[2.5]" />
              <span>{t.readyForExport}</span>
            </div>
          </div>

          <div 
            ref={listContainerRef} 
            className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[420px]"
          >
            {activeTab === 'srt' && selectedFile.subtitles.map((sub, index) => {
              const isActive = index === activeIndex;
              return (
                <div 
                  key={sub.id}
                  data-active={isActive ? "true" : "false"}
                  onClick={() => handleTimestampJump(sub.start)}
                  className={`p-3 rounded-lg border transition-all duration-150 flex flex-col gap-1.5 cursor-pointer text-left ${
                    isActive 
                      ? 'bg-teal-50/90 border-teal-500/80 shadow-md ring-1 ring-teal-500/30' 
                      : 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 select-none">
                    <span className="text-teal-600 font-mono">
                      {index + 1}
                    </span>
                    <span className="text-slate-400">#{sub.id}</span>
                  </div>
                  <div className="text-xs font-mono text-teal-700 font-bold select-none">
                    {sub.start} --&gt; {sub.end}
                  </div>
                  <AutoResizeTextarea
                    value={sub.text}
                    onClick={(e) => e.stopPropagation()} // Prevent jump on click text input
                    onChange={(e) => onModifySubtitle(selectedFile.id, sub.id, e.target.value)}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-xs font-semibold text-slate-800 resize-none font-sans overflow-hidden"
                    placeholder="输入字幕内容..."
                  />
                </div>
              );
            })}

            {activeTab === 'txt' && selectedFile.subtitles.map((sub, index) => {
              const isActive = index === activeIndex;
              return (
                <div 
                  key={sub.id}
                  data-active={isActive ? "true" : "false"}
                  onClick={() => handleTimestampJump(sub.start)}
                  className={`p-3 rounded-lg border transition-all duration-150 flex flex-col gap-1 cursor-pointer text-left ${
                    isActive 
                      ? 'bg-teal-50/90 border-teal-500/80 shadow-md ring-1 ring-teal-500/30 font-bold' 
                      : 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 select-none">
                    <span>行 {index + 1}</span>
                    <span>#{sub.id}</span>
                  </div>
                  <AutoResizeTextarea
                    value={sub.text}
                    onClick={(e) => e.stopPropagation()} // Prevent jump on click text input
                    onChange={(e) => onModifySubtitle(selectedFile.id, sub.id, e.target.value)}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-xs font-semibold text-slate-800 resize-none font-sans overflow-hidden"
                    placeholder="输入字幕内容..."
                  />
                </div>
              );
            })}

            {activeTab === 'timestamps' && selectedFile.subtitles.map((sub, index) => {
              const isActive = index === activeIndex;
              return (
                <div 
                  key={sub.id}
                  data-active={isActive ? "true" : "false"}
                  onClick={() => handleTimestampJump(sub.start)}
                  className={`p-3 rounded-lg border transition-all duration-150 flex flex-col gap-1.5 cursor-pointer text-left ${
                    isActive 
                      ? 'bg-teal-50/90 border-teal-500/80 shadow-md ring-1 ring-teal-500/30' 
                      : 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
                    <span className="text-teal-700 font-bold">[{sub.start.split(',')[0]} - {sub.end.split(',')[0]}]</span>
                    <span>#{sub.id}</span>
                  </div>
                  <AutoResizeTextarea
                    value={sub.text}
                    onClick={(e) => e.stopPropagation()} // Prevent jump on click text input
                    onChange={(e) => onModifySubtitle(selectedFile.id, sub.id, e.target.value)}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-xs font-semibold text-slate-800 resize-none font-sans overflow-hidden"
                    placeholder="输入字幕内容..."
                  />
                </div>
              );
            })}

            {activeTab === 'json' && selectedFile.subtitles.map((sub, index) => {
              const isActive = index === activeIndex;
              return (
                <div 
                  key={sub.id}
                  data-active={isActive ? "true" : "false"}
                  onClick={() => handleTimestampJump(sub.start)}
                  className={`p-3 rounded-lg border transition-all duration-150 flex flex-col gap-1 cursor-pointer text-left font-mono ${
                    isActive 
                      ? 'bg-teal-50/90 border-teal-500/80 shadow-md ring-1 ring-teal-500/30' 
                      : 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="text-[11px] text-slate-400 select-none flex justify-between">
                    <span>{`{`}</span>
                    <span>#{sub.id}</span>
                  </div>
                  <div className="pl-4 text-[11px] text-slate-600 space-y-0.5">
                    <div>
                      <span className="text-purple-600">"id"</span>: <span className="text-amber-600">{sub.id}</span>,
                    </div>
                    <div>
                      <span className="text-purple-600">"start"</span>: <span className="text-green-600">"{sub.start}"</span>,
                    </div>
                    <div>
                      <span className="text-purple-600">"end"</span>: <span className="text-green-600">"{sub.end}"</span>,
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-600 whitespace-nowrap">"text"</span>:&nbsp;
                      <span className="text-green-600">"</span>
                      <AutoResizeTextarea
                        value={sub.text}
                        onClick={(e) => e.stopPropagation()} // Prevent jump on click text input
                        onChange={(e) => onModifySubtitle(selectedFile.id, sub.id, e.target.value)}
                        className="flex-1 bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-[11px] font-semibold text-green-700 resize-none font-mono overflow-hidden"
                        placeholder="输入字幕内容..."
                      />
                      <span className="text-green-600">"</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 select-none">
                    <span>{`}${index < selectedFile.subtitles.length - 1 ? ',' : ''}`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
