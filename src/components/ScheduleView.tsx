import React from 'react';
import {
  Calendar,
  Clock,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CourseBatch } from '../types';

interface ScheduleViewProps {
  onGoToRegister: (courseType?: string) => void;
  batches: CourseBatch[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ onGoToRegister, batches }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-fade-in" id="schedule-view-root">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            近期開課日程
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            2026 深圳 / 廣州 實體班與線上分享會
          </h1>
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

      {/* Batches grid */}
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

                <h2 className="font-bold text-white text-sm">{batch.title}</h2>

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
    </div>
  );
};
