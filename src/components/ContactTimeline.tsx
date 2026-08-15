import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  UserCheck, 
  FileCheck, 
  Send, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  Sparkles,
  ChevronDown,
  User,
  History
} from 'lucide-react';
import { Candidate, FollowUpNote, StaffUser } from '../types';

interface ContactTimelineProps {
  candidate: Candidate;
  currentStaff: StaffUser;
  onAddNote: (candidateId: string, author: string, content: string, type: FollowUpNote['type'], authorRole?: string) => void;
}

// Preset Quick Note Tags
const QUICK_NOTE_PRESETS: Array<{ label: string; text: string; type: FollowUpNote['type'] }> = [
  { label: '📞 已電話聯繫', text: '已進行電話回訪溝通，確認赴港求職意願強烈，無犯罪證明與體檢基本符合。', type: 'call' },
  { label: '⚠️ 待補件 (無犯罪證明)', text: '已通知學員盡快補交戶籍地公安局開具的無犯罪記錄證明。', type: 'system' },
  { label: '📄 待補件 (通行證)', text: '學員港澳通行證辦理中/待續簽，預計下週完成，跟進回傳照片。', type: 'system' },
  { label: '💬 微信發送排班表', text: '已通過微信發送最新 QAS 開課課表及分享會安排，等待學員確認參訓場次。', type: 'wechat' },
  { label: '🎯 意向強烈/待確認訂金', text: '學員對全套直通班有高度意向，已解答食宿與赴港考證疑問，待支付鎖位。', type: 'wechat' },
  { label: '👥 面試初篩通過', text: '粵語口語流利，形象端正具備良好服務意識，初篩合規建議排班。', type: 'interview' },
  { label: '⏳ 暫無人接聽/稍後再聯', text: '已撥打電話未接聽，已發送短信與微信好友申請，排期明天上午再次跟進。', type: 'call' },
];

export const ContactTimeline: React.FC<ContactTimelineProps> = ({
  candidate,
  currentStaff,
  onAddNote,
}) => {
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState<FollowUpNote['type']>('call');
  const [authorName, setAuthorName] = useState(currentStaff.name);
  const [showPresets, setShowPresets] = useState(true);

  const notes = candidate.notes || [];

  // Identify latest follow-up note (first in array or by date)
  const latestNote = notes.length > 0 ? notes[0] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddNote(
      candidate.id, 
      authorName.trim() || currentStaff.name, 
      content.trim(), 
      noteType,
      currentStaff.roleTitle
    );
    setContent('');
  };

  const handleApplyPreset = (preset: typeof QUICK_NOTE_PRESETS[0]) => {
    setContent(preset.text);
    setNoteType(preset.type);
  };

  const getTypeBadge = (type: FollowUpNote['type']) => {
    switch (type) {
      case 'call':
        return {
          label: '電話聯繫',
          icon: <Phone className="w-3 h-3 text-sky-400" />,
          bg: 'bg-sky-950/80 border-sky-800/80 text-sky-300',
          dot: 'bg-sky-400',
        };
      case 'wechat':
        return {
          label: '微信溝通',
          icon: <MessageSquare className="w-3 h-3 text-emerald-400" />,
          bg: 'bg-emerald-950/80 border-emerald-800/80 text-emerald-300',
          dot: 'bg-emerald-400',
        };
      case 'interview':
        return {
          label: '面試評估',
          icon: <UserCheck className="w-3 h-3 text-purple-400" />,
          bg: 'bg-purple-950/80 border-purple-800/80 text-purple-300',
          dot: 'bg-purple-400',
        };
      case 'system':
      default:
        return {
          label: '系統/補件',
          icon: <Clock className="w-3 h-3 text-amber-400" />,
          bg: 'bg-amber-950/80 border-amber-800/80 text-amber-300',
          dot: 'bg-amber-400',
        };
    }
  };

  return (
    <div className="space-y-4 rounded-xl bg-slate-950/70 border border-slate-800 p-4" id={`contact-timeline-${candidate.id}`}>
      
      {/* Timeline Header & Last Follow-up Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>學員聯絡記錄時間軸</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 font-normal">
                共 {notes.length} 筆記錄
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">完整記錄每次電話回訪、微信跟進、補件與狀態更新</p>
          </div>
        </div>

        {/* Latest Follow-up highlight tag */}
        {latestNote ? (
          <div className="bg-slate-900 border border-amber-500/30 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-xs">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">最後跟進時間與操作人：</div>
              <div className="font-semibold text-slate-200 text-[11px] flex items-center gap-1.5">
                <span className="text-[#D4AF37] font-mono">{latestNote.createdAt}</span>
                <span className="text-slate-500">·</span>
                <span className="text-white font-bold">{latestNote.author}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-slate-500 italic flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> 暫無跟進紀錄
          </div>
        )}
      </div>

      {/* Quick Add Note Form */}
      <form onSubmit={handleSubmit} className="space-y-2.5 bg-slate-900/90 rounded-xl p-3 border border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>新增聯絡跟進備註</span>
          </span>
          
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">當前更新人：</span>
            <span className="text-[#D4AF37] font-bold bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
              {authorName} ({currentStaff.roleTitle})
            </span>
          </div>
        </div>

        {/* Quick Tag Selector Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#D4AF37]" /> 常用快速備註（點擊帶入）：
            </span>
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="text-[10px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
            >
              {showPresets ? '收起預設' : '展開預設'}
            </button>
          </div>

          {showPresets && (
            <div className="flex flex-wrap gap-1.5">
              {QUICK_NOTE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="text-[11px] px-2 py-1 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-colors cursor-pointer text-left"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input & Note Type Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
          <div className="sm:col-span-1 flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-semibold">聯絡方式</label>
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

          <div className="sm:col-span-3 flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-semibold">跟進內容備註</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="例如：已電話聯繫確認、通知待補交無犯罪記錄證明、微信已發送開班排期..."
                required
                className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 text-xs font-bold flex items-center gap-1 shrink-0 shadow-md transition-colors cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>保存記錄</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Timeline List of Notes */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs bg-slate-900/40 rounded-xl border border-slate-800/40">
            尚無任何聯絡備註紀錄，請使用上方表單快速添加。
          </div>
        ) : (
          <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {notes.map((note, index) => {
              const badge = getTypeBadge(note.type);
              const isFirst = index === 0;

              return (
                <div key={note.id || index} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-slate-950 ${badge.dot} ${
                    isFirst ? 'ring-2 ring-[#D4AF37]/50 ring-offset-1 ring-offset-slate-950' : ''
                  }`} />

                  {/* Note Card */}
                  <div className={`rounded-xl p-3 border transition-colors ${
                    isFirst 
                      ? 'bg-slate-900/90 border-[#D4AF37]/40 shadow-sm' 
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${badge.bg}`}>
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>

                        {/* Author indicator with highlighted badge */}
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="text-[#D4AF37] font-semibold">{note.author}</span>
                          <span className="text-[10px] text-slate-500 font-normal">更新</span>
                        </span>
                      </div>

                      {/* Timestamp */}
                      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{note.createdAt}</span>
                        {isFirst && (
                          <span className="ml-1 text-[9px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.2 rounded font-bold">
                            最新
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed pl-0.5">
                      {note.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
