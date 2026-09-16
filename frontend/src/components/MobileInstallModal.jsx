import React, { useState, useEffect } from 'react';
import { 
  X, Smartphone, Apple, Monitor, Download, CheckCircle2, 
  Share2, PlusSquare, ArrowRight, Zap, ShieldCheck, Sparkles, ExternalLink 
} from 'lucide-react';

export default function MobileInstallModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('android');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect user OS automatically on open
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setActiveTab('ios');
    } else if (/android/i.test(userAgent)) {
      setActiveTab('android');
    }

    // Capture PWA install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.deferredPWAInstallPrompt = e;
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.deferredPWAInstallPrompt) {
      setDeferredPrompt(window.deferredPWAInstallPrompt);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // If browser doesn't expose prompt, alert instructions
      alert('Để cài đặt: Bạn vui lòng nhấn vào menu 3 chấm (⋮) ở góc trên trình duyệt Chrome và chọn "Cài đặt ứng dụng" hoặc "Thêm vào Màn hình chính".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#0d1433] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/15 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative flex items-center justify-between p-6 sm:p-7 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                PWA STANDALONE APP // CROSS-PLATFORM
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-outfit text-white">
                Cài Đặt Ứng Dụng Điện Thoại
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OS Selector Tabs */}
        <div className="flex border-b border-cyan-500/20 bg-[#090e24]/70 p-2 gap-2">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'android'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android (Samsung, Xiaomi...)</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ios'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>iPhone / iPad (iOS)</span>
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`hidden sm:flex flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold font-mono items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'desktop'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Máy Tính (PC/Mac)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">

          {/* ════════════ TAB ANDROID ════════════ */}
          {activeTab === 'android' && (
            <div className="space-y-6 animate-fade-in">
              {/* One Click Install Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-sm font-bold text-white font-outfit flex items-center gap-2 justify-center sm:justify-start">
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Cài đặt trực tiếp 1 chạm qua Chrome</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Ứng dụng sẽ tự động tải về và đặt icon trên màn hình chính điện thoại.
                  </p>
                </div>

                <button
                  onClick={handleInstallClick}
                  className="btn-3d-primary px-6 py-3 rounded-full text-xs font-mono font-bold flex items-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-cyan-500/30"
                >
                  <Download className="w-4 h-4" />
                  <span>{isInstalled ? 'Đã Cài Đặt Xong' : 'Cài Đặt Ứng Dụng Ngay'}</span>
                </button>
              </div>

              {/* Step by Step Manual Guide */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  HƯỚNG DẪN CÀI ĐẶT THỦ CÔNG (CHỈ MẤT 5 GIÂY):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-[#080d22] border border-cyan-500/20 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-cyan-300 font-mono font-bold flex items-center justify-center border border-cyan-500/30">
                      1
                    </div>
                    <div className="font-bold text-white">Mở Google Chrome</div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Dùng trình duyệt Chrome trên điện thoại truy cập vào địa chỉ web Examora.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#080d22] border border-cyan-500/20 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-cyan-300 font-mono font-bold flex items-center justify-center border border-cyan-500/30">
                      2
                    </div>
                    <div className="font-bold text-white">Nhấn Menu 3 Chấm</div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Nhấn vào biểu tượng <strong className="text-cyan-300">3 chấm (⋮)</strong> ở góc trên bên phải màn hình Chrome.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#080d22] border border-cyan-500/20 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-cyan-300 font-mono font-bold flex items-center justify-center border border-cyan-500/30">
                      3
                    </div>
                    <div className="font-bold text-white">Chọn "Cài đặt ứng dụng"</div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Chọn <strong className="text-cyan-300">"Cài đặt ứng dụng"</strong> hoặc <em>"Thêm vào Màn hình chính"</em> ➔ Nhấn Cài đặt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ TAB IOS (IPHONE / IPAD) ════════════ */}
          {activeTab === 'ios' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
                <Apple className="w-5 h-5 shrink-0 text-amber-300 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-200 font-outfit text-sm">
                    Quy định bảo mật của Apple trên iPhone / iPad
                  </div>
                  <p className="text-slate-300 text-[12px] leading-relaxed">
                    Trên iOS, bạn cài đặt trực tiếp qua trình duyệt <strong>Safari</strong> mà không cần đăng ký tài khoản Apple ID hay trả phí tải app!
                  </p>
                </div>
              </div>

              {/* iOS Step by Step */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  3 BƯỚC CÀI ĐẶT TRÊN IPHONE / IPAD (SAFARI):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-[#080d22] border border-cyan-500/20 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-600/30 text-purple-300 font-mono font-bold flex items-center justify-center border border-purple-500/30">
                      1
                    </div>
                    <div className="font-bold text-white">Mở Safari</div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Mở trình duyệt <strong className="text-white">Safari</strong> mặc định trên iPhone và truy cập vào trang web.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#080d22] border border-cyan-500/20 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-600/30 text-purple-300 font-mono font-bold flex items-center justify-center border border-purple-500/30">
                      2
                    </div>
                    <div className="font-bold text-white">Nhấn nút Chia Sẻ</div>
                    <p className="text-slate-400 text-[11px] leading-relaxed flex items-center gap-1">
                      Nhấn vào biểu tượng <Share2 className="w-3.5 h-3.5 text-cyan-300 inline" /> (hình vuông có mũi tên trỏ lên) ở thanh dưới cùng.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#080d22] border border-cyan-500/20 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-600/30 text-purple-300 font-mono font-bold flex items-center justify-center border border-purple-500/30">
                      3
                    </div>
                    <div className="font-bold text-white">Thêm vào MH Chính</div>
                    <p className="text-slate-400 text-[11px] leading-relaxed flex items-center gap-1">
                      Cuộn xuống chọn <PlusSquare className="w-3.5 h-3.5 text-emerald-300 inline" /> <strong>"Thêm vào MH chính"</strong> ➔ Nhấn <strong>Thêm</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ TAB DESKTOP (PC/MAC) ════════════ */}
          {activeTab === 'desktop' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 rounded-2xl bg-[#080d22] border border-cyan-500/20 space-y-3 text-xs">
                <div className="font-bold text-sm text-white font-outfit flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  <span>Cài Đặt Trên Máy Tính (Windows / macOS)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Nếu bạn đang dùng Chrome, Microsoft Edge hoặc Brave trên máy tính:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1 text-[12px]">
                  <li>Nhìn lên góc phải thanh nhập địa chỉ web (URL bar).</li>
                  <li>Nhấn vào biểu tượng <strong>Cài đặt ứng dụng</strong> (hình màn hình máy tính có mũi tên tải xuống hoặc dấu cộng).</li>
                  <li>Nhấn <strong>Cài đặt (Install)</strong> để ghim Examora AI vào Taskbar hoặc Desktop.</li>
                </ol>
              </div>
            </div>
          )}

          {/* PWA Advantages (Key points for KHKT Presentation) */}
          <div className="p-5 rounded-2xl bg-[#080d22]/90 border border-cyan-500/20 space-y-3">
            <div className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ƯU ĐIỂM CÔNG NGHỆ PWA (DÀNH CHO BÁO CÁO KHKT)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Siêu nhẹ &lt; 5MB</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Không tốn dung lượng bộ nhớ điện thoại, chạy mượt trên cả máy cấu hình yếu.
                </p>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Giao diện Fullscreen</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Ẩn thanh trình duyệt, mở rộng tối đa không gian làm bài trắc nghiệm và luyện phát âm.
                </p>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tự động cập nhật</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Mỗi khi mở app sẽ tự động tải các câu hỏi mới nhất từ server mà không cần update thủ công.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t border-cyan-500/20 bg-[#080d22] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>EXAMORA PWA V1.2.0 • PHI LỢI NHUẬN</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold transition-colors cursor-pointer"
          >
            Đã Hiểu & Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
