/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Settings, 
  HelpCircle, 
  CloudOff, 
  Globe, 
  Activity, 
  TrendingUp,
  Sliders,
  Sparkles
} from 'lucide-react';
import { Lang, TRANSLATIONS } from '../types';

interface HeaderProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
  openSettings: () => void;
  whisperModel: string;
  setWhisperModel: (model: string) => void;
}

export default function Header({
  lang,
  setLang,
  openSettings,
  whisperModel,
  setWhisperModel
}: HeaderProps) {
  const t = TRANSLATIONS[lang];

  return (
    <header className="bg-white border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center px-6 py-3 min-h-[56px] w-full z-30 select-none shadow-sm gap-4">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2">
          {/* Custom generated Teal Voice Signal Logo */}
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/10">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-5 h-5 animate-pulse"
            >
              <path d="M12 2v20M17 5v14M22 9v6M7 5v14M2 9v6" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="font-sans text-base font-extrabold text-slate-800 tracking-tight leading-tight">
              {t.appName}
            </h1>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold uppercase">
              {t.versionStable}
            </span>
          </div>
        </div>

        {/* Model quick select dropdown (matches user image select) */}
        <div className="flex items-center bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 gap-1.5 ml-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            模型:
          </span>
          <select 
            value={whisperModel}
            onChange={(e) => setWhisperModel(e.target.value)}
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-[11px] text-teal-700 font-bold cursor-pointer"
          >
            <option value="small">小型 (快速)</option>
            <option value="medium">中型 (均衡)</option>
            <option value="large-v3">模型：Large (高精度)</option>
          </select>
        </div>
      </div>

      {/* Navigation center links */}
      <div className="hidden lg:flex items-center bg-slate-100/80 p-0.5 rounded-lg border border-slate-200">
        <button className="text-slate-400 px-4 py-1.5 rounded-md font-medium text-xs cursor-not-allowed">
          {t.workspace}
        </button>
        <button className="bg-white text-teal-700 shadow-sm border border-slate-200/50 px-5 py-1.5 rounded-md font-bold text-xs">
          {t.export}
        </button>
        <button className="text-slate-400 px-4 py-1.5 rounded-md font-medium text-xs cursor-not-allowed">
          {t.archive}
        </button>
      </div>

      {/* Action controls */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
        {/* Offline status shield widget */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200">
          <CloudOff className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
          <span className="text-[11px] text-emerald-800 font-bold tracking-tight">
            {t.offlineFirst}
          </span>
        </div>

        {/* Support items */}
        <div className="flex items-center gap-1">
          <button 
            onClick={openSettings}
            className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-teal-700 rounded-lg transition-colors cursor-pointer"
            title={t.settings}
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => alert('提示：本地字幕工坊 v2.4 正在本地模式运行。所有转写计算 100% 发生于您的本地显卡，无需上传数据，保障绝对机密性！')}
            className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-teal-700 rounded-lg transition-colors cursor-pointer"
            title={t.help}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
