/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, X, HardDrive, Trash2, FolderPlus, Save, AlertTriangle } from 'lucide-react';
import { Lang, AppSettings, TRANSLATIONS } from '../types';

interface SettingsModalProps {
  lang: Lang;
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
  onClearCache: () => void;
}

export default function SettingsModal({
  lang,
  isOpen,
  onClose,
  settings,
  onSave,
  onClearCache
}: SettingsModalProps) {
  const t = TRANSLATIONS[lang];

  // Local state copy
  const [whisperModel, setWhisperModel] = useState(settings.whisperModel);
  const [defaultLanguage, setDefaultLanguage] = useState(settings.defaultLanguage);
  const [uploadDir, setUploadDir] = useState(settings.uploadDir);
  const [outputDir, setOutputDir] = useState(settings.outputDir);
  const [cachePath, setCachePath] = useState(settings.cachePath);
  const [cacheSize, setCacheSize] = useState(settings.cacheSize);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      whisperModel,
      defaultLanguage,
      uploadDir,
      outputDir,
      cachePath,
      cacheSize
    });
    onClose();
  };

  const handleClear = () => {
    if (confirm('您确定要清空 4.2GB 的本地缓存文件吗？这将释放本地显存并清除历史索引。')) {
      onClearCache();
      setCacheSize('0 MB');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <form 
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="font-sans text-lg font-bold text-slate-900">
              {t.systemSettings}
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh] flex flex-col gap-6">
          
          {/* Transcription Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="font-sans text-xs font-bold text-teal-800 uppercase tracking-widest">
                {t.transcriptionEngine}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">
                  {t.whisperModelLabel}
                </label>
                <select 
                  value={whisperModel}
                  onChange={(e) => setWhisperModel(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white font-medium text-slate-800"
                >
                  <option value="small">small (轻量快速：500MB)</option>
                  <option value="medium">medium (平衡：1.5GB)</option>
                  <option value="large-v3">large-v3 (高精度：3.1GB)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">
                  {t.defaultLanguageLabel}
                </label>
                <select 
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white font-medium text-slate-800"
                >
                  <option value="zh">简体中文</option>
                  <option value="en">英语</option>
                  <option value="es">西班牙语</option>
                  <option value="fr">法语</option>
                  <option value="auto">自动检测语种</option>
                </select>
              </div>
            </div>
          </section>

          {/* Storage Paths Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="font-sans text-xs font-bold text-teal-800 uppercase tracking-widest">
                {t.storagePaths}
              </span>
            </div>
            
            <div className="space-y-4">
              {/* Upload Directory */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">
                  {t.uploadDirectoryPath}
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={uploadDir}
                    onChange={(e) => setUploadDir(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-[11px] text-slate-600 focus:outline-none"
                    placeholder="/Users/studio/local-caption/uploads"
                  />
                  <button 
                    type="button"
                    onClick={() => alert('已模拟调用本地系统文件选取器')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs border border-slate-200"
                  >
                    {t.browseBtn}
                  </button>
                </div>
              </div>

              {/* Output Directory */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">
                  {t.outputDirectoryPath}
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={outputDir}
                    onChange={(e) => setOutputDir(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-[11px] text-slate-600 focus:outline-none"
                    placeholder="/Users/studio/local-caption/exports"
                  />
                  <button 
                    type="button"
                    onClick={() => alert('已模拟调用本地系统文件选取器')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs border border-slate-200"
                  >
                    {t.browseBtn}
                  </button>
                </div>
              </div>

              {/* Cache Path */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">
                  {t.cacheDirectoryPath}
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={cachePath}
                    onChange={(e) => setCachePath(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-[11px] text-slate-600 focus:outline-none"
                    placeholder="/Users/studio/.cache/whisper"
                  />
                  <button 
                    type="button"
                    onClick={() => alert('已模拟调用本地系统文件选取器')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs border border-slate-200"
                  >
                    {t.browseBtn}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Maintenance Section */}
          <section className="p-4 bg-teal-50/50 border border-teal-100 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-teal-800" />
                {t.maintenance}
              </p>
              <p className="text-xs text-slate-600">
                {t.tempStorageUsage.replace('{sz}', cacheSize)}
              </p>
            </div>
            <button 
              type="button"
              onClick={handleClear}
              disabled={cacheSize === '0 MB'}
              className="px-4 py-2 bg-white hover:bg-red-50 border border-red-200 text-red-700 rounded-lg font-bold text-xs transition-colors flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t.clearCache}
            </button>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2 font-bold text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors border border-slate-200"
          >
            {t.cancel}
          </button>
          <button 
            type="submit"
            className="px-6 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-lg shadow-md hover:shadow-teal-700/10 active:scale-95 transition-all flex items-center gap-1"
          >
            <Save className="w-3.5 h-3.5" />
            {t.saveChanges}
          </button>
        </div>
      </form>
    </div>
  );
}
