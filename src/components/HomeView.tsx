import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Users, 
  Clock, 
  DollarSign, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  TrendingUp, 
  Award,
  Globe,
  Briefcase,
  AlertCircle,
  Search,
  HelpCircle,
  Check
} from 'lucide-react';
import { CourseBatch } from '../types';
import { SALARY_BENCHMARKS, FAQ_ITEMS, FAQItem } from '../data/mockData';

interface HomeViewProps {
  onGoToRegister: (courseType?: string) => void;
  onGoToStudent: () => void;
  onOpenWechat: () => void;
  batches: CourseBatch[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onGoToRegister,
  onGoToStudent,
  onOpenWechat,
  batches,
}) => {
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({ 'faq-1': true, 'faq-3': true, 'faq-5': true });
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
  const [selectedLanguageLevel, setSelectedLanguageLevel] = useState<'basic' | 'medium' | 'high'>('medium');

  const toggleFaq = (id: string) => {
    setOpenFaqIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    FAQ_ITEMS.forEach(item => {
      allOpen[item.id] = true;
    });
    setOpenFaqIds(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenFaqIds({});
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter(item => {
      const matchesCategory = faqCategory === 'all' || item.category === faqCategory;
      const matchesQuery = !faqSearchQuery.trim() || 
        item.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) || 
        item.a.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
        (item.highlight && item.highlight.toLowerCase().includes(faqSearchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [faqCategory, faqSearchQuery]);

  return (
    <div className="space-y-10 sm:space-y-12 animate-fade-in pb-12" id="home-view-root">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A1128] via-[#0d1633] to-[#070d1f] text-slate-200 pt-6 pb-10 sm:pt-12 sm:pb-16 px-4 sm:px-6 rounded-b-2xl shadow-2xl border-b border-slate-800">
        {/* Subtle background graphics */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-4 sm:space-y-5">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[#D4AF37] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span>面向廣東赴港人才 · QAS 預前培訓專項直通體系</span>
          </div>

          {/* Main Title (Clean mobile responsive wrapping with zero overlap) */}
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-snug sm:leading-tight text-white max-w-4xl mx-auto">
            登陸香港物管安保高薪行業 <br className="hidden sm:inline" />
            <span className="text-[#D4AF37] block sm:inline mt-1 sm:mt-0">
              法定 QAS 預前專訓 + 4-6 個月增值賦能
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            香港保安物管業嚴重老齡化，年輕體能就是極大優勢！參加 <strong className="text-[#D4AF37]">2 天赴港就業分享會 (¥1,200 人民幣)</strong> 即直接包含 <strong className="text-white">20 小時 QAS 預前培訓班</strong>，助你贏在起跑線。
          </p>

          {/* High Density Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 max-w-3xl mx-auto pt-1 text-left">
            <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 shadow-sm">
              <div className="text-[10px] uppercase text-slate-400 font-medium tracking-wider">月薪中位數</div>
              <div className="text-base sm:text-xl font-bold text-[#D4AF37] font-mono mt-0.5">HK$ 18k - 26k+</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 同工同酬 · 法定保障
              </div>
            </div>
            <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 shadow-sm">
              <div className="text-[10px] uppercase text-slate-400 font-medium tracking-wider">專項預訓課時</div>
              <div className="text-base sm:text-xl font-bold text-white font-mono mt-0.5">20 小時</div>
              <div className="text-[10px] text-slate-400 mt-1">16h核心 + 4h赴港專案</div>
            </div>
            <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 shadow-sm">
              <div className="text-[10px] uppercase text-slate-400 font-medium tracking-wider">2天分享會+QAS</div>
              <div className="text-base sm:text-xl font-bold text-[#D4AF37] font-mono mt-0.5">¥1,200 <span className="text-[10px] text-emerald-400 font-normal">人民幣</span></div>
              <div className="text-[10px] text-emerald-400 mt-1">已含 20h QAS 預前班</div>
            </div>
            <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 shadow-sm">
              <div className="text-[10px] uppercase text-slate-400 font-medium tracking-wider">簽注等待黃金期</div>
              <div className="text-base sm:text-xl font-bold text-emerald-400 font-mono mt-0.5">4 - 6 個月</div>
              <div className="text-[10px] text-slate-400 mt-1">口語 + 術語賦能包</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <button
              onClick={() => onGoToRegister('workshop_2day')}
              id="hero-primary-apply-btn"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-[#D4AF37]/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>立即預約分享會 + QAS (¥1,200 RMB)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenWechat}
              id="hero-secondary-wechat-btn"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>加微信諮詢 (領取最新職位表)</span>
            </button>
          </div>

          {/* Student quick track link */}
          <div className="pt-0.5">
            <button
              onClick={onGoToStudent}
              id="hero-check-status-link"
              className="text-xs text-slate-400 hover:text-[#D4AF37] underline underline-offset-4 transition-colors inline-flex items-center gap-1"
            >
              <span>已經報名？點此進入學員進度查詢與課前資料下載</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        
        {/* Section 1: 3 Core Course Pillars */}
        <section id="course-offerings-section" className="space-y-5">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded border border-[#D4AF37]/20">
              賦能課程體系 · 一站式直通
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              全方位賦能體系 · 讓你在香港職場脫穎而出
            </h2>
            <p className="text-xs text-slate-400">
              報名「2天赴港就業分享會 (¥1,200 人民幣)」即已直接包含 20 小時 QAS 預前培訓班，無需額外單獨報讀！
            </p>
          </div>

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
                  <h3 className="text-base font-bold text-white">
                    2 天赴港就業分享會 <span className="text-[#D4AF37] text-xs font-semibold">(含 20h QAS 預前班)</span>
                  </h3>
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
                  <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    簽證等待期增值賦能課包
                  </h3>
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
                  <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    全套赴港直通套裝 (全能版)
                  </h3>
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
        </section>

        {/* Section 2: Market Reality & Age/Language Advantages (Interactive Matrix) */}
        <section className="bg-slate-900/90 rounded-2xl p-5 sm:p-7 border border-slate-800 space-y-6" id="market-advantages-section">
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded uppercase tracking-wider border border-[#D4AF37]/20">
              香港保安業現況分析 · 你的巨大優勢
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              老齡化嚴重、年輕體能是極大優勢、語言決定薪資等級
            </h2>
            <p className="text-xs text-slate-400">
              香港本地保安從業人員平均年齡超過 55 歲，多數不具備良好英語溝通。大灣區 20-45 歲求職者只要粵語通順、掌握基礎行業英語，即具備顯著優勢。
            </p>
          </div>

          {/* 3 Key Structural Advantages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-400 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm">老齡化缺口極大</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                香港各大商場、地鐵站、寫字樓常年缺少年輕物管人員。具備良好體魄、退役或物管背景者在香港極受歡迎。
              </p>
            </div>

            <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-bold">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm">語言決定薪資上限</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                普通住宅只需地道粵語（約 HK$18k）；一旦具備英語日常接待能力，即可進駐中環甲級商廈或半山豪宅（HK$22k - 26k+）。
              </p>
            </div>

            <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm">合法合規 · 同工同酬</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                全面依循香港勞工處外勞政策，薪酬不得低於行業中位數，享有完整勞工假、年假、強積金及工傷保險。
              </p>
            </div>
          </div>

          {/* Interactive Language-to-Salary Simulator */}
          <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                  <span>香港物管安保薪資等級試算 (依語言與資歷)</span>
                </h4>
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
        </section>

        {/* Section 3: Upcoming Course Batches Preview */}
        <section className="space-y-4" id="upcoming-batches-section">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-800/60">
                近期開課日程
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                2026 深圳 / 廣州 實體班與線上分享會
              </h2>
            </div>
            <button
              onClick={() => onGoToRegister()}
              id="view-all-batches-register-btn"
              className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>查看全部場次並預約</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {batches.map((batch) => {
              const isFull = batch.enrolledCount >= batch.capacity;
              const remaining = batch.capacity - batch.enrolledCount;
              return (
                <div 
                  key={batch.id}
                  className="bg-slate-900 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                        {batch.courseType === 'qas_core' ? '20h 預前班' : batch.courseType === 'workshop_2day' ? '2天分享會' : '增值課包'}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        isFull 
                          ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60' 
                          : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                      }`}>
                        {isFull ? '名額已滿' : `餘額 ${remaining} 位`}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm">{batch.title}</h3>

                    <div className="space-y-1 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span>日期：{batch.startDate} 至 {batch.endDate} ({batch.scheduleTime})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span>地點：{batch.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span>主講導師：{batch.instructor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500">學費：</span>
                      <span className="text-xs font-bold text-[#D4AF37] font-mono ml-1">{batch.priceDisplay}</span>
                    </div>
                    <button
                      onClick={() => onGoToRegister(batch.courseType)}
                      disabled={isFull}
                      id={`batch-register-btn-${batch.id}`}
                      className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all ${
                        isFull
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 cursor-pointer'
                      }`}
                    >
                      <span>{isFull ? '已滿額' : '選此場次'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Roadmap Step by Step */}
        <section className="bg-slate-900 rounded-2xl p-5 sm:p-8 space-y-6 shadow-xl border border-slate-800" id="roadmap-flow-section">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
              赴港發展路徑圖
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              從報名到赴港上崗 · 5 步全流程指引
            </h2>
            <p className="text-xs text-slate-400">
              每一步均有專職教務老師全程跟進，無縫銜接香港物管僱主
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-1.5">
              <div className="w-6 h-6 rounded bg-[#D4AF37] text-slate-950 font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-xs text-white">線上自評報名</h4>
              <p className="text-[11px] text-slate-400">填寫基本資料與語言自評，獲取免費初審。</p>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-1.5">
              <div className="w-6 h-6 rounded bg-[#D4AF37] text-slate-950 font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-xs text-white">參加 2 天分享會</h4>
              <p className="text-[11px] text-slate-400">1 對 1 評估競爭力，明晰文化與薪資預期。</p>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-1.5">
              <div className="w-6 h-6 rounded bg-[#D4AF37] text-slate-950 font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-xs text-white">20h 預前培訓</h4>
              <p className="text-[11px] text-slate-400">精讀 16h 法定核心法規與 4h 赴港實操專題。</p>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-1.5">
              <div className="w-6 h-6 rounded bg-[#D4AF37] text-slate-950 font-bold text-xs flex items-center justify-center">
                4
              </div>
              <h4 className="font-bold text-xs text-white">簽注期語言增值</h4>
              <p className="text-[11px] text-slate-400">活用 4-6 個月辦證期，強化英語 100 句。</p>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-1.5">
              <div className="w-6 h-6 rounded bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center">
                5
              </div>
              <h4 className="font-bold text-xs text-white">赴港考證與上崗</h4>
              <p className="text-[11px] text-slate-400">赴港快速取證，直通香港各大物業公司。</p>
            </div>
          </div>

          <div className="text-center pt-1">
            <button
              onClick={() => onGoToRegister()}
              id="roadmap-start-btn"
              className="px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              開啟我的赴港之路（立即報名）
            </button>
          </div>
        </section>

        {/* Section 5: Rich FAQ Accordion Panel */}
        <section className="space-y-6 max-w-4xl mx-auto" id="faq-section">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded uppercase tracking-wider border border-[#D4AF37]/20">
              <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>學員常見問題解答 · FAQ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              赴港資格、QAS 認證與工作待遇詳解
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              彙整數百位赴港學員最關心的政策、考證、簽證等待期與收費問題
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3.5 shadow-sm">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                placeholder="搜尋關鍵詞（例如：年齡、無犯罪記錄、QAS 考證、¥1,200、薪資、等待期）..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                id="faq-search-input"
              />
              {faqSearchQuery && (
                <button
                  onClick={() => setFaqSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  清除
                </button>
              )}
            </div>

            {/* Category Filter Pills & Expand Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: '全部問題' },
                  { id: 'qualification', label: '赴港資格與條件' },
                  { id: 'qas_cert', label: 'QAS 認證與考證' },
                  { id: 'courses', label: '課程體系與收費' },
                  { id: 'visa_salary', label: '簽證等待期與薪資' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFaqCategory(cat.id)}
                    id={`faq-category-${cat.id}`}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      faqCategory === cat.id
                        ? 'bg-[#D4AF37] text-slate-950 shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={handleExpandAll}
                  className="text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
                  id="faq-expand-all-btn"
                >
                  全部展開
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={handleCollapseAll}
                  className="text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
                  id="faq-collapse-all-btn"
                >
                  全部折疊
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3" id="faq-accordion-container">
            {filteredFaqs.length === 0 ? (
              <div className="bg-slate-900 rounded-xl p-8 text-center text-slate-400 border border-slate-800 space-y-2">
                <p className="text-base font-semibold">未找到符合「{faqSearchQuery}」的解答</p>
                <p className="text-xs text-slate-500">您可以切換分類或直接點擊下方微信聯繫教務老師諮詢。</p>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = !!openFaqIds[faq.id];
                return (
                  <div 
                    key={faq.id}
                    className={`bg-slate-900 rounded-2xl border transition-all overflow-hidden ${
                      isOpen ? 'border-[#D4AF37]/50 shadow-lg shadow-[#D4AF37]/5' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      id={`faq-toggle-${faq.id}`}
                      className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-950 text-[#D4AF37] border border-[#D4AF37]/30">
                            {faq.categoryName}
                          </span>
                          {faq.highlight && (
                            <span className="hidden sm:inline text-xs text-emerald-400 font-medium">
                              • {faq.highlight}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-white text-sm sm:text-base leading-snug flex items-start gap-2 pt-1">
                          <span className="text-[#D4AF37] font-mono text-base sm:text-lg">Q{index + 1}.</span>
                          <span>{faq.q}</span>
                        </h3>
                      </div>
                      
                      <div className="shrink-0 pt-1">
                        {isOpen ? (
                          <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
                            <ChevronUp className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-slate-950 text-slate-400 flex items-center justify-center border border-slate-800">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-2 text-sm text-slate-200 leading-relaxed border-t border-slate-800/80 bg-slate-950/60 space-y-3">
                        <div className="whitespace-pre-line text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                          {faq.a}
                        </div>
                        {faq.highlight && (
                          <div className="p-2.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-xs sm:text-sm text-[#D4AF37] font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                            <span>核心要點：{faq.highlight}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* More questions CTA banner */}
          <div className="bg-gradient-to-r from-slate-900 via-[#0d1633] to-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
            <div className="space-y-1">
              <div className="font-bold text-white text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <span>還有其他具體個人情況需要諮詢？</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                如年齡偏大、曾有行政處罰疑慮、學歷證明或外地戶籍辦理，歡迎聯繫專職教務老師 1 對 1 免費診斷。
              </div>
            </div>
            <button
              onClick={onOpenWechat}
              id="faq-contact-teacher-btn"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 text-xs sm:text-sm font-black shrink-0 transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <span>1 對 1 教務微信免費解答</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
