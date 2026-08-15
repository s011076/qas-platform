import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Upload, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  AlertCircle,
  HelpCircle,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Candidate, CourseType } from '../types';
import { addCandidate, setCurrentStudentSession } from '../services/storageService';

interface RegistrationViewProps {
  initialCourseType?: CourseType;
  onGoToStudent: () => void;
  onOpenWechat: () => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  initialCourseType = 'full_bundle',
  onGoToStudent,
  onOpenWechat,
}) => {
  // Form fields state
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number | ''>(28);
  const [phone, setPhone] = useState('');
  const [wechatId, setWechatId] = useState('');
  const [email, setEmail] = useState('');
  const [residenceCity, setResidenceCity] = useState('廣州');
  const [education, setEducation] = useState('大專');
  const [workExperience, setWorkExperience] = useState('');
  
  // Languages 0-5
  const [cantonese, setCantonese] = useState(4);
  const [english, setEnglish] = useState(2);
  const [mandarin, setMandarin] = useState(5);

  // Qualifications
  const [healthStatus, setHealthStatus] = useState<'excellent' | 'good' | 'fair'>('excellent');
  const [hasTwoWayPermit, setHasTwoWayPermit] = useState<boolean>(true);
  const [canProvideNoCriminalRecord, setCanProvideNoCriminalRecord] = useState<boolean>(true);
  const [shiftAcceptance, setShiftAcceptance] = useState<'high' | 'medium' | 'low'>('high');
  const [targetCourse, setTargetCourse] = useState<CourseType>(initialCourseType);

  // Resume File
  const [resumeFile, setResumeFile] = useState<{ name: string; size: string } | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCandidate, setSubmittedCandidate] = useState<Candidate | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Handle File Upload Simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setResumeFile({
        name: file.name,
        size: `${sizeMb} MB`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic Validation
    if (!fullName.trim()) {
      setFormError('請填寫學員姓名');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setFormError('請填寫有效的手機號碼（大陸或香港均可）');
      return;
    }
    if (!wechatId.trim()) {
      setFormError('請填寫微信號以便教務老師聯繫');
      return;
    }
    if (!age || age < 18 || age > 65) {
      setFormError('年齡請填寫在 18 至 65 歲之間');
      return;
    }

    setIsSubmitting(true);

    try {
      const newCandidate = addCandidate({
        fullName: fullName.trim(),
        gender,
        age: Number(age),
        phone: phone.trim(),
        wechatId: wechatId.trim(),
        email: email.trim() || undefined,
        residenceCity,
        education,
        workExperience: workExperience.trim() || '物管/安保意向人才',
        languages: {
          cantonese,
          english,
          mandarin,
        },
        healthStatus,
        hasTwoWayPermit,
        canProvideNoCriminalRecord,
        shiftAcceptance,
        targetCourse,
        resumeFileName: resumeFile?.name,
        resumeFileSize: resumeFile?.size,
      });

      // Also set the current session so the user can immediately view progress
      setCurrentStudentSession(newCandidate);
      setSubmittedCandidate(newCandidate);
    } catch (err) {
      console.error(err);
      setFormError('報名提交失敗，請重試或直接加教務微信聯繫');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (!submittedCandidate) return;
    navigator.clipboard.writeText(submittedCandidate.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  // If successfully submitted, show success state
  if (submittedCandidate) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in" id="registration-success-screen">
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded uppercase">
              報名資料已成功送達教務處
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              報名成功！我們會盡快聯繫你
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              教務顧問將在 24 小時內通過微信或電話與您對接，為您發送培訓資料與初審結果。
            </p>
          </div>

          {/* Tracking ID card */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-left space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">專屬報名查詢編號</span>
              <span className="text-[10px] text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 font-semibold px-2 py-0.5 rounded">
                初審中 (Pending)
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="font-mono text-base sm:text-lg font-bold text-[#D4AF37]">
                {submittedCandidate.id}
              </span>
              <button
                onClick={handleCopyId}
                id="copy-tracking-id-btn"
                className="flex items-center gap-1 text-xs font-bold bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId ? '已複製' : '複製編號'}</span>
              </button>
            </div>
            <div className="text-[11px] text-slate-400 space-y-1 pt-1">
              <p>• 學員姓名：<strong className="text-white">{submittedCandidate.fullName}</strong> ({submittedCandidate.phone})</p>
              <p>• 意向課程：<strong className="text-[#D4AF37]">
                {submittedCandidate.targetCourse === 'full_bundle' ? '全套赴港直通班' : 
                 submittedCandidate.targetCourse === 'qas_core' ? '20h QAS 預前培訓班' : 
                 submittedCandidate.targetCourse === 'workshop_2day' ? '2天赴港分享會 (¥1,200 含20h QAS)' : '增值賦能課包'}
              </strong></p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
            <button
              onClick={onGoToStudent}
              id="success-go-student-portal-btn"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-[#D4AF37]/15 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>進入「學員查進度」下載資料</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenWechat}
              id="success-contact-wechat-btn"
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-700"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>加微信優先審核</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 animate-fade-in" id="registration-form-root">
      {/* Form Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>免費資格預審 · 24 小時快速反饋</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold text-white">
          QAS 預前培訓班 · 赴港人才報名自評表
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          請如實填寫您的個人基本資料與語言水平，我們的香港教務團隊將為您評估最適合的崗位與培訓期數。
        </p>
      </div>

      {formError && (
        <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Notice Banner */}
      <div className="bg-slate-950 border border-[#D4AF37]/30 rounded-xl p-3.5 mb-6 text-xs text-slate-300 flex items-start gap-2.5 shadow-sm">
        <AlertCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-white">
            重要說明：報名「2 天赴港就業分享會 (¥1,200 人民幣)」即已直接包含「20 小時 QAS 預前培訓班」
          </p>
          <p className="text-slate-400 text-[11px]">
            一次繳費享受雙重賦能（香港職場文化與薪資解析 + 20h 完整法定 QAS 預前培訓），名額有限。
          </p>
        </div>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 rounded-2xl p-5 sm:p-8 border border-slate-800 shadow-xl space-y-6" id="qas-intake-form">
        
        {/* Step 1: Target Course */}
        <div className="space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="w-4 h-4 rounded bg-[#D4AF37] text-slate-950 text-[10px] font-bold flex items-center justify-center">1</span>
            <span>選擇意向報名課程</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              {
                id: 'workshop_2day' as CourseType,
                title: '2 天赴港就業分享會 (¥1,200)',
                sub: '【已全含 20h QAS 預前培訓班】+ 香港職場文化 + 1 對 1 評估 (免再報 QAS 單獨班)',
                tag: '赴港必報 · 全包含',
                price: '¥1,200 人民幣',
              },
              {
                id: 'value_pack' as CourseType,
                title: '簽證等待期增值賦能課包',
                sub: '活用 4-6 個月辦證期：英語 100 句 + 行業術語 + 每日 1 對 1 微信糾音',
                tag: '等待期高薪利器',
                price: '¥1,500 人民幣',
              },
              {
                id: 'full_bundle' as CourseType,
                title: '全套赴港直通套裝 (全能版)',
                sub: '2天分享會 (含20h QAS) + 4-6個月增值課包 (一次搞定全部培訓)',
                tag: '立省 ¥300 特惠',
                price: '¥2,400 人民幣',
              },
            ].map((course) => {
              const isSelected = targetCourse === course.id;
              return (
                <div
                  key={course.id}
                  onClick={() => setTargetCourse(course.id)}
                  id={`select-course-${course.id}`}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-md ring-1 ring-[#D4AF37]/30'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#D4AF37]' : 'text-white'}`}>{course.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        isSelected ? 'bg-[#D4AF37] text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>
                        {course.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight">{course.sub}</p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#D4AF37]">{course.price}</span>
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-[#D4AF37]' : 'text-slate-500'}`}>
                      {isSelected ? '● 已選擇' : '○ 點選'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Personal Information */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="w-4 h-4 rounded bg-[#D4AF37] text-slate-950 text-[10px] font-bold flex items-center justify-center">2</span>
            <span>個人基本資料</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                姓名 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="例如：陳大明"
                id="input-full-name"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                性別 <span className="text-rose-400">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                id="select-gender"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="male">男 (Male)</option>
                <option value="female">女 (Female)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                年齡 <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="18"
                max="65"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                placeholder="例如：28"
                id="input-age"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                微信號 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={wechatId}
                onChange={(e) => setWechatId(e.target.value)}
                placeholder="微信號（教務聯繫發資料）"
                id="input-wechat-id"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                聯絡手機號碼 <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="11位大陸手機或香港號碼"
                id="input-phone"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                現居城市 <span className="text-rose-400">*</span>
              </label>
              <select
                value={residenceCity}
                onChange={(e) => setResidenceCity(e.target.value)}
                id="select-city"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="廣州">廣州</option>
                <option value="深圳">深圳</option>
                <option value="佛山">佛山</option>
                <option value="東莞">東莞</option>
                <option value="珠海">珠海</option>
                <option value="中山">中山</option>
                <option value="惠州">惠州</option>
                <option value="江門">江門</option>
                <option value="肇慶">肇慶</option>
                <option value="廣東其他城市">廣東其他城市</option>
                <option value="非廣東省份">其他省份</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                最高學歷
              </label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                id="select-education"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="初中">初中</option>
                <option value="高中 / 中專">高中 / 中專</option>
                <option value="大專">大專</option>
                <option value="本科及以上">本科及以上</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                電子郵件 (選填)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="例如：name@example.com"
                id="input-email"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              過往工作經驗 / 特殊資質描述
            </label>
            <textarea
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
              rows={2}
              placeholder="例如：3年物業管家、退伍軍人、有消防設施操作員證、酒店客房部等"
              id="input-work-experience"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Step 3: Language Self Assessment (0-5) */}
        <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#D4AF37] text-slate-950 text-[10px] font-bold flex items-center justify-center">3</span>
              <span>語言能力自評 (0 - 5 級)</span>
            </h3>
            <span className="text-[10px] text-slate-400">真實評估有助於精準推薦薪級</span>
          </div>

          <div className="space-y-3">
            {/* Cantonese */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-white">粵語 (廣東話聽/說)</span>
                <span className="text-[10px] text-slate-400 ml-2">
                  {cantonese === 5 ? '母語/極其流利 (可直接應聘所有崗位)' :
                   cantonese >= 3 ? '可聽懂日常、簡單口語溝通' : '基礎或完全不會 (建議提前強化)'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setCantonese(lvl)}
                    id={`btn-cantonese-${lvl}`}
                    className={`w-7 h-7 rounded text-xs font-bold transition-all cursor-pointer ${
                      cantonese === lvl 
                        ? 'bg-[#D4AF37] text-slate-950 shadow-sm' 
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* English */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-white">英語 (日常會話與簡單問候)</span>
                <span className="text-[10px] text-slate-400 ml-2">
                  {english >= 4 ? '流利會話 (可直接應聘中環甲級商廈 $22k+)' :
                   english >= 2 ? '簡單單詞與問候 (可通過等待期增值課強化)' : '零基礎 (先從 100 句基礎學起)'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setEnglish(lvl)}
                    id={`btn-english-${lvl}`}
                    className={`w-7 h-7 rounded text-xs font-bold transition-all cursor-pointer ${
                      english === lvl 
                        ? 'bg-[#D4AF37] text-slate-950 shadow-sm' 
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Mandarin */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-white">普通話 (國語)</span>
                <span className="text-[10px] text-slate-400 ml-2">
                  {mandarin >= 4 ? '標準流利' : '一般溝通'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setMandarin(lvl)}
                    id={`btn-mandarin-${lvl}`}
                    className={`w-7 h-7 rounded text-xs font-bold transition-all cursor-pointer ${
                      mandarin === lvl 
                        ? 'bg-[#D4AF37] text-slate-950 shadow-sm' 
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Compliance & Key Conditions */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="w-4 h-4 rounded bg-[#D4AF37] text-slate-950 text-[10px] font-bold flex items-center justify-center">4</span>
            <span>合規條件與工作意向確認</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Two way permit */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <label className="block text-[11px] font-semibold text-white">
                是否曾持有「往來港澳通行證」？
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="twoWayPermit"
                    checked={hasTwoWayPermit === true}
                    onChange={() => setHasTwoWayPermit(true)}
                    className="accent-[#D4AF37]"
                  />
                  <span>曾持有 / 現有效</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="twoWayPermit"
                    checked={hasTwoWayPermit === false}
                    onChange={() => setHasTwoWayPermit(false)}
                    className="accent-[#D4AF37]"
                  />
                  <span>尚未辦理</span>
                </label>
              </div>
            </div>

            {/* No Criminal record */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <label className="block text-[11px] font-semibold text-white flex items-center justify-between">
                <span>是否可開具「無犯罪記錄證明」？</span>
                <span className="text-[9px] text-[#D4AF37] font-bold">持牌硬性要求</span>
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="noCriminal"
                    checked={canProvideNoCriminalRecord === true}
                    onChange={() => setCanProvideNoCriminalRecord(true)}
                    className="accent-[#D4AF37]"
                  />
                  <span>可以提供 (無犯罪)</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="noCriminal"
                    checked={canProvideNoCriminalRecord === false}
                    onChange={() => setCanProvideNoCriminalRecord(false)}
                    className="accent-[#D4AF37]"
                  />
                  <span>無法提供 / 存疑</span>
                </label>
              </div>
            </div>

            {/* Health status */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <label className="block text-[11px] font-semibold text-white">
                身體健康狀況 (血壓/視力/心率)
              </label>
              <select
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value as 'excellent' | 'good' | 'fair')}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
              >
                <option value="excellent">身體極佳 (無高血壓等慢性病，體能充沛)</option>
                <option value="good">身體良好 (正常生活工作)</option>
                <option value="fair">一般 / 需諮詢體檢標準</option>
              </select>
            </div>

            {/* Shift acceptance */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <label className="block text-[11px] font-semibold text-white">
                對香港 12 小時制 / 夜班輪班接受度
              </label>
              <select
                value={shiftAcceptance}
                onChange={(e) => setShiftAcceptance(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
              >
                <option value="high">完全接受 (積極爭取加班津貼，追求高收入)</option>
                <option value="medium">一般接受 (適應後可輪值夜班)</option>
                <option value="low">希望僅日班固定工時</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 5: Resume Upload Simulation */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="w-4 h-4 rounded bg-[#D4AF37] text-slate-950 text-[10px] font-bold flex items-center justify-center">5</span>
            <span>上傳個人簡歷 / 榮譽證書 (選填)</span>
          </h3>

          <div className="border border-dashed border-slate-700 hover:border-[#D4AF37] rounded-xl p-5 text-center bg-slate-950/60 hover:bg-[#D4AF37]/5 transition-all relative">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              id="file-upload-input"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/20">
                <Upload className="w-4 h-4" />
              </div>
              {resumeFile ? (
                <div className="text-xs">
                  <span className="font-bold text-emerald-400">已選取檔案：{resumeFile.name}</span>
                  <span className="text-slate-400 ml-2">({resumeFile.size})</span>
                  <div className="text-[10px] text-slate-500 mt-0.5">點擊可重新更換檔案</div>
                </div>
              ) : (
                <>
                  <div className="text-xs font-semibold text-slate-200">
                    點擊或拖曳上傳簡歷 (支援 PDF / Word / 相片)
                  </div>
                  <p className="text-[10px] text-slate-500">
                    若手頭暫無完整簡歷，可先跳過；提交後教務老師將發送標準香港物管履歷模板供您填寫。
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-3 border-t border-slate-800 space-y-2.5">
          <button
            type="submit"
            disabled={isSubmitting}
            id="submit-registration-btn"
            className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 font-bold text-sm shadow-lg shadow-[#D4AF37]/15 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isSubmitting ? (
              <span>提交資料中...</span>
            ) : (
              <>
                <span>確認提交報名自評（獲取免費審核與諮詢）</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-slate-500">
            🔒 我們嚴格保密您的個人資料，僅用於香港 QAS 培訓資格審核與教務跟進。
          </p>
        </div>
      </form>
    </div>
  );
};
