import React, { useState } from 'react';
import { X, MessageSquare, Phone, Check, Copy, ShieldCheck } from 'lucide-react';

interface WeChatContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeChatContactModal: React.FC<WeChatContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const wechatId = 'HK-QAS-OFFICIAL';
  const phoneGD = '+86 138-0020-8888 (廣州/深圳教務處)';
  const phoneHK = '+852 2888 9988 (香港諮詢處)';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(wechatId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" id="wechat-contact-modal-overlay">
      <div 
        id="wechat-contact-modal-card" 
        className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-800 text-slate-200"
      >
        {/* Header */}
        <div className="bg-[#070d1f] p-4 relative border-b border-slate-800">
          <button 
            onClick={onClose}
            id="close-wechat-modal-btn"
            className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">粵港直通 · 官方教務對接處</span>
          </div>
          <h3 className="text-base font-bold text-white">預約 1 對 1 赴港條件評估</h3>
          <p className="text-xs text-slate-400 mt-0.5">添加教務老師微信，獲取 QAS 培訓資料及最新香港僱主崗位名冊</p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Simulated QR & WeChat ID */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 flex flex-col items-center text-center">
            {/* SVG QR Code Simulation */}
            <div className="w-36 h-36 bg-white p-2 rounded border border-slate-700 shadow-inner flex items-center justify-center relative group">
              <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                {/* Visual stylised QR Code pattern */}
                <rect x="0" y="0" width="30" height="30" fill="#0A1128" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="9" y="9" width="12" height="12" fill="#0A1128" />

                <rect x="70" y="0" width="30" height="30" fill="#0A1128" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="79" y="9" width="12" height="12" fill="#0A1128" />

                <rect x="0" y="70" width="30" height="30" fill="#0A1128" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="9" y="79" width="12" height="12" fill="#0A1128" />

                {/* Random QR module dots */}
                <rect x="35" y="5" width="6" height="6" />
                <rect x="45" y="5" width="6" height="6" />
                <rect x="55" y="12" width="6" height="6" />
                <rect x="35" y="20" width="6" height="6" />
                <rect x="50" y="25" width="6" height="6" />
                <rect x="10" y="40" width="6" height="6" />
                <rect x="25" y="45" width="6" height="6" />
                <rect x="40" y="40" width="20" height="20" fill="#D4AF37" />
                <circle cx="50" cy="50" r="6" fill="white" />
                <rect x="65" y="40" width="6" height="6" />
                <rect x="80" y="45" width="6" height="6" />
                <rect x="35" y="70" width="6" height="6" />
                <rect x="45" y="75" width="6" height="6" />
                <rect x="55" y="85" width="6" height="6" />
                <rect x="70" y="70" width="6" height="6" />
                <rect x="80" y="80" width="6" height="6" />
                <rect x="90" y="88" width="6" height="6" />
              </svg>
              <div className="absolute inset-0 bg-[#0A1128]/85 text-white rounded flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2 text-xs">
                <span>長按或掃描二維碼</span>
                <span className="text-[10px] text-[#D4AF37] mt-1">教務處在線微信</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-xs text-slate-400">官方微信號：</span>
              <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/25">{wechatId}</span>
              <button 
                onClick={handleCopy}
                id="copy-wechat-btn"
                className="text-xs flex items-center gap-1 bg-[#D4AF37] hover:bg-[#c49f2c] text-slate-950 font-semibold px-2.5 py-0.5 rounded transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已複製' : '複製'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">微信搜索上述號碼，備註「QAS諮詢」優先審核</p>
          </div>

          {/* Direct Hotlines */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/50 border border-slate-800">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-200">大灣區直撥熱線 (廣州 / 深圳)</div>
                <div className="text-slate-400 font-mono text-[11px] mt-0.5">{phoneGD}</div>
                <div className="text-[10px] text-slate-500">服務時間：週一至週日 09:00 - 21:00</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/50 border border-slate-800">
              <MessageSquare className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-200">香港教務聯絡處 (諮詢 / 僱主合作)</div>
                <div className="text-slate-400 font-mono text-[11px] mt-0.5">{phoneHK}</div>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="bg-[#06402B]/20 border border-[#06402B]/50 rounded-lg p-2.5 text-[11px] text-emerald-300 flex items-start gap-2">
            <span className="font-bold text-[#10B981] shrink-0">提示：</span>
            <span>我們為學員提供免費初步履歷審查與 QAS 考試資格預審，諮詢不收取任何前置評估費。</span>
          </div>
        </div>

        {/* Footer button */}
        <div className="bg-[#070d1f] px-5 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            id="modal-confirm-btn"
            className="w-full sm:w-auto px-4 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
          >
            關閉窗口
          </button>
        </div>
      </div>
    </div>
  );
};
