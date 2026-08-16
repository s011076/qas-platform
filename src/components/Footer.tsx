import React from 'react';
import { Shield, BookOpen, MessageCircle, Phone, Award, CheckCircle2 } from 'lucide-react';

import { AppTab } from '../types';

interface FooterProps {
  onSelectTab: (tab: AppTab) => void;
  onOpenWechat: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenWechat }) => {
  return (
    <footer className="bg-[#070d1f] text-slate-400 border-t border-slate-800 text-xs mt-12 select-none" id="app-footer">
      {/* Top Value Assurance Grid */}
      <div className="border-b border-slate-800/80 py-6 bg-[#0A1128]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
              <div className="w-7 h-7 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center shrink-0 text-[#D4AF37]">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">合規赴港 · 同工同酬</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">嚴格對接香港勞工法例，保障合法權益</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
              <div className="w-7 h-7 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center shrink-0 text-[#D4AF37]">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">QAS 認可預前課程</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">20小時專訓 (16h核心 + 4h赴港適應)</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
              <div className="w-7 h-7 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center shrink-0 text-[#D4AF37]">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">4-6 個月增值課包</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">善用簽注等待期，掌握行業術語與口語</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/40 border border-slate-800/60">
              <div className="w-7 h-7 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center shrink-0 text-[#D4AF37]">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">1 對 1 赴港條件評估</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">語言/履歷測評，精準定位高薪崗位</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand Col */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-bold text-xs">
                QAS
              </div>
              <span className="font-bold text-sm text-white">粵港安聯 QAS 預前培訓基地</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              專注於廣東（大灣區）人才赴香港從事優質物業管理、甲級商廈安保及高端豪宅接待培訓。以專業課程為橋樑，打造可持續高薪發展通道。
            </p>
            <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-300">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>2026 最新期數現正接受預報名 · 實時排期中</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-300 text-xs uppercase tracking-wider">快速導航</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button 
                  onClick={() => onSelectTab('home')}
                  className="hover:text-[#D4AF37] transition-colors text-left text-slate-400 hover:underline"
                >
                  · 課程詳細介紹與香港薪資標準
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('register')}
                  className="hover:text-[#D4AF37] transition-colors text-left text-slate-400 hover:underline"
                >
                  · 填寫報名自評表 (免費資格審核)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('student')}
                  className="hover:text-[#D4AF37] transition-colors text-left text-slate-400 hover:underline"
                >
                  · 學員登入與課前資料下載專區
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('admin')}
                  className="hover:text-[#D4AF37] transition-colors text-left text-slate-500 hover:text-slate-300"
                >
                  · 教務管理系統 (內部專用)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Box */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-300 text-xs uppercase tracking-wider">教務聯繫與線下實訓點</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-[#D4AF37] shrink-0" />
                <span>大灣區諮詢：+86 138-0020-8888</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3 h-3 text-[#D4AF37] shrink-0" />
                <span>官方微信：HK-QAS-OFFICIAL</span>
              </div>
              <p className="text-slate-500 text-[10px] pt-1">
                培訓點：廣州天河體育中心基地 / 深圳福田口岸實訓中心
              </p>
              <button
                onClick={onOpenWechat}
                className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>在線聯繫教務老師</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright & telemetry status */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500">
          <div className="flex gap-4">
            <span>© 2026 粵港安聯 QAS 培訓機構 · 版權所有</span>
            <span className="hidden sm:inline">系統版本 v2.4.0-PRO (High Density)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 微信名額同步</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 數據庫實時連接</span>
            <span>合規申報香港法例第460章</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
