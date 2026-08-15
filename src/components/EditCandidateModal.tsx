import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Candidate, CourseType, StaffUser } from '../types';
import { updateCandidateFields } from '../services/storageService';

interface EditCandidateModalProps {
  candidate: Candidate;
  currentStaff: StaffUser;
  onClose: () => void;
  onSaved: (updated: Candidate) => void;
}

interface EditFormState {
  fullName: string;
  gender: 'male' | 'female';
  age: number;
  phone: string;
  wechatId: string;
  email: string;
  residenceCity: string;
  education: string;
  workExperience: string;
  languages: { cantonese: number; english: number; mandarin: number };
  healthStatus: 'excellent' | 'good' | 'fair';
  hasTwoWayPermit: boolean;
  canProvideNoCriminalRecord: boolean;
  shiftAcceptance: 'high' | 'medium' | 'low';
  targetCourse: CourseType;
}

const inputCls = "w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-[#D4AF37]";
const labelCls = "block text-[11px] font-semibold text-slate-300 mb-1";

export const EditCandidateModal: React.FC<EditCandidateModalProps> = ({
  candidate,
  currentStaff,
  onClose,
  onSaved,
}) => {
  const [form, setForm] = useState<EditFormState>({
    fullName: candidate.fullName,
    gender: candidate.gender,
    age: candidate.age,
    phone: candidate.phone,
    wechatId: candidate.wechatId,
    email: candidate.email || '',
    residenceCity: candidate.residenceCity,
    education: candidate.education,
    workExperience: candidate.workExperience,
    languages: { ...candidate.languages },
    healthStatus: candidate.healthStatus,
    hasTwoWayPermit: candidate.hasTwoWayPermit,
    canProvideNoCriminalRecord: candidate.canProvideNoCriminalRecord,
    shiftAcceptance: candidate.shiftAcceptance,
    targetCourse: candidate.targetCourse,
  });
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof EditFormState>(key: K, value: EditFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const updated = updateCandidateFields(
      candidate.id,
      {
        fullName: form.fullName.trim(),
        gender: form.gender,
        age: form.age,
        phone: form.phone.trim(),
        wechatId: form.wechatId.trim(),
        email: form.email.trim() || undefined,
        residenceCity: form.residenceCity.trim(),
        education: form.education,
        workExperience: form.workExperience.trim(),
        languages: form.languages,
        healthStatus: form.healthStatus,
        hasTwoWayPermit: form.hasTwoWayPermit,
        canProvideNoCriminalRecord: form.canProvideNoCriminalRecord,
        shiftAcceptance: form.shiftAcceptance,
        targetCourse: form.targetCourse,
      },
      currentStaff.name,
    );
    setSaving(false);
    if (updated) {
      onSaved(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in" id="edit-candidate-modal-overlay">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-800 p-5 sm:p-6 space-y-4 text-slate-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-white">編輯學員資料</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {candidate.id} · 操作人: {currentStaff.name} ({currentStaff.roleTitle})
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>姓名</label>
              <input type="text" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>性別</label>
              <select value={form.gender} onChange={(e) => set('gender', e.target.value as 'male' | 'female')} className={inputCls}>
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>年齡</label>
              <input type="number" min={16} max={70} value={form.age} onChange={(e) => set('age', Number(e.target.value))} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>現居城市</label>
              <input type="text" value={form.residenceCity} onChange={(e) => set('residenceCity', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>聯絡電話</label>
              <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>微信號</label>
              <input type="text" value={form.wechatId} onChange={(e) => set('wechatId', e.target.value)} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>電子郵件 (選填)</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Background */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>最高學歷</label>
              <select value={form.education} onChange={(e) => set('education', e.target.value)} className={inputCls}>
                <option value="初中">初中</option>
                <option value="高中 / 中專">高中 / 中專</option>
                <option value="大專">大專</option>
                <option value="本科及以上">本科及以上</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>身體狀況</label>
              <select value={form.healthStatus} onChange={(e) => set('healthStatus', e.target.value as EditFormState['healthStatus'])} className={inputCls}>
                <option value="excellent">良好 (完全勝任)</option>
                <option value="good">一般 (可勝任)</option>
                <option value="fair">較差 (需評估)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>過往經驗與背景描述</label>
              <textarea rows={3} value={form.workExperience} onChange={(e) => set('workExperience', e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Language ratings */}
          <div>
            <label className={labelCls}>語言自評 (0-5)</label>
            <div className="grid grid-cols-3 gap-3">
              {([
                ['cantonese', '粵語'],
                ['english', '英語'],
                ['mandarin', '普通話'],
              ] as const).map(([key, label]) => (
                <div key={key}>
                  <div className="text-slate-400 mb-1">{label}</div>
                  <select
                    value={form.languages[key]}
                    onChange={(e) => set('languages', { ...form.languages, [key]: Number(e.target.value) })}
                    className={inputCls}
                  >
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} 星</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance & preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>港澳通行證</label>
              <select value={form.hasTwoWayPermit ? 'yes' : 'no'} onChange={(e) => set('hasTwoWayPermit', e.target.value === 'yes')} className={inputCls}>
                <option value="yes">曾持有 / 現有</option>
                <option value="no">未辦理</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>無犯罪記錄證明</label>
              <select value={form.canProvideNoCriminalRecord ? 'yes' : 'no'} onChange={(e) => set('canProvideNoCriminalRecord', e.target.value === 'yes')} className={inputCls}>
                <option value="yes">可開具</option>
                <option value="no">存疑 / 不可</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>夜班 / 12h 長工時接受度</label>
              <select value={form.shiftAcceptance} onChange={(e) => set('shiftAcceptance', e.target.value as EditFormState['shiftAcceptance'])} className={inputCls}>
                <option value="high">完全接受</option>
                <option value="medium">中等</option>
                <option value="low">不接受</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>意向課程</label>
              <select value={form.targetCourse} onChange={(e) => set('targetCourse', e.target.value as CourseType)} className={inputCls}>
                <option value="workshop_2day">2天赴港就業分享會 (¥1,200)</option>
                <option value="value_pack">簽證等待期增值賦能課包 (¥1,500)</option>
                <option value="full_bundle">全套赴港直通套裝 (¥2,400)</option>
                <option value="qas_core">QAS 核心課程</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-slate-800 pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#c9a232] text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? '保存中…' : '保存修改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
