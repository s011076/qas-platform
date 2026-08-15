import React, { useState, useEffect, useRef } from 'react';
import { Header, FontScale } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { RegistrationView } from './components/RegistrationView';
import { StudentPortalView } from './components/StudentPortalView';
import { StaffAdminView } from './components/StaffAdminView';
import { WeChatContactModal } from './components/WeChatContactModal';
import { Candidate, CourseBatch, CourseType } from './types';
import { getStoredCandidates, getStoredBatches } from './services/storageService';
import { LangProvider, useDomLangSync } from './i18n';
import { Smartphone, Monitor, Building2, FileText, Search, UserCheck, MessageSquare } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'register' | 'student' | 'admin'>('home');
  const [isWechatModalOpen, setIsWechatModalOpen] = useState(false);
  const [registerCourseType, setRegisterCourseType] = useState<CourseType>('full_bundle');
  const [fontScale, setFontScale] = useState<FontScale>('standard');
  
  // Data state
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [batches, setBatches] = useState<CourseBatch[]>([]);

  // Lang conversion target (re-apply after view/data changes)
  const mainRef = useRef<HTMLElement>(null);
  useDomLangSync(mainRef, [currentTab, candidates, batches]);

  // Mobile simulator wrapper mode (optional user toggle)
  const [isMobileFrameMode, setIsMobileFrameMode] = useState(false);

  // Load data & subscribe to storage updates
  const loadData = () => {
    setCandidates(getStoredCandidates());
    setBatches(getStoredBatches());
  };

  useEffect(() => {
    loadData();

    const handleCandidateUpdate = () => loadData();
    const handleBatchUpdate = () => loadData();

    window.addEventListener('hk_qas_candidates_updated', handleCandidateUpdate);
    window.addEventListener('hk_qas_batches_updated', handleBatchUpdate);

    return () => {
      window.removeEventListener('hk_qas_candidates_updated', handleCandidateUpdate);
      window.removeEventListener('hk_qas_batches_updated', handleBatchUpdate);
    };
  }, []);

  // Handlers
  const handleSelectTab = (tab: 'home' | 'register' | 'student' | 'admin') => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToRegister = (courseType?: string) => {
    if (courseType) {
      setRegisterCourseType(courseType as CourseType);
    }
    setCurrentTab('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToStudent = () => {
    setCurrentTab('student');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pendingCount = candidates.filter(c => c.status === 'pending').length;

  return (
    <LangProvider>
    <div ref={mainRef} className={`min-h-screen bg-[#0A1128] text-slate-200 flex flex-col font-sans selection:bg-[#D4AF37] selection:text-slate-950 pb-16 sm:pb-0`}>
      
      {/* High Density Top Telemetry & Status Bar */}
      <div className="bg-[#070d1f] text-slate-400 text-[11px] py-1.5 px-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">QAS 預前培訓班</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">大灣區赴港物管人才專項對接系統</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-400">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> 伺服器運作正常
            </span>
            <span className="text-slate-700">·</span>
            <span>粵港實時名額同步中</span>
          </div>
          <button
            onClick={() => setIsMobileFrameMode(!isMobileFrameMode)}
            id="toggle-device-frame-btn"
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-[10px] px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300"
          >
            {isMobileFrameMode ? <Monitor className="w-3 h-3 text-[#D4AF37]" /> : <Smartphone className="w-3 h-3 text-[#D4AF37]" />}
            <span>{isMobileFrameMode ? '寬屏高密度模式' : '手機模擬視角'}</span>
          </button>
        </div>
      </div>

      {/* Main Container (responsive or phone frame) */}
      <div className={isMobileFrameMode ? 'max-w-md mx-auto my-4 shadow-2xl rounded-2xl overflow-hidden border border-slate-700 bg-[#0A1128] min-h-[844px] flex flex-col' : 'flex-1 flex flex-col'}>
        
        {/* Navigation Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          onOpenWechat={() => setIsWechatModalOpen(true)}
          pendingCount={pendingCount}
          fontScale={fontScale}
          onChangeFontScale={setFontScale}
        />

        {/* View Router */}
        <main className={`flex-1 font-scale-${fontScale}`}>
          {currentTab === 'home' && (
            <HomeView
              onGoToRegister={handleGoToRegister}
              onGoToStudent={handleGoToStudent}
              onOpenWechat={() => setIsWechatModalOpen(true)}
              batches={batches}
            />
          )}

          {currentTab === 'register' && (
            <RegistrationView
              initialCourseType={registerCourseType}
              onGoToStudent={handleGoToStudent}
              onOpenWechat={() => setIsWechatModalOpen(true)}
            />
          )}

          {currentTab === 'student' && (
            <StudentPortalView
              batches={batches}
              onGoToRegister={() => handleSelectTab('register')}
              onOpenWechat={() => setIsWechatModalOpen(true)}
            />
          )}

          {currentTab === 'admin' && (
            <StaffAdminView
              candidates={candidates}
              batches={batches}
              onRefreshData={loadData}
            />
          )}
        </main>

        {/* Global Footer */}
        <Footer
          onSelectTab={handleSelectTab}
          onOpenWechat={() => setIsWechatModalOpen(true)}
        />
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#070d1f]/95 backdrop-blur-md border-t border-slate-800 py-1 px-2 flex items-center justify-around sm:hidden shadow-2xl">
        <button
          onClick={() => handleSelectTab('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            currentTab === 'home' ? 'text-[#D4AF37] font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">課程首頁</span>
        </button>

        <button
          onClick={() => handleSelectTab('register')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            currentTab === 'register' ? 'text-[#D4AF37] font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">立即報名</span>
        </button>

        <button
          onClick={() => handleSelectTab('student')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            currentTab === 'student' ? 'text-[#D4AF37] font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">查進度</span>
        </button>

        <button
          onClick={() => handleSelectTab('admin')}
          className={`relative flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            currentTab === 'admin' ? 'text-[#D4AF37] font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">教務後台</span>
          {pendingCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setIsWechatModalOpen(true)}
          className="flex flex-col items-center py-1 px-2 rounded-lg text-[#D4AF37] hover:text-white transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">諮詢</span>
        </button>
      </nav>

      {/* WeChat Consultation Modal */}
      <WeChatContactModal
        isOpen={isWechatModalOpen}
        onClose={() => setIsWechatModalOpen(false)}
      />

    </div>
    </LangProvider>
  );
}
