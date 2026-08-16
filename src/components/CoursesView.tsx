import React from 'react';
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CourseBatch } from '../types';

interface CoursesViewProps {
  onGoToRegister: (courseType?: string) => void;
  onOpenWechat: () => void;
  batches: CourseBatch[];
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  onGoToRegister,
  onOpenWechat,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 animate-fade-in" id="courses-view-root">
      {/* Page header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded border border-[#D4AF37]/20">
          <Sparkles className="w-3.5 h-3.5" />
          賦能課程體系 · 一站式直通
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          全方位賦能體系 · 讓你在香港職場脫穎而出
        </h1>
        <p className="text-sm text-slate-400">
          報名「2天赴港就業分享會 (¥1,200 人民幣)」即已直接包含 20 小時 QAS 預前培訓班，無需額外單獨報讀！
        </p>
      </div>

      {/* 3 Core Course Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: 2-Day Sharing Workshop (Directly Includes 20h QAS) */}
        <div className="bg-slate-900 rounded-xl p-5 border-2 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10 transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-lg">
            赴港必讀主修
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-lg bg-[#D4AF37] text-slate-950 flex items-center justify-center font-black text-base shadow">
                2天
              </div>
              <div className="text-right">
                <div className="text-base sm:text-lg font-black text-[#D4AF37] font-mono">¥1,200 人民幣</div>
                <div className="text-[11px] text-emerald-400 font-bold">已全含 20h QAS 預前班</div>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-white">
                2 天赴港就業分享會 <span className="text-[#D4AF37] text-xs font-semibold">(含 20h QAS 預前班)</span>
              </h2>
              <div className="text-xs text-emerald-400 font-bold mt-0.5">
                ¥1,200 全包：分享會 + 20小時 QAS 預訓
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              20 年香港資深物管總監親授。深度剖析香港僱主面試喜好、工作文化、租房生活成本及各級職位實際收入，<strong>並直接隨課完成 20 小時 QAS 法定預前培訓</strong>（無需另報 QAS 單獨班）。
            </p>

            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <li className="flex items-start gap-2 bg-[#D4AF37]/10 p-2 rounded border border-[#D4AF37]/20">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-white font-bold">全含 20 小時 QAS 預前班（16h 法定核心 + 4h 專項）</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span><strong className="text-white">1 對 1 赴港條件自我評估</strong>（語言、年齡定級與簡歷優化）</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>香港職場「暗語」與規矩（避免觸犯職場忌諱）</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>香港各大保安物管公司招募內幕與面試通關秘笈</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-800">
            <button
              onClick={() => onGoToRegister('workshop_2day')}
              id="course-apply-workshop-btn"
              className="w-full py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <span>立即預約分享會 (含 20h QAS · ¥1,200)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Value Pack 4-6 Months */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-slate-700 shadow-md transition-all flex flex-col justify-between group">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 flex items-center justify-center font-bold text-sm">
                4-6月
              </div>
              <div className="text-right">
                <div className="text-base font-black text-slate-200 font-mono">¥1,500 人民幣</div>
                <div className="text-[10px] text-sky-400 font-bold">辦證等待期專屬</div>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                簽證等待期增值賦能課包
              </h2>
              <div className="text-xs text-emerald-400 font-medium mt-0.5">
                活用 4-6 個月辦證期 · 語言能力翻倍
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              赴港工作簽證需要審批 4-6 個月。利用這段黃金期強化英語口語與行業術語，到港後直接面試 $20,000+ 甲級商廈！
            </p>

            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">常用英語 100 句</strong> (門禁、火警、引導)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>物管地道粵語術語（座頭、巡樓、交更、打蛇）</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>香港主管最在意的面試實戰話術演練</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>專屬微信社群每日 1 對 1 語音糾音反饋</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-800">
            <button
              onClick={() => onGoToRegister('value_pack')}
              id="course-apply-value-btn"
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>報名增值課包 (¥1,500)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </div>
        </div>

        {/* Card 3: Full Bundle */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-slate-700 shadow-md transition-all flex flex-col justify-between group">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 text-purple-300 flex items-center justify-center font-bold text-sm">
                全套
              </div>
              <div className="text-right">
                <div className="text-base font-black text-purple-300 font-mono">¥2,400 人民幣</div>
                <div className="text-[10px] text-purple-400 font-bold">組合特惠 · 立省 ¥300</div>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                全套赴港直通套裝 (全能版)
              </h2>
              <div className="text-xs text-purple-300 font-medium mt-0.5">
                2天分享會 (含20h QAS) + 4-6個月增值課包
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              從香港職場認知、QAS 預訓拿證，到簽證等待期英語粵語深化進階，一站式保駕護航，直通高薪物管標竿職位。
            </p>

            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">包含 2 天分享會 + 20h QAS 預訓</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">包含 4-6 個月等待期全部增值課程</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span>教務主管全程 1 對 1 履歷打磨與推介支持</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span>組合專享優惠（立省 ¥300 人民幣）</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-800">
            <button
              onClick={() => onGoToRegister('full_bundle')}
              id="course-apply-bundle-btn"
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>報名全套直通套裝 (¥2,400)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      </div>

      {/* Guarantee note */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <Shield className="w-4 h-4 text-[#D4AF37]" />
        <span>全部課程由持牌導師授課，嚴格依循香港保安及護衛業管理委員會 QAS 課程標準</span>
      </div>
    </div>
  );
};
