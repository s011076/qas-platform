import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  UserCheck, 
  Send, 
  Clock, 
  Tag, 
  Sparkles,
  User,
  History,
  X,
  PlusCircle,
  FileCheck
} from 'lucide-react';
import { Candidate, FollowUpNote, StaffUser } from '../types';

interface QuickNoteModalProps {
  candidate: Candidate;
  currentStaff: StaffUser;
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (candidateId: string, author: string, content: string, type: FollowUpNote['type']) => void;
}

const QUICK_PRESETS: Array<{ label: string; text: string; type: FollowUpNote['type'] }> = [
  { label: '📞 已電話聯繫', text: '已電話回訪聯繫，確認赴港求職意願強烈，無犯罪證明與體檢基本符合。', type: 'call' },
  { label: '⚠️ 待補件 (無犯罪證明)', text: '已提醒學員盡快辦理戶籍地無犯罪記錄證明。', type: 'system' },
  { label: '📄 待補件 (通行證)', text: '學員港澳通行證辦理/續簽中，預計下週完成補傳。', type: 'system' },
  { label: '💬 微信發送排期', text: '已微信發送最新 QAS 開班課表，等待學員確認參加場次。', type: 'wechat' },
  { label: '🎯 意向強烈/待確認訂金', text: '學員對全套直通班有高度意向，待支付意向訂金鎖位。', type: 'wechat' },
  { label: '👥 面試初篩通過', text: '粵語流利，形象端正具備良好服務意識，初篩通過。', type: 'interview' },
  { label: '⏳ 暫未接聽/稍後再聯', text: '撥打電話暫未接聽，已發送短信，安排明日再次跟進。', type: 'call' },
];

export const QuickNoteModal: React.FC<QuickNoteModalProps> = ({
  candidate,
  currentStaff,
  isOpen,
  onClose,
  onAddNote,
}) => {
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState<FollowUpNote['type']>('call');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddNote(candidate.id, currentStaff.name, content.trim(), noteType);
    setContent('');
    onClose();
  };

  const handleApplyPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setContent(preset.text);
    setNoteType(preset.type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in" id="quick-note-modal-overlay">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-5 border border-slate-800 text-slate-200 space-y-3.5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>快速添加聯絡記錄</span>
                <span className="text-xs font-normal text-slate-400">· {candidate.fullName}</span>
              </h3>
              <div className="text-[10px] text-slate-500 font-mono">{candidate.id} · {candidate.phone}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Staff Indicator */}
        <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">記錄更新人：</span>
          <span className="text-[#D4AF37] font-bold flex items-center gap-1 bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
            <User className="w-3 h-3" />
            <span>{currentStaff.name} ({currentStaff.roleTitle})</span>
          </span>
        </div>

        {/* Presets */}
        <div className="space-y-1.5">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Tag className="w-3 h-3 text-[#D4AF37]" />
            <span>常用快捷備註：</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {QUICK_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">聯絡方式</label>
            <select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value as FollowUpNote['type'])}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-200 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="call">📞 電話回訪</option>
              <option value="wechat">💬 微信溝通</option>
              <option value="interview">👥 面試評估</option>
              <option value="system">⚠️ 待補件 / 系統</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">跟進內容</label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="輸入跟進內容，例如：已電話聯繫、待補無犯罪證明..."
              required
              className="w-full text-xs p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 text-xs font-bold flex items-center gap-1 shadow-md transition-colors cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>確認保存備註</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
