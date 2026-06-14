/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { Terminal, Cpu, HardDrive } from 'lucide-react';
import { Lang, TRANSLATIONS } from '../types';

interface ConsoleLogPanelProps {
  lang: Lang;
  logs: string[];
}

export default function ConsoleLogPanel({
  lang,
  logs
}: ConsoleLogPanelProps) {
  const t = TRANSLATIONS[lang];
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="bg-slate-950 text-slate-100 rounded-xl p-4 flex flex-col font-mono text-[11px] border border-slate-900 shadow-lg min-h-[140px] max-h-[180px] overflow-hidden select-text">
      {/* Console Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 select-none">
        <div className="flex items-center gap-1.5 font-sans font-bold text-slate-400 text-[10px] uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.consoleLogs}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-sans font-bold text-slate-500">
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-slate-600" />
            <span>NV-CUDA 硬件加速开启</span>
          </span>
          <span className="text-emerald-500 animate-pulse">● 完全离线运行中</span>
        </div>
      </div>

      {/* Scrolling logs output stream */}
      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {logs.length === 0 ? (
          <p className="text-slate-500 italic">
            {t.waitingModelOutput}
          </p>
        ) : (
          logs.map((log, i) => {
            const isError = log.includes('ERR') || log.includes('error') || log.includes('failed');
            const isSystem = log.startsWith('[SYS]');
            const isText = log.includes('Transcribed');

            return (
              <div 
                key={i} 
                className={`leading-relaxed whitespace-pre-wrap ${
                  isError 
                    ? 'text-rose-400' 
                    : isSystem 
                    ? 'text-cyan-400' 
                    : isText 
                    ? 'text-emerald-400 font-semibold' 
                    : 'text-slate-300'
                }`}
              >
                {log}
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
