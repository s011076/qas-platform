import React, { useState } from 'react';
import {
  Users,
  Globe,
  Shield,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { SALARY_BENCHMARKS } from '../data/mockData';

interface RecruitViewProps {
  onGoToRegister: (courseType?: string) => void;
  onOpenWechat: () => void;
}

export const RecruitView: React.FC<RecruitViewProps> = ({ onGoToRegister, onOpenWechat }) => {
  const [selectedLanguageLevel, setSelectedLanguageLevel] = useState<'basic' | 'medium' | 'high'>('medium');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fade-in" id="recruit-view-root">
      {/* Page header */}
      <div className="max-w-3xl mx-auto text-center space-y-2">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded border border-[#D4AF37]/20">
          <Sparkles className="w-3.5 h-3.5" />
          香港保安業現況分析 · 你的巨大優勢
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          老齡化嚴重、年輕體能是極大優勢、語言決定薪資等級
        </h1>
        <p className="text-sm text-slate-400">
          香港本地保安從業人員平均年齡超過 55 歲，多數不具備良好英語溝通。大灣區 20-45 歲求職者只要粵語通順、掌握基礎行業英語，即具備顯著優勢。
        </p>
      </div>

      {/* 3 Key Structural Advantages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-400 flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-white text-sm">老齡化缺口極大</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            香港各大商場、地鐵站、寫字樓常年缺少年輕物管人員。具備良好體魄、退役或物管背景者在香港極受歡迎。
          </p>
        </div>

        <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-bold">
            <Globe className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-white text-sm">語言決定薪資上限</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            普通住宅只需地道粵語（約 HK$18k）；一旦具備英語日常接待能力，即可進駐中環甲級商廈或半山豪宅（HK$22k - 26k+）。
          </p>
        </div>

        <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center justify-center font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-white text-sm">合法合規 · 同工同酬</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            全面依循香港勞工處外勞政策，薪酬不得低於行業中位數，享有完整勞工假、年假、強積金及工傷保險。
          </p>
        </div>
      </div>

      {/* Interactive Language-to-Salary Simulator */}
      <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              <span>香港物管安保薪資等級試算 (依語言與資歷)</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">點擊不同能力標籤，查看在香港對應的真實崗位與收入</p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg w-full sm:w-auto border border-slate-800">
            <button
              onClick={() => setSelectedLanguageLevel('basic')}
              id="calc-level-basic-btn"
              className={`flex-1 sm:flex-initial px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                selectedLanguageLevel === 'basic'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              標準等級
            </button>
            <button
              onClick={() => setSelectedLanguageLevel('medium')}
              id="calc-level-medium-btn"
              className={`flex-1 sm:flex-initial px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                selectedLanguageLevel === 'medium'
                  ? 'bg-[#D4AF37] text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              甲級商廈級 (推薦)
            </button>
            <button
              onClick={() => setSelectedLanguageLevel('high')}
              id="calc-level-high-btn"
              className={`flex-1 sm:flex-initial px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                selectedLanguageLevel === 'high'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              頂級豪宅管家級
            </button>
          </div>
        </div>

        {/* Display active benchmark */}
        {(() => {
          const item = selectedLanguageLevel === 'basic'
            ? SALARY_BENCHMARKS[0]
            : selectedLanguageLevel === 'medium'
            ? SALARY_BENCHMARKS[1]
            : SALARY_BENCHMARKS[2];

          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
              <div className="md:col-span-2 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">{item.tier}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] font-semibold border border-[#D4AF37]/20">
                    {item.languageLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#070d1f] text-white p-4 rounded-lg text-center space-y-1 border border-slate-800">
                <div className="text-[10px] text-[#D4AF37] uppercase font-semibold">預估月薪 (港幣)</div>
                <div className="text-xl font-bold text-[#D4AF37] font-mono">{item.monthlyHKD}</div>
                <div className="text-xs text-slate-400 font-mono">{item.approxRMB}</div>
                <div className="text-[10px] text-slate-500 pt-1.5 border-t border-slate-800">
                  *實際依據面試表現及班次加班津貼發放
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* CTA */}
      <div className="text-center pt-2">
        <button
          onClick={() => onGoToRegister()}
          id="recruit-register-btn"
          className="px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          了解自己適合哪個等級（立即免費自評報名）
        </button>
      </div>
    </div>
  );
};
