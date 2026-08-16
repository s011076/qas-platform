import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  FileText, 
  Search, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
  Type,
  ChevronDown,
  Languages,
  Sun,
  Moon
} from 'lucide-react';
import { useLang } from '../i18n';
import { AppTab } from '../types';

export type FontScale = 'standard' | 'large' | 'xlarge';

interface HeaderProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenWechat: () => void;
  pendingCount?: number;
  fontScale?: FontScale;
  onChangeFontScale?: (scale: FontScale) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenWechat,
  pendingCount = 0,
  fontScale = 'standard',
  onChangeFontScale,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const { lang, setLang } = useLang();
  const isSimplified = lang === 'zh-Hans';
  const toggleLang = () => setLang(isSimplified ? 'zh-Hant' : 'zh-Hans');

  const navItems = [
    { id: 'home' as const, label: '首頁', icon: Building2, desc: '機構與課程介紹' },
    { id: 'courses' as const, label: '課程體系', icon: FileText, desc: '分享會 / QAS / 增值課包' },
    { id: 'recruit' as const, label: '招募資訊', icon: Search, desc: '行業優勢與薪資試算' },
    { id: 'schedule' as const, label: '開班日程', icon: Search, desc: '深圳 / 廣州場次' },
    { id: 'faq' as const, label: '常見問題', icon: Search, desc: '資格 / 考證 / 薪資' },
    { id: 'register' as const, label: '立即報名', icon: FileText, desc: '赴港資格自評與報名' },
    { id: 'student' as const, label: '查進度', icon: Search, desc: '審核狀態與課前資料' },
    { id: 'admin' as const, label: '教務CRM', icon: UserCheck, desc: '教務CRM與場次管理', badge: pendingCount > 0 ? pendingCount : undefined },
  ];

  const handleNavClick = (tab: AppTab) => {
    onSelectTab(tab);
  };

  const fontOptions: { id: FontScale; label: string; tag: string }[] = [
    { id: 'standard', label: '標準字體', tag: 'A' },
    { id: 'large', label: '大號字體', tag: 'A+' },
    { id: 'xlarge', label: '特大字體', tag: 'A++' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A1128]/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl select-none" id="main-app-header">
      
      {/* Top micro banner for trust badges - clean single line on mobile */}
      <div className="bg-[#070d1f] px-3 sm:px-4 py-1 text-[11px] text-slate-400 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1 text-[#D4AF37] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>香港保安局 QAS 認可標準</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-300 text-[11px] hidden xs:inline truncate">
              2天分享會 (¥1,200) 直通包含 20h QAS 預訓
            </span>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 text-slate-300 text-xs">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              id="theme-toggle-btn"
              title={theme === 'light' ? '切換為深色主題' : '切換為淺色主題'}
              className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
            >
              {theme === 'light'
                ? <Moon className="w-3.5 h-3.5 text-[#D4AF37]" />
                : <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />}
              <span className="font-bold text-[11px]">{theme === 'light' ? '深色' : '淺色'}</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              id="lang-toggle-btn"
              title={isSimplified ? '切換為繁體' : '切換為簡體'}
              className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-bold text-[11px]">{isSimplified ? '繁體' : '簡體'}</span>
            </button>

            {/* Font Size Selector Quick Bar */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">字體大小:</span>
              {fontOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => onChangeFontScale?.(opt.id)}
                  title={`切換為${opt.label}`}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    fontScale === opt.id
                      ? 'bg-[#D4AF37] text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white bg-slate-950/60'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button 
              onClick={onOpenWechat}
              id="header-top-wechat-btn"
              className="hover:text-[#D4AF37] flex items-center gap-1 transition-colors cursor-pointer text-[#D4AF37] font-semibold text-[11px] shrink-0"
            >
              <MessageSquare className="w-3 h-3" />
              <span>微信諮詢</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Brand Logo & Name (Prevent overlap on mobile) */}
          <div 
            onClick={() => handleNavClick('home')}
            id="brand-logo-container"
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-w-0"
          >
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-black text-sm shrink-0">
              QAS
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-[#D4AF37] transition-colors truncate">
                  粵港安聯
                </span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 font-bold shrink-0">
                  赴港直通
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium tracking-wide truncate hidden xs:block">
                香港保安/物管 QAS 預前專訓
              </p>
            </div>
          </div>

          {/* Desktop & Tablet Navigation Items (hidden on mobile — bottom nav handles phones) */}
          <nav className="hidden sm:flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 no-scrollbar shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-md shadow-[#D4AF37]/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/90 border border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-slate-950' : 'text-[#D4AF37]'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-rose-600 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.id === 'register' && !isActive && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Action Button (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenWechat}
              id="header-wechat-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-[#D4AF37] text-xs font-bold transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>加微信教務</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
