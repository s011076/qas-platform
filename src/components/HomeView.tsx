import React from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Calendar,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { CourseBatch } from '../types';

export type HomeTab = 'home' | 'courses' | 'recruit' | 'schedule' | 'faq' | 'register' | 'student' | 'admin';

interface HomeViewProps {
  onGoToRegister: (courseType?: string) => void;
  onGoToStudent: () => void;
  onOpenWechat: () => void;
  onNavigate: (tab: HomeTab) => void;
  batches: CourseBatch[];
}

const TRUST_METRICS = [
  { label: '月薪中位數', value: 'HK$18k-26k+', sub: '同工同酬 · 法定保障' },
  { label: '專項預訓課時', value: '20 小時', sub: '16h核心 + 4h赴港專案' },
  { label: '簽注等待黃金期', value: '4-6 個月', sub: '口語 + 術語賦能包' },
];

const ENTRY_CARDS = [
  {
    id: 'courses' as const,
    icon: BookOpen,
    title: '課程體系',
    desc: '2天分享會 (含20h QAS) · 增值課包 · 全套直通',
    accent: 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/25',
    btn: '查看課程',
  },
  {
    id: 'recruit' as const,
    icon: TrendingUp,
    title: '招募資訊',
    desc: '行業現況 · 年輕優勢 · 語言定薪資 · 薪酬試算',
    accent: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
    btn: '看市場與薪資',
  },
  {
    id: 'schedule' as const,
    icon: Calendar,
    title: '開班日程',
    desc: '深圳 / 廣州實體班與線上分享會場次',
    accent: 'text-sky-400 bg-sky-950/60 border-sky-800/60',
    btn: '查看場次',
  },
  {
    id: 'faq' as const,
    icon: HelpCircle,
    title: '常見問題',
    desc: '赴港資格 · QAS 認證 · 簽證等待期 · 薪資待遇',
    accent: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
    btn: '看 FAQ',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  onGoToRegister,
  onGoToStudent,
  onOpenWechat,
  onNavigate,
}) => {
  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in pb-10" id="home-view-root">
      {/* Hero Banner — clean & focused */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A1128] via-[#0d1633] to-[#070d1f] text-slate-200 pt-8 pb-10 sm:pt-14 sm:pb-14 px-4 sm:px-6 rounded-b-2xl border-b border-slate-800">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>面向廣東赴港人才 · QAS 預前培訓專項直通體系</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white max-w-3xl mx-auto">
            登陸香港物管安保高薪行業
            <span className="text-[#D4AF37] block mt-2">
              法定 QAS 預前專訓 + 4-6 個月增值賦能
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            香港保安物管業嚴重老齡化，年輕體能就是極大優勢！參加 <strong className="text-[#D4AF37]">2 天赴港就業分享會 (¥1,200)</strong> 即直接包含 <strong className="text-white">20 小時 QAS 預前培訓班</strong>。
          </p>

          {/* Trust metrics — 3, concise */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-2xl mx-auto pt-1">
            {TRUST_METRICS.map((m) => (
              <div key={m.label} className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                <div className="text-[10px] sm:text-[11px] uppercase text-slate-400 font-medium tracking-wider">{m.label}</div>
                <div className="text-sm sm:text-lg font-bold text-[#D4AF37] font-mono mt-0.5">{m.value}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 hidden xs:block">{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Single primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <button
              onClick={() => onGoToRegister('workshop_2day')}
              id="hero-primary-apply-btn"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2c] active:scale-[0.98] transition-all text-slate-950 font-black text-sm shadow-lg shadow-[#D4AF37]/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>立即預約分享會 + QAS (¥1,200 RMB)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenWechat}
              id="hero-secondary-wechat-btn"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] transition-all text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
              <span>加微信諮詢</span>
            </button>
          </div>

          <div className="pt-0.5">
            <button
              onClick={onGoToStudent}
              id="hero-check-status-link"
              className="text-xs text-slate-400 hover:text-[#D4AF37] underline underline-offset-4 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>已經報名？點此進入學員進度查詢</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Entry cards — split navigation to sub pages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {ENTRY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onNavigate(card.id)}
                id={`entry-${card.id}`}
                className="group bg-slate-900 rounded-2xl p-5 border border-slate-800 hover:border-slate-600 hover:-translate-y-0.5 transition-all text-left cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${card.accent}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-white text-sm group-hover:text-[#D4AF37] transition-colors">{card.title}</div>
                <div className="text-xs text-slate-400 mt-1 leading-relaxed">{card.desc}</div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#D4AF37] mt-3">
                  <span>{card.btn}</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* 5-step roadmap (concise) */}
        <section className="mt-10 sm:mt-12 bg-slate-900 rounded-2xl p-5 sm:p-8 border border-slate-800" id="roadmap-flow-section">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
              赴港發展路徑圖
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">從報名到赴港上崗 · 4 步全流程指引</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {[
              { n: '1', t: '線上自評報名', d: '填寫基本資料與語言自評', optional: false },
              { n: '2', t: '2 天分享會（含 20h QAS 預訓）', d: '1 對 1 評估競爭力，隨課完成 20 小時 QAS 法定預前培訓', optional: false },
              { n: '3', t: '簽注期語言增值', d: '4-6 個月等待期，英語口語 / 行業術語強化', optional: true },
              { n: '4', t: '赴港考證上崗', d: '赴港快速取證，直通香港物業公司', optional: false },
            ].map((step) => (
              <div key={step.n} className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${step.n === '4' ? 'bg-emerald-400 text-slate-950' : 'bg-[#D4AF37] text-slate-950'}`}>
                    {step.n}
                  </div>
                  {step.optional && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">選修</span>
                  )}
                </div>
                <h4 className="font-bold text-xs text-white leading-snug">{step.t}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-5">
            <button
              onClick={() => onGoToRegister()}
              id="roadmap-start-btn"
              className="px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              開啟我的赴港之路（立即報名）
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
