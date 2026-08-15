import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  ChevronRight, 
  X, 
  Send, 
  Edit, 
  RotateCcw, 
  FileSpreadsheet,
  Building,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  Info,
  Award,
  Eye,
  EyeOff,
  UserCog
} from 'lucide-react';
import { Candidate, CourseBatch, FollowUpNote, EnrollmentStatus, CourseType, StaffUser, StaffRole } from '../types';
import { STAFF_USERS } from '../data/staffUsers';
import { ContactTimeline } from './ContactTimeline';
import { QuickNoteModal } from './QuickNoteModal';
import { EditCandidateModal } from './EditCandidateModal';
import { 
  getStoredCandidates, 
  saveCandidates, 
  updateCandidateStatus, 
  updateCandidateEducation,
  addFollowUpNote, 
  getStoredBatches, 
  addBatch,
  resetToDemoData 
} from '../services/storageService';

interface StaffAdminViewProps {
  candidates: Candidate[];
  batches: CourseBatch[];
  onRefreshData: () => void;
}

export const StaffAdminView: React.FC<StaffAdminViewProps> = ({
  candidates,
  batches,
  onRefreshData,
}) => {
  // Staff User / RBAC State (Default to Super Admin, easily switchable)
  const [currentStaff, setCurrentStaff] = useState<StaffUser>(STAFF_USERS[0]);
  const [isRoleMatrixOpen, setIsRoleMatrixOpen] = useState(false);

  // Navigation inside Admin: 'crm' | 'batches' | 'analytics'
  const [adminTab, setAdminTab] = useState<'crm' | 'batches' | 'analytics'>('crm');

  // Search & Filter
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | 'all'>('all');
  const [courseFilter, setCourseFilter] = useState<CourseType | 'all'>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  // Selected Candidate for Drawer Modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  // Candidate for Quick Note modal popup from table
  const [quickNoteCandidate, setQuickNoteCandidate] = useState<Candidate | null>(null);
  // Education inline editor state (null = not editing)
  const [editingEducation, setEditingEducation] = useState<string | null>(null);
  // Full profile edit modal state
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);

  // New Note state
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteAuthor, setNewNoteAuthor] = useState(currentStaff.name);
  const [newNoteType, setNewNoteType] = useState<FollowUpNote['type']>('wechat');

  // Batch creation modal state
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [newBatchTitle, setNewBatchTitle] = useState('');
  const [newBatchType, setNewBatchType] = useState<CourseType>('qas_core');
  const [newBatchLocation, setNewBatchLocation] = useState('深圳福田口岸培訓中心 · 綜合實訓室');
  const [newBatchStartDate, setNewBatchStartDate] = useState('2026-09-05');
  const [newBatchEndDate, setNewBatchEndDate] = useState('2026-09-06');
  const [newBatchTime, setNewBatchTime] = useState('週六日 09:00 - 19:30');
  const [newBatchInstructor, setNewBatchInstructor] = useState('陳Sir (註冊 QAS 首席導師)');
  const [newBatchCapacity, setNewBatchCapacity] = useState(30);
  const [newBatchPrice, setNewBatchPrice] = useState('HK$ 2,680 / ¥2,450');

  // Filter candidates based on Role permissions and search queries
  const visibleCandidates = candidates.filter((c) => {
    // If Instructor role: only see enrolled or completed candidates assigned to classes
    if (!currentStaff.permissions.canViewAllCandidates) {
      const isEnrolledOrCompleted = c.status === 'enrolled' || c.status === 'completed';
      if (!isEnrolledOrCompleted) return false;
    }
    return true;
  });

  const filteredCandidates = visibleCandidates.filter((c) => {
    // keyword
    const matchKeyword = 
      !searchKeyword ||
      c.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      c.phone.includes(searchKeyword) ||
      c.wechatId.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      c.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      c.residenceCity.includes(searchKeyword);

    // status
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;

    // course
    const matchCourse = courseFilter === 'all' || c.targetCourse === courseFilter;

    // city
    const matchCity = cityFilter === 'all' || c.residenceCity.includes(cityFilter);

    return matchKeyword && matchStatus && matchCourse && matchCity;
  });

  // Calculate Metrics
  const totalCount = visibleCandidates.length;
  const pendingCount = visibleCandidates.filter(c => c.status === 'pending').length;
  const contactedCount = visibleCandidates.filter(c => c.status === 'contacted').length;
  const enrolledCount = visibleCandidates.filter(c => c.status === 'enrolled' || c.status === 'completed').length;
  const conversionRate = totalCount > 0 ? Math.round((enrolledCount / totalCount) * 100) : 0;
  
  // Workshop leads calculation ($1200 / person)
  const workshopLeads = visibleCandidates.filter(c => c.targetCourse === 'workshop_2day' || c.targetCourse === 'full_bundle').length;
  const estimatedWorkshopRevenueHKD = workshopLeads * 1200;

  // Cantonese high rating ratio
  const highCantoneseCount = visibleCandidates.filter(c => c.languages.cantonese >= 4).length;
  const highCantonesePercent = totalCount > 0 ? Math.round((highCantoneseCount / totalCount) * 100) : 0;

  // Switch Staff Account
  const handleSwitchStaff = (staff: StaffUser) => {
    setCurrentStaff(staff);
    setNewNoteAuthor(staff.name);
  };

  // Helper for masking sensitive phone numbers for Instructor role
  const formatPhone = (phone: string) => {
    if (currentStaff.permissions.isSensitiveInfoMasked) {
      if (phone.length >= 7) {
        return phone.slice(0, 3) + '****' + phone.slice(-4);
      }
      return '****';
    }
    return phone;
  };

  // Handlers
  const handleAddNoteDirect = (
    candidateId: string, 
    author: string, 
    content: string, 
    type: FollowUpNote['type'],
    authorRole?: string
  ) => {
    const authorWithRole = authorRole ? `${author} (${authorRole})` : author;
    const updated = addFollowUpNote(candidateId, authorWithRole, content.trim(), type);
    if (updated) {
      if (selectedCandidate && selectedCandidate.id === candidateId) {
        setSelectedCandidate(updated);
      }
      if (quickNoteCandidate && quickNoteCandidate.id === candidateId) {
        setQuickNoteCandidate(updated);
      }
      onRefreshData();
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || !newNoteContent.trim()) return;

    handleAddNoteDirect(
      selectedCandidate.id, 
      currentStaff.name, 
      newNoteContent.trim(), 
      newNoteType,
      currentStaff.roleTitle
    );
    setNewNoteContent('');
  };

  const handleStatusChange = (candidateId: string, newStatus: EnrollmentStatus, batchId?: string) => {
    // Permission check
    if (currentStaff.role === 'admissions' && newStatus !== 'contacted' && newStatus !== 'pending') {
      alert('【權限不足】招生顧問僅可更新為「已聯繫」或「待初審」狀態。審核錄取與排班需由「教務主管」或「系統總監」執行。');
      return;
    }
    if (currentStaff.role === 'instructor' && newStatus !== 'completed') {
      alert('【權限不足】培訓導師僅可為已在讀學員標記「已結業」。其他狀態需由教務組處理。');
      return;
    }

    const updated = updateCandidateStatus(candidateId, newStatus, batchId);
    if (updated) {
      if (selectedCandidate && selectedCandidate.id === candidateId) {
        setSelectedCandidate(updated);
      }
      onRefreshData();
    }
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStaff.permissions.canManageBatches) {
      alert('【權限不足】當前角色無權建立新開課班次。');
      return;
    }
    if (!newBatchTitle.trim()) return;

    addBatch({
      title: newBatchTitle.trim(),
      courseType: newBatchType,
      location: newBatchLocation,
      startDate: newBatchStartDate,
      endDate: newBatchEndDate,
      scheduleTime: newBatchTime,
      instructor: newBatchInstructor,
      capacity: Number(newBatchCapacity),
      priceDisplay: newBatchPrice,
    });

    setIsAddBatchOpen(false);
    onRefreshData();
  };

  const handleExportCSV = () => {
    if (!currentStaff.permissions.canExportData) {
      alert('【權限受限】您的帳號角色（' + currentStaff.roleTitle + '）未獲授權匯出學員名冊數據。如需導出請聯繫系統總監或教務主管。');
      return;
    }

    const headers = ['編號', '姓名', '性別', '年齡', '電話', '微信', '現居城市', '學歷', '意向課程', '粵語', '英語', '無犯罪證明', '港澳證', '當前狀態', '報名時間'];
    const rows = filteredCandidates.map(c => [
      c.id,
      c.fullName,
      c.gender === 'male' ? '男' : '女',
      c.age,
      c.phone,
      c.wechatId,
      c.residenceCity,
      c.education,
      c.targetCourse,
      `${c.languages.cantonese}星`,
      `${c.languages.english}星`,
      c.canProvideNoCriminalRecord ? '可提供' : '無法提供',
      c.hasTwoWayPermit ? '有' : '無',
      c.status,
      c.appliedAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `香港QAS學員名冊_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetData = () => {
    if (!currentStaff.permissions.canResetSystem) {
      alert('【權限不足】僅系統總監/總管理員具備系統重設權限。');
      return;
    }
    if (window.confirm('確定要重設為預設測試數據嗎？（將保留 6 筆代表性候選人與 4 個開課場次）')) {
      resetToDemoData();
      setSelectedCandidate(null);
      onRefreshData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in" id="staff-admin-root">
      
      {/* RBAC Staff Identity & Role Switching Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Active Staff Profile */}
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shadow-md border ${currentStaff.color}`}>
            {currentStaff.avatarLetter}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{currentStaff.name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                currentStaff.role === 'super_admin' ? 'bg-purple-950/80 text-purple-300 border-purple-800' :
                currentStaff.role === 'academic_lead' ? 'bg-blue-950/80 text-blue-300 border-blue-800' :
                currentStaff.role === 'admissions' ? 'bg-amber-950/80 text-amber-300 border-amber-800' :
                'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              }`}>
                {currentStaff.roleTitle}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>{currentStaff.department}</span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-slate-500">{currentStaff.email}</span>
            </div>
          </div>
        </div>

        {/* Quick Role Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
            <UserCog className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>切換員工職級：</span>
          </div>
          
          {STAFF_USERS.map((staff) => {
            const isActive = currentStaff.id === staff.id;
            return (
              <button
                key={staff.id}
                onClick={() => handleSwitchStaff(staff)}
                id={`staff-switch-btn-${staff.id}`}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-md shadow-[#D4AF37]/20 scale-102'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{
                  backgroundColor: staff.role === 'super_admin' ? '#a855f7' : staff.role === 'academic_lead' ? '#3b82f6' : staff.role === 'admissions' ? '#f59e0b' : '#10b981'
                }} />
                <span>{staff.name}</span>
                <span className="text-[10px] opacity-75">
                  ({staff.role === 'super_admin' ? '總監' : staff.role === 'academic_lead' ? '主管' : staff.role === 'admissions' ? '顧問' : '導師'})
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setIsRoleMatrixOpen(true)}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-[#D4AF37] border border-slate-800 transition-colors ml-1"
            title="查看職級權限矩陣"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Banner & Tab Controls */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-0.5 rounded">
                教務管理 CRM
              </span>
              <span className="text-xs text-slate-400 font-mono">廣東 ⇄ 香港 QAS 人才輸送系統</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              學員報名管理與開班排程後台
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Export CSV with Permission Guard */}
            <button
              onClick={handleExportCSV}
              id="admin-export-csv-btn"
              disabled={!currentStaff.permissions.canExportData}
              title={currentStaff.permissions.canExportData ? '匯出 CSV 名冊' : '當前角色無導出權限'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                currentStaff.permissions.canExportData
                  ? 'bg-slate-800 hover:bg-slate-700 text-white cursor-pointer border-slate-700'
                  : 'bg-slate-950 text-slate-500 border-slate-800 cursor-not-allowed opacity-60'
              }`}
            >
              {currentStaff.permissions.canExportData ? (
                <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>匯出名冊 (CSV)</span>
              {!currentStaff.permissions.canExportData && (
                <span className="text-[9px] bg-slate-800 text-slate-400 px-1 py-0.2 rounded">受限</span>
              )}
            </button>

            {/* Reset Demo Data with Permission Guard (Super Admin only) */}
            {currentStaff.permissions.canResetSystem && (
              <button
                onClick={handleResetData}
                id="admin-reset-demo-btn"
                title="重設演示數據（僅總監權限）"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4 Core Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              <span>{currentStaff.role === 'instructor' ? '班級在讀學員' : '可見生源數'}</span>
              <Users className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">{totalCount} <span className="text-xs text-slate-500 font-normal">人</span></div>
            <div className="text-[10px] text-[#D4AF37] mt-0.5">待初審：{pendingCount} 人</div>
          </div>

          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              <span>錄取轉化率</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{conversionRate}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">已入班：{enrolledCount} 人</div>
          </div>

          {/* Financials Metric with Permission Guard */}
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 relative">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              <span>分享會意向營收</span>
              <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>
            {currentStaff.permissions.canViewFinancials ? (
              <>
                <div className="text-xl font-bold text-[#D4AF37] font-mono mt-0.5">HK${estimatedWorkshopRevenueHKD.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">意向：{workshopLeads} 位 ($1200/人)</div>
              </>
            ) : (
              <div className="mt-1">
                <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
                  <Lock className="w-3 h-3 text-amber-500/80" />
                  <span className="font-bold text-slate-400">HK$ ******</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">需系統總監權限查閱</div>
              </div>
            )}
          </div>

          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
              <span>高粵語比例 (≥4星)</span>
              <Award className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-xl font-bold text-sky-400 font-mono mt-0.5">{highCantonesePercent}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">極具香港商廈競爭力</div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setAdminTab('crm')}
            id="admin-tab-crm-btn"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'crm'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            📋 報名審核與學員管理 ({visibleCandidates.length})
          </button>
          <button
            onClick={() => setAdminTab('batches')}
            id="admin-tab-batches-btn"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'batches'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            🏫 培訓與分享會排程 ({batches.length})
          </button>
        </div>
      </div>

      {/* Role Restriction Banner if Instructor */}
      {currentStaff.role === 'instructor' && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>【導師專屬視圖】已自動過濾為您所負責的已錄取/在讀班級學員，學員電話隱私已自動脫敏保護。</span>
          </div>
          <span className="text-[10px] bg-emerald-900/60 border border-emerald-700 px-2 py-0.5 rounded font-mono font-bold">
            隱私防護生效中
          </span>
        </div>
      )}

      {/* Tab 1: Candidate CRM Table & Filters */}
      {adminTab === 'crm' && (
        <div className="space-y-3.5">
          
          {/* Filter Bar */}
          <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索學員姓名、手機、微信號或城市..."
                id="admin-search-input"
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37]"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1">
              {[
                { id: 'all' as const, label: '全部' },
                { id: 'pending' as const, label: '新報名/待審', count: pendingCount },
                { id: 'contacted' as const, label: '溝通中', count: contactedCount },
                { id: 'approved' as const, label: '初審通過' },
                { id: 'enrolled' as const, label: '已錄取/在讀' },
                { id: 'completed' as const, label: '已結業' },
                { id: 'rejected' as const, label: '未通過' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  id={`admin-filter-status-${st.id}`}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    statusFilter === st.id
                      ? 'bg-[#D4AF37] text-slate-950 shadow-sm font-bold'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>{st.label}</span>
                  {st.count !== undefined && st.count > 0 && (
                    <span className="ml-1 px-1 rounded-full bg-slate-900 text-[#D4AF37] font-bold text-[9px] border border-slate-800">
                      {st.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Candidates List Table (Responsive) */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" id="admin-candidates-table">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">學員 / 編號</th>
                    <th className="py-2.5 px-3">性別 / 年齡</th>
                    <th className="py-2.5 px-3">現居地 / 學歷</th>
                    <th className="py-2.5 px-3">微信 / 手機</th>
                    <th className="py-2.5 px-3">意向課程</th>
                    <th className="py-2.5 px-3">最後跟進記錄 / 操作人</th>
                    <th className="py-2.5 px-3">狀態</th>
                    <th className="py-2.5 px-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-slate-500">
                        沒有符合條件的學員資料
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((cand) => {
                      const statusStyles = {
                        pending: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
                        contacted: 'bg-sky-950/80 text-sky-300 border-sky-800/60',
                        approved: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
                        enrolled: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60',
                        completed: 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60',
                        rejected: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
                      };

                      const statusLabels = {
                        pending: '新報名',
                        contacted: '已聯繫',
                        approved: '通過待排班',
                        enrolled: '已錄取',
                        completed: '已結業',
                        rejected: '未通過',
                      };

                      const latestNote = cand.notes && cand.notes.length > 0 ? cand.notes[0] : null;

                      return (
                        <tr 
                          key={cand.id}
                          onClick={() => setSelectedCandidate(cand)}
                          className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                        >
                          <td className="py-2.5 px-3 font-bold text-white">
                            <div>{cand.fullName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{cand.id}</div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">
                            {cand.gender === 'male' ? '男' : '女'} · {cand.age} 歲
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">
                            <div>{cand.residenceCity}</div>
                            <div className="text-[10px] text-slate-500">{cand.education}</div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">
                            <div>{formatPhone(cand.phone)}</div>
                            <div className="text-[10px] text-slate-500">微：{cand.wechatId}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-[11px] font-semibold text-slate-300">
                              {cand.targetCourse === 'full_bundle' ? '全套直通班' :
                               cand.targetCourse === 'workshop_2day' ? '2天分享會' :
                               cand.targetCourse === 'qas_core' ? '20h預前班' : '增值課包'}
                            </span>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <span>粵:{cand.languages.cantonese}★</span>
                              <span>英:{cand.languages.english}★</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            {latestNote ? (
                              <div className="space-y-0.5 max-w-[220px]">
                                <div className="flex items-center gap-1.5 text-[10px]">
                                  <span className="font-mono text-[#D4AF37]">{latestNote.createdAt.slice(5)}</span>
                                  <span className="text-slate-600">·</span>
                                  <span className="text-slate-300 font-bold bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
                                    {latestNote.author}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-300 truncate" title={latestNote.content}>
                                  {latestNote.content}
                                </p>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-600 italic">尚無跟進紀錄</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${statusStyles[cand.status]}`}>
                              {statusLabels[cand.status]}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuickNoteCandidate(cand);
                                }}
                                title="快速新增跟進備註"
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-[#D4AF37]/20 text-[#D4AF37] hover:border-[#D4AF37]/50 text-[11px] font-bold transition-all border border-slate-700 flex items-center gap-1 cursor-pointer"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>+備註</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCandidate(cand);
                                }}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-[#D4AF37] hover:text-slate-950 text-slate-300 text-[11px] font-semibold transition-colors border border-slate-700 cursor-pointer"
                              >
                                詳情 →
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Batch Management */}
      {adminTab === 'batches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">課程與分享會場次排期</h2>
              <p className="text-xs text-slate-400">管理深圳/廣州線下實訓班次與名額配額</p>
            </div>

            {/* Create Batch with RBAC check */}
            <button
              onClick={() => {
                if (!currentStaff.permissions.canManageBatches) {
                  alert('【權限不足】當前帳號無權建立新開課班次（需教務主管或總監權限）。');
                  return;
                }
                setIsAddBatchOpen(true);
              }}
              id="admin-create-batch-btn"
              disabled={!currentStaff.permissions.canManageBatches}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md transition-colors ${
                currentStaff.permissions.canManageBatches
                  ? 'bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60 border border-slate-700'
              }`}
            >
              {currentStaff.permissions.canManageBatches ? (
                <Plus className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              <span>新增場次</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {batches.map((batch) => {
              const enrolled = candidates.filter(c => c.assignedBatchId === batch.id).length;
              return (
                <div key={batch.id} className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-[#D4AF37] border border-slate-800 font-mono">
                        {batch.id}
                      </span>
                      <h3 className="font-bold text-white text-sm mt-1">{batch.title}</h3>
                    </div>
                    <span className="text-[11px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-0.5 rounded">
                      {batch.priceDisplay}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <div><strong className="text-slate-300">地點：</strong>{batch.location}</div>
                    <div><strong className="text-slate-300">時間：</strong>{batch.startDate} 至 {batch.endDate} ({batch.scheduleTime})</div>
                    <div><strong className="text-slate-300">導師：</strong>{batch.instructor}</div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>報名進度：</span>
                      <span className="font-mono text-[#D4AF37]">{enrolled} / {batch.capacity} 人</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-[#D4AF37] rounded-full"
                        style={{ width: `${Math.min(100, (enrolled / batch.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Candidate Detail Modal / Inspection Drawer */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in" id="candidate-detail-modal-overlay">
          <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-800 p-5 sm:p-6 space-y-4 text-slate-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-0.5 rounded">
                    {selectedCandidate.id}
                  </span>
                  <span className="text-[11px] text-slate-400">報名於 {selectedCandidate.appliedAt}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>{selectedCandidate.fullName}</span>
                  <span className="text-xs font-normal text-slate-400">
                    ({selectedCandidate.gender === 'male' ? '男' : '女'} · {selectedCandidate.age}歲 · {selectedCandidate.residenceCity})
                  </span>
                </h2>
              </div>

              <button
                onClick={() => setEditingCandidate(selectedCandidate)}
                className="p-1.5 rounded-lg text-[#D4AF37] hover:text-white hover:bg-slate-800 cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                title="編輯學員全部資料"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">編輯資料</span>
              </button>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Selector Bar with RBAC checks */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>更改審核狀態：</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    (當前操作人: {currentStaff.name} · {currentStaff.roleTitle})
                  </span>
                </label>
              </div>

              <div className="flex flex-wrap gap-1">
                {(['pending', 'contacted', 'approved', 'enrolled', 'completed', 'rejected'] as EnrollmentStatus[]).map((st) => {
                  // Determine if this status button is allowed for current staff role
                  let isAllowed = true;
                  if (currentStaff.role === 'admissions') {
                    // Admissions can only mark pending or contacted
                    if (st !== 'pending' && st !== 'contacted') isAllowed = false;
                  } else if (currentStaff.role === 'instructor') {
                    // Instructor can only mark completed
                    if (st !== 'completed' && st !== selectedCandidate.status) isAllowed = false;
                  }

                  return (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedCandidate.id, st)}
                      disabled={!isAllowed}
                      title={isAllowed ? `更改為 ${st}` : '需更高職級權限'}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                        selectedCandidate.status === st
                          ? 'bg-[#D4AF37] text-slate-950 shadow'
                          : isAllowed
                          ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 cursor-pointer'
                          : 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed opacity-40'
                      }`}
                    >
                      {st === 'pending' ? '新報名' : 
                       st === 'contacted' ? '已聯繫' : 
                       st === 'approved' ? '初審通過' : 
                       st === 'enrolled' ? '已錄取開班' : 
                       st === 'completed' ? '已結業' : '未通過'}
                    </button>
                  );
                })}
              </div>

              {/* Assign Batch dropdown with RBAC check */}
              <div className="pt-2 flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold shrink-0">指派場次：</span>
                {currentStaff.permissions.canAssignBatch ? (
                  <select
                    value={selectedCandidate.assignedBatchId || ''}
                    onChange={(e) => handleStatusChange(selectedCandidate.id, selectedCandidate.status, e.target.value || undefined)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-200"
                  >
                    <option value="">暫未分配班次</option>
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>{b.title} ({b.startDate})</option>
                    ))}
                  </select>
                ) : (
                  <div className="text-xs text-slate-500 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 flex-1">
                    {selectedCandidate.assignedBatchId ? (
                      batches.find(b => b.id === selectedCandidate.assignedBatchId)?.title || selectedCandidate.assignedBatchId
                    ) : '暫未指派 (需教務主管以上權限)'}
                  </div>
                )}
              </div>
            </div>

            {/* Candidate Full Profile Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-500">聯絡電話</div>
                <div className="font-bold text-white font-mono mt-0.5">{formatPhone(selectedCandidate.phone)}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-500">微信號</div>
                <div className="font-bold text-white font-mono mt-0.5">{selectedCandidate.wechatId}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-500">最高學歷</div>
                <div className="font-bold text-white mt-0.5">{selectedCandidate.education}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-500">港澳通行證</div>
                <div className="font-bold text-white mt-0.5">{selectedCandidate.hasTwoWayPermit ? '曾持有 / 現有' : '未辦理'}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-500">無犯罪記錄證明</div>
                <div className="font-bold text-emerald-400 mt-0.5">{selectedCandidate.canProvideNoCriminalRecord ? '✓ 可開具' : '✗ 存疑'}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-500">夜班 / 12h接受度</div>
                <div className="font-bold text-white mt-0.5">
                  {selectedCandidate.shiftAcceptance === 'high' ? '完全接受' : selectedCandidate.shiftAcceptance === 'medium' ? '中等' : '低'}
                </div>
              </div>
            </div>

            {/* Language ratings */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-[#D4AF37]">語言自評得分：</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>粵語能力：<strong className="text-[#D4AF37]">{selectedCandidate.languages.cantonese} / 5 星</strong></div>
                <div>英語口語：<strong className="text-slate-200">{selectedCandidate.languages.english} / 5 星</strong></div>
                <div>普通話：<strong className="text-slate-200">{selectedCandidate.languages.mandarin} / 5 星</strong></div>
              </div>
            </div>

            {/* Work experience */}
            <div className="space-y-1 text-xs">
              <div className="font-bold text-slate-300">過往經驗與背景描述：</div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                {selectedCandidate.workExperience}
              </div>
            </div>

            {/* Contact Timeline Section */}
            <div className="pt-2">
              <ContactTimeline
                candidate={selectedCandidate}
                currentStaff={currentStaff}
                onAddNote={handleAddNoteDirect}
              />
            </div>

            {/* Footer close */}
            <div className="border-t border-slate-800 pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                關閉詳情
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Note Modal */}
      {quickNoteCandidate && (
        <QuickNoteModal
          candidate={quickNoteCandidate}
          currentStaff={currentStaff}
          isOpen={!!quickNoteCandidate}
          onClose={() => setQuickNoteCandidate(null)}
          onAddNote={handleAddNoteDirect}
        />
      )}

      {/* Edit Candidate Profile Modal */}
      {editingCandidate && (
        <EditCandidateModal
          candidate={editingCandidate}
          currentStaff={currentStaff}
          onClose={() => setEditingCandidate(null)}
          onSaved={(updated) => {
            setSelectedCandidate(updated);
            setEditingCandidate(null);
            onRefreshData();
          }}
        />
      )}

      {/* Add New Batch Modal */}
      {isAddBatchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in" id="add-batch-modal-overlay">
          <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 border border-slate-800 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-white">新增培訓 / 分享會場次</h3>
              <button onClick={() => setIsAddBatchOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">場次名稱</label>
                <input
                  type="text"
                  value={newBatchTitle}
                  onChange={(e) => setNewBatchTitle(e.target.value)}
                  placeholder="例如：第 25 期 QAS 廣州集中培訓班"
                  required
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">課程類型</label>
                  <select
                    value={newBatchType}
                    onChange={(e) => setNewBatchType(e.target.value as CourseType)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  >
                    <option value="workshop_2day">2天赴港分享會 (含20h QAS · ¥1,200)</option>
                    <option value="value_pack">簽證等待期增值課包 (¥1,500)</option>
                    <option value="full_bundle">全套赴港直通班 (¥2,400)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">名額上限</label>
                  <input
                    type="number"
                    value={newBatchCapacity}
                    onChange={(e) => setNewBatchCapacity(Number(e.target.value))}
                    min="5"
                    max="100"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">培訓地點</label>
                <input
                  type="text"
                  value={newBatchLocation}
                  onChange={(e) => setNewBatchLocation(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">開課日期</label>
                  <input
                    type="date"
                    value={newBatchStartDate}
                    onChange={(e) => setNewBatchStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">結課日期</label>
                  <input
                    type="date"
                    value={newBatchEndDate}
                    onChange={(e) => setNewBatchEndDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">主講導師</label>
                  <input
                    type="text"
                    value={newBatchInstructor}
                    onChange={(e) => setNewBatchInstructor(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">學費標價</label>
                  <input
                    type="text"
                    value={newBatchPrice}
                    onChange={(e) => setNewBatchPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBatchOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 font-bold cursor-pointer"
                >
                  確認建立場次
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role & Permissions Matrix Modal */}
      {isRoleMatrixOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" id="role-matrix-modal">
          <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full p-5 sm:p-6 space-y-4 border border-slate-800 text-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-base font-bold text-white">員工職級與權限分配矩陣 (RBAC)</h3>
              </div>
              <button onClick={() => setIsRoleMatrixOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-400 leading-relaxed">
              系統依據教務與招生管理職能，嚴格劃分 4 種不同級別的權限，防止生源隱私洩露與誤操作：
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">權限功能模組</th>
                    <th className="py-2.5 px-3 text-purple-300">總監 / 總管理員</th>
                    <th className="py-2.5 px-3 text-blue-300">教務主管/審核官</th>
                    <th className="py-2.5 px-3 text-amber-300">招生顧問/客服</th>
                    <th className="py-2.5 px-3 text-emerald-300">培訓導師/教練</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">💰 財務營收與商業指標</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ 完全查閱</td>
                    <td className="py-2.5 px-3 text-slate-500">✗ 受限遮罩</td>
                    <td className="py-2.5 px-3 text-slate-500">✗ 受限遮罩</td>
                    <td className="py-2.5 px-3 text-slate-500">✗ 受限遮罩</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">📋 資格初審與錄取排班</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ 全部權限</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ 全部權限</td>
                    <td className="py-2.5 px-3 text-amber-400">僅限已聯繫</td>
                    <td className="py-2.5 px-3 text-emerald-400">僅限登記結業</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">🏫 新增/刪除開班排期</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ 可建立</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ 可建立</td>
                    <td className="py-2.5 px-3 text-slate-500">✗ 無權限</td>
                    <td className="py-2.5 px-3 text-slate-500">✗ 無權限</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">📥 匯出 CSV 完整名冊</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ 允許導出</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ 允許導出</td>
                    <td className="py-2.5 px-3 text-rose-400 font-semibold">✗ 嚴禁外流</td>
                    <td className="py-2.5 px-3 text-rose-400 font-semibold">✗ 嚴禁外流</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">🔒 學員手機號隱私脫敏</td>
                    <td className="py-2.5 px-3 text-slate-400">顯示完整</td>
                    <td className="py-2.5 px-3 text-slate-400">顯示完整</td>
                    <td className="py-2.5 px-3 text-slate-400">顯示完整</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ 自動遮罩 (138****5678)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">🔄 系統重設與底層管理</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ 允許重設</td>
                    <td className="py-2.5 px-3 text-slate-500">✗ 無權限</td>
                    <td className="py-2.5 px-3 text-slate-500">✗ 無權限</td>
                    <td className="py-2.5 px-3 text-slate-500">✗ 無權限</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsRoleMatrixOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-slate-950 font-bold text-xs cursor-pointer"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

