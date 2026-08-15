import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserCheck, 
  Calendar, 
  Download, 
  FileText, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  ArrowRight, 
  BookOpen, 
  HelpCircle,
  Sparkles,
  LogOut,
  ExternalLink,
  ChevronRight,
  Phone
} from 'lucide-react';
import { Candidate, CourseBatch, ResourceMaterial, QuickQuizQuestion } from '../types';
import { 
  getStoredCandidates, 
  getCurrentStudentSession, 
  setCurrentStudentSession 
} from '../services/storageService';
import { RESOURCE_MATERIALS, QUICK_QUIZ_QUESTIONS } from '../data/mockData';

interface StudentPortalViewProps {
  batches: CourseBatch[];
  onGoToRegister: () => void;
  onOpenWechat: () => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  batches,
  onGoToRegister,
  onOpenWechat,
}) => {
  const [currentStudent, setCurrentStudent] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Download simulation state
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Quick Quiz State
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const session = getCurrentStudentSession();
    if (session) {
      // sync with latest in storage
      const all = getStoredCandidates();
      const updated = all.find(c => c.id === session.id || c.phone === session.phone);
      setCurrentStudent(updated || session);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setLoginError('請輸入報名時的手機號碼或查詢編號（如 HKQAS-2026-XXXX）');
      return;
    }

    const all = getStoredCandidates();
    const match = all.find(
      c => c.phone.toLowerCase() === query || 
           c.id.toLowerCase() === query || 
           c.wechatId.toLowerCase() === query ||
           (c.email && c.email.toLowerCase() === query)
    );

    if (match) {
      setCurrentStudent(match);
      setCurrentStudentSession(match);
    } else {
      setLoginError('未找到對應的報名記錄。請確認輸入的手機號或編號，或先前往填寫報名自評表。');
    }
  };

  const handleQuickDemoLogin = (candidate: Candidate) => {
    setCurrentStudent(candidate);
    setCurrentStudentSession(candidate);
    setLoginError(null);
  };

  const handleLogout = () => {
    setCurrentStudent(null);
    setCurrentStudentSession(null);
  };

  const handleDownload = (material: ResourceMaterial) => {
    setDownloadingId(material.id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadSuccessId(material.id);
      setTimeout(() => setDownloadSuccessId(null), 3000);
    }, 1200);
  };

  // Find candidate's assigned batch info
  const assignedBatch = currentStudent?.assignedBatchId 
    ? batches.find(b => b.id === currentStudent.assignedBatchId)
    : null;

  // Status mapping
  const statusConfig = {
    pending: {
      label: '報名已提交 · 初審中',
      color: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
      badge: '待初審',
      step: 1,
      tip: '教務老師已收到您的自評資料，正進行資格評估與崗位比對，將於 24 小時內通過微信聯繫您。',
    },
    contacted: {
      label: '已微信/電話聯繫 · 溝通評估中',
      color: 'bg-sky-950/80 text-sky-300 border-sky-800/60',
      badge: '溝通中',
      step: 2,
      tip: '教務顧問已與您初步溝通，請配合提供無犯罪證明或準備參加 2 天就業文化分享會。',
    },
    approved: {
      label: '資格初審通過 · 待確認排班',
      color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
      badge: '已通過初審',
      step: 3,
      tip: '恭喜！您的各項條件符合香港保安及物管標準，教務處正為您鎖定培訓席位。',
    },
    enrolled: {
      label: '已正式錄取 · 進入培訓期',
      color: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60',
      badge: '開課中 / 已排班',
      step: 4,
      tip: '您已正式進入本期培訓班！請務必查閱下方上課安排與下載課前預習資料。',
    },
    completed: {
      label: '已順利結業 · 進入簽證期/待赴港',
      color: 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60',
      badge: '已結業',
      step: 5,
      tip: '您已完成 20 小時 QAS 預前課程並通過評核，現可每日在線強化英語 100 句等待赴港安排。',
    },
    rejected: {
      label: '未能符合持牌硬性條件',
      color: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
      badge: '未通過',
      step: 0,
      tip: '因無犯罪記錄或體檢限制未能滿足香港保安局規定，詳情可諮詢教務老師。',
    }
  };

  const currentStatusInfo = currentStudent ? statusConfig[currentStudent.status] : statusConfig.pending;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in" id="student-portal-root">
      
      {/* If not logged in, show Login / Search Screen */}
      {!currentStudent ? (
        <div className="max-w-lg mx-auto space-y-5">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
              <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>學員服務通道</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              報名狀態查詢與課前資料下載
            </h1>
            <p className="text-xs text-slate-400">
              輸入報名時的手機號碼或查詢編號，即時查看審核進度與最新課表
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-5">
            {/* Strict Privacy Badge */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-white">隱私與資料安全保障</span>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  本系統已啟用學員隱私安全隔離。輸入您的手機號碼或專屬查詢編號登入後，系統將<strong>僅展示您個人的報名審核進度、分班課表與培訓資料</strong>，他人無法查閱您的個人資料。
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  您的報名手機號碼 / 查詢編號
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="輸入報名手機號 (如 13823456789) 或 HKQAS-2026-XXXX"
                    id="student-search-input"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37] font-mono"
                  />
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <button
                type="submit"
                id="student-login-submit-btn"
                className="w-full py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 font-bold text-xs shadow-md shadow-[#D4AF37]/15 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>安全登入並查看我的進度</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Demo Accounts for fast testing (Clear Demo Notice) */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>測試演示賬號（點擊可快速載入該學員的專屬資料）</span>
                <span className="text-[#D4AF37] font-normal">快速體驗</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {getStoredCandidates().slice(0, 4).map((cand) => (
                  <button
                    key={cand.id}
                    onClick={() => handleQuickDemoLogin(cand)}
                    id={`demo-login-${cand.id}`}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-colors flex items-center justify-between text-xs cursor-pointer group"
                  >
                    <div>
                      <div className="font-bold text-slate-200 group-hover:text-[#D4AF37]">
                        {cand.fullName} ({cand.residenceCity})
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{cand.phone}</div>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {cand.status === 'enrolled' ? '已排班' : cand.status === 'approved' ? '已通過' : '審核中'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* If not registered yet */}
            <div className="pt-1 text-center">
              <p className="text-xs text-slate-400">
                還沒有提交報名？{' '}
                <button
                  onClick={onGoToRegister}
                  className="font-bold text-[#D4AF37] hover:underline underline-offset-2 cursor-pointer"
                >
                  點此前往填寫報名自評表
                </button>
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Logged In Student Workspace */
        <div className="space-y-6 animate-fade-in" id="student-active-dashboard">
          
          {/* Top Welcome & Status Bar */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-0.5 rounded">
                    學員檔案 #{currentStudent.id}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    報名時間：{currentStudent.appliedAt}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span>{currentStudent.fullName}</span>
                  <span className="text-xs font-normal text-slate-400">
                    ({currentStudent.gender === 'male' ? '男' : '女'} · {currentStudent.age}歲 · {currentStudent.residenceCity})
                  </span>
                </h1>
              </div>

              <button
                onClick={handleLogout}
                id="student-logout-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>切換/退出</span>
              </button>
            </div>

            {/* Current Status Tracker Banner */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">當前進度狀態：</span>
                  <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2.5 py-0.5 rounded">
                    {currentStatusInfo.label}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  意向課程：<strong className="text-slate-200">
                    {currentStudent.targetCourse === 'full_bundle' ? '全套赴港直通班' : 
                     currentStudent.targetCourse === 'qas_core' ? '20h QAS 預前培訓班' : 
                     currentStudent.targetCourse === 'workshop_2day' ? '2天赴港分享會 (¥1,200 含20h QAS)' : '增值賦能課包'}
                  </strong>
                </span>
              </div>

              {/* Progress Steps Timeline */}
              <div className="grid grid-cols-5 gap-2 pt-1">
                {[
                  { step: 1, label: '資料提交' },
                  { step: 2, label: '微信聯繫' },
                  { step: 3, label: '初審通過' },
                  { step: 4, label: '安排開課' },
                  { step: 5, label: '結業赴港' },
                ].map((s) => {
                  const isDone = currentStatusInfo.step >= s.step;
                  const isCurrent = currentStatusInfo.step === s.step;
                  return (
                    <div key={s.step} className="text-center space-y-1">
                      <div className={`h-1.5 rounded-full transition-all ${
                        isDone ? 'bg-[#D4AF37]' : 'bg-slate-800'
                      }`} />
                      <div className={`text-[10px] font-semibold ${
                        isCurrent ? 'text-[#D4AF37] font-bold' : isDone ? 'text-white' : 'text-slate-500'
                      }`}>
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-900 rounded-lg p-2.5 text-xs text-[#D4AF37] flex items-start gap-2 border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{currentStatusInfo.tip}</span>
              </div>
            </div>
          </div>

          {/* 2-Column Section: Schedule & Advisor Contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Left Col (2 cols): Course Schedule & Batch info */}
            <div className="md:col-span-2 space-y-5">
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <span>課程安排與開班通知</span>
                  </h3>
                  {assignedBatch ? (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
                      已分配班次
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 font-semibold px-2 py-0.5 rounded">
                      待教務排班
                    </span>
                  )}
                </div>

                {assignedBatch ? (
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2.5">
                    <div className="text-sm font-bold text-white">{assignedBatch.title}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      <div>
                        <span className="text-slate-500">開課時間：</span>
                        <strong className="text-white font-mono ml-1">
                          {assignedBatch.startDate} 至 {assignedBatch.endDate}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500">課堂時段：</span>
                        <strong className="text-white ml-1">{assignedBatch.scheduleTime}</strong>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500">培訓地點：</span>
                        <strong className="text-white ml-1">{assignedBatch.location}</strong>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500">主講導師：</span>
                        <strong className="text-[#D4AF37] ml-1">{assignedBatch.instructor}</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-0.5">
                      <p className="font-semibold text-slate-300">報到須知：</p>
                      <p>1. 請攜帶身份證原件及港澳通行證（若有）；</p>
                      <p>2. 上課請著休閒整潔服裝，我們將現場提供預前學習手冊與筆記本；</p>
                      <p>3. 支援線上騰訊會議同步直播（適用於無法到場學員）。</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5 space-y-2 bg-slate-950 rounded-xl border border-dashed border-slate-800">
                    <Clock className="w-7 h-7 text-[#D4AF37] mx-auto" />
                    <div className="text-xs font-bold text-slate-200">正在為您匹配最優培訓期數</div>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      教務老師正根據您的居住地（{currentStudent.residenceCity}）為您協調深圳/廣州最近的開班場次。
                    </p>
                    <button
                      onClick={onOpenWechat}
                      className="mt-1 text-xs font-bold text-[#D4AF37] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>聯繫教務優先鎖定週末班席位</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Downloadable Materials Section */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span>課前必備資料下載專區</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">學員專屬資料庫 · 點擊即可即時下載預習</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {RESOURCE_MATERIALS.map((res) => {
                    const isDownloading = downloadingId === res.id;
                    const isSuccess = downloadSuccessId === res.id;
                    return (
                      <div
                        key={res.id}
                        className="bg-slate-950 hover:bg-slate-800/60 rounded-xl p-3.5 border border-slate-800 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[#D4AF37]">
                              {res.fileType}
                            </span>
                            <h4 className="text-xs font-bold text-white">{res.title}</h4>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{res.description}</p>
                          <div className="text-[9px] text-slate-500">
                            檔案大小：{res.fileSize} · 更新日期：{res.updatedAt}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownload(res)}
                          id={`download-material-${res.id}`}
                          className={`w-full sm:w-auto px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                            isSuccess
                              ? 'bg-emerald-700 text-white'
                              : isDownloading
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-slate-900 hover:bg-[#D4AF37] hover:text-slate-950 text-slate-200 border border-slate-800 shadow-sm'
                          }`}
                        >
                          {isSuccess ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>下載成功</span>
                            </>
                          ) : isDownloading ? (
                            <span>下載準備中...</span>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>下載預習資料</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Col (1 col): Advisor Card & Interactive 5-Question Quiz */}
            <div className="space-y-5">
              {/* Assigned Advisor Card */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                    教務
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">專屬教務跟進顧問</div>
                    <div className="text-sm font-bold text-white">張老師 (大灣區教務組)</div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1 text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">微信諮詢號：</span>
                    <strong className="text-white font-mono font-bold">HK-QAS-TEACHER</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">直通電話：</span>
                    <strong className="text-white font-mono">+86 138-0020-8888</strong>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                    隨時解答 QAS 考試手續、無犯罪證明及港澳通行證辦理疑問。
                  </div>
                </div>

                <button
                  onClick={onOpenWechat}
                  className="w-full py-2 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>添加教務老師微信</span>
                </button>
              </div>

              {/* Quick QAS Knowledge Practice Quiz */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <h4 className="text-[11px] font-bold uppercase text-[#D4AF37] tracking-wider">
                      QAS 每日必考 5 題自測
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    第 {activeQuizIndex + 1} / {QUICK_QUIZ_QUESTIONS.length} 題
                  </span>
                </div>

                {(() => {
                  const q = QUICK_QUIZ_QUESTIONS[activeQuizIndex];
                  const selected = selectedAnswers[q.id];
                  const isAnswered = selected !== undefined;
                  const isCorrect = selected === q.correctIndex;

                  return (
                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-slate-200 leading-snug">
                        {q.question}
                      </div>

                      <div className="space-y-1">
                        {q.options.map((opt, oIdx) => {
                          let optStyle = 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300';
                          if (isAnswered) {
                            if (oIdx === q.correctIndex) {
                              optStyle = 'bg-emerald-950/80 border-emerald-700 text-emerald-300 font-bold';
                            } else if (selected === oIdx) {
                              optStyle = 'bg-rose-950/80 border-rose-700 text-rose-300';
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                if (!isAnswered) {
                                  setSelectedAnswers(prev => ({ ...prev, [q.id]: oIdx }));
                                  setShowExplanation(prev => ({ ...prev, [q.id]: true }));
                                }
                              }}
                              disabled={isAnswered}
                              id={`quiz-q${q.id}-opt${oIdx}`}
                              className={`w-full p-2 text-left rounded-lg border text-[11px] transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {isAnswered && oIdx === q.correctIndex && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {showExplanation[q.id] && (
                        <div className="bg-slate-950 rounded-lg p-2.5 text-[11px] text-slate-300 border border-slate-800 space-y-1 animate-fade-in">
                          <div className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isCorrect ? '✓ 回答正確！' : '✗ 答錯了，請記住考點：'}
                          </div>
                          <p>{q.explanation}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => setActiveQuizIndex(prev => Math.max(0, prev - 1))}
                          disabled={activeQuizIndex === 0}
                          className="text-[11px] text-slate-500 hover:text-slate-300 disabled:opacity-40 cursor-pointer"
                        >
                          ← 上一題
                        </button>
                        <button
                          onClick={() => setActiveQuizIndex(prev => Math.min(QUICK_QUIZ_QUESTIONS.length - 1, prev + 1))}
                          disabled={activeQuizIndex === QUICK_QUIZ_QUESTIONS.length - 1}
                          className="text-[11px] font-bold text-[#D4AF37] hover:underline disabled:opacity-40 cursor-pointer"
                        >
                          下一題 →
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
