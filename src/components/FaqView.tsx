import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  HelpCircle,
  Users,
  ArrowRight,
} from 'lucide-react';
import { FAQ_ITEMS } from '../data/mockData';

interface FaqViewProps {
  onOpenWechat: () => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ onOpenWechat }) => {
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({ 'faq-1': true, 'faq-3': true, 'faq-5': true });
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 animate-fade-in" id="faq-view-root">
      {/* Page header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded uppercase tracking-wider border border-[#D4AF37]/20">
          <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
          <span>學員常見問題解答 · FAQ</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          赴港資格、QAS 認證與工作待遇詳解
        </h1>
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
                    <h2 className="font-bold text-white text-sm sm:text-base leading-snug flex items-start gap-2 pt-1">
                      <span className="text-[#D4AF37] font-mono text-base sm:text-lg">Q{index + 1}.</span>
                      <span>{faq.q}</span>
                    </h2>
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
    </div>
  );
};
