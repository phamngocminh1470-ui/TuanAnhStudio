import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CheckCircle2, AlertCircle, AlertTriangle, Info, X, Sparkles,
  Trash2, HelpCircle, ShieldAlert, Bell, Check, ArrowRight
} from 'lucide-react';

export default function CustomAlertModal() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info', // 'success' | 'error' | 'warning' | 'info' | 'confirm'
    confirmText: 'Đồng ý',
    cancelText: 'Hủy bỏ',
    onConfirm: null,
    onCancel: null
  });

  const [toasts, setToasts] = useState([]);
  const confirmBtnRef = useRef(null);

  // ─── TOAST NOTIFICATION HANDLER ───────────────────────────────────────────
  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev.slice(-4), newToast]); // Giữ tối đa 5 toasts

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // ─── GLOBAL EVENT & HELPER REGISTRATION ───────────────────────────────────
  useEffect(() => {
    // 1. Hook for window.appConfirm (Promise-based Confirm Dialog)
    window.appConfirm = (message, title = 'Xác Nhận Thao Tác', options = {}) => {
      return new Promise((resolve) => {
        setModalState({
          isOpen: true,
          title: title || 'Xác Nhận Thao Tác',
          message: String(message || ''),
          type: options.type || 'confirm',
          confirmText: options.confirmText || 'Đồng ý',
          cancelText: options.cancelText || 'Hủy bỏ',
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false)
        });
      });
    };

    // 2. Hook for window.appAlert (Promise-based Alert Dialog)
    window.appAlert = (message, title = 'Thông Báo', type = 'info') => {
      return new Promise((resolve) => {
        let detectedType = type;
        let detectedTitle = title;
        const cleanMsg = String(message || '');

        if (cleanMsg.includes('✓') || cleanMsg.includes('✅') || cleanMsg.toLowerCase().includes('thành công') || cleanMsg.toLowerCase().includes('chúc mừng')) {
          detectedType = 'success';
          if (title === 'Thông Báo') detectedTitle = 'Thao Tác Thành Công';
        } else if (cleanMsg.toLowerCase().includes('lỗi') || cleanMsg.includes('❌') || cleanMsg.toLowerCase().includes('thất bại')) {
          detectedType = 'error';
          if (title === 'Thông Báo') detectedTitle = 'Thông Báo Lỗi';
        } else if (cleanMsg.toLowerCase().includes('cảnh báo') || cleanMsg.includes('⚠️') || cleanMsg.toLowerCase().includes('vui lòng')) {
          detectedType = 'warning';
          if (title === 'Thông Báo') detectedTitle = 'Lưu Ý Cần Biết';
        }

        setModalState({
          isOpen: true,
          title: detectedTitle,
          message: cleanMsg.replace(/^[✓✅⚠️❌]\s*/, ''),
          type: detectedType,
          confirmText: 'Đã hiểu',
          cancelText: '',
          onConfirm: () => resolve(),
          onCancel: () => resolve()
        });
      });
    };

    // 3. Hook for window.appToast (Corner Toast Notification)
    window.appToast = (message, type = 'info', duration = 3500) => {
      addToast(message, type, duration);
    };

    // 4. Overwrite window.alert so all legacy alert calls look gorgeous
    const originalAlert = window.alert;
    window.alert = (msg) => {
      window.appAlert(msg);
    };

    // 5. Custom event listener for backward compatibility
    const handleCustomAlert = (event) => {
      const { title, message, type = 'info', onConfirm, onCancel, confirmText = 'Đồng ý', cancelText = 'Hủy bỏ' } = event.detail || {};
      setModalState({
        isOpen: true,
        title: title || 'Thông Báo',
        message: message || '',
        type,
        confirmText,
        cancelText,
        onConfirm,
        onCancel
      });
    };

    window.addEventListener('examora_alert', handleCustomAlert);

    return () => {
      window.removeEventListener('examora_alert', handleCustomAlert);
      window.alert = originalAlert;
    };
  }, [addToast]);

  // Keyboard navigation (Enter to confirm, Escape to close/cancel)
  useEffect(() => {
    if (!modalState.isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalState.isOpen, modalState.onConfirm, modalState.onCancel]);

  const handleClose = () => {
    if (modalState.onCancel) modalState.onCancel();
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    if (modalState.onConfirm) modalState.onConfirm();
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const isSuccess = modalState.type === 'success';
  const isError = modalState.type === 'error';
  const isWarning = modalState.type === 'warning';
  const isConfirm = modalState.type === 'confirm' || modalState.cancelText;

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          1. TOAST NOTIFICATION CORNER CONTAINER (GÓC PHẢI DƯỚI)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-6 right-6 z-[999999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => {
          const isToastSuccess = toast.type === 'success';
          const isToastError = toast.type === 'error';
          const isToastWarn = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-2xl shadow-2xl flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${
                isToastSuccess
                  ? 'bg-[#091814]/95 border-emerald-500/40 text-emerald-100 shadow-emerald-500/20'
                  : isToastError
                  ? 'bg-[#18090f]/95 border-rose-500/40 text-rose-100 shadow-rose-500/20'
                  : isToastWarn
                  ? 'bg-[#181308]/95 border-amber-500/40 text-amber-100 shadow-amber-500/20'
                  : 'bg-[#090f24]/95 border-cyan-500/40 text-cyan-100 shadow-cyan-500/20'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isToastSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isToastError && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {isToastWarn && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {!isToastSuccess && !isToastError && !isToastWarn && <Sparkles className="w-5 h-5 text-cyan-400" />}
              </div>

              <div className="flex-1 text-xs font-medium leading-relaxed pr-1">
                {toast.message}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. MODAL DIALOG POPUP CHÍNH (ĐÈ TRÊN MỌI THÀNH PHẦN)
      ══════════════════════════════════════════════════════════════════════ */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[999998] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-in fade-in duration-200">
          
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={handleClose} />

          <div
            className="relative w-full max-w-md bg-[#090e24]/95 border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200 overflow-hidden backdrop-blur-3xl z-10"
            style={{
              boxShadow: isSuccess
                ? '0 0 60px rgba(16, 185, 129, 0.25), inset 0 0 20px rgba(16, 185, 129, 0.08)'
                : isError
                ? '0 0 60px rgba(244, 63, 94, 0.25), inset 0 0 20px rgba(244, 63, 94, 0.08)'
                : isWarning
                ? '0 0 60px rgba(245, 158, 11, 0.25), inset 0 0 20px rgba(245, 158, 11, 0.08)'
                : '0 0 60px rgba(59, 130, 246, 0.25), inset 0 0 20px rgba(59, 130, 246, 0.08)'
            }}
          >
            {/* Top Glow Ambient Orb */}
            <div
              className={`absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 ${
                isSuccess
                  ? 'bg-emerald-500'
                  : isError
                  ? 'bg-rose-500'
                  : isWarning
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
            />

            {/* Close 'X' Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon Header */}
            <div className="flex justify-center pt-2">
              <div
                className={`relative w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl border ${
                  isSuccess
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/20'
                    : isError
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-rose-500/20'
                    : isWarning
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-500/20'
                    : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-cyan-500/20'
                }`}
              >
                {isSuccess && <CheckCircle2 className="w-8 h-8 animate-in zoom-in-50 duration-300" />}
                {isError && <AlertCircle className="w-8 h-8 animate-in zoom-in-50 duration-300" />}
                {isWarning && <AlertTriangle className="w-8 h-8 animate-in zoom-in-50 duration-300" />}
                {!isSuccess && !isError && !isWarning && <Sparkles className="w-8 h-8 animate-in zoom-in-50 duration-300 text-cyan-300" />}
              </div>
            </div>

            {/* Title & Message */}
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white font-outfit tracking-tight">
                {modalState.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto font-normal whitespace-pre-wrap">
                {modalState.message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-center gap-3">
              {isConfirm ? (
                <>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer border border-white/10 active:scale-95"
                  >
                    {modalState.cancelText || 'Hủy bỏ'}
                  </button>
                  <button
                    ref={confirmBtnRef}
                    type="button"
                    onClick={handleConfirm}
                    className={`flex-1 py-3 px-4 rounded-2xl text-white font-extrabold text-xs transition cursor-pointer shadow-lg active:scale-95 ${
                      isError
                        ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-600/30'
                        : isWarning
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-orange-500/30'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-indigo-600/30'
                    }`}
                  >
                    {modalState.confirmText || 'Xác nhận'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleClose}
                  className={`w-full py-3.5 px-6 rounded-2xl text-white font-extrabold text-xs sm:text-sm transition cursor-pointer shadow-xl active:scale-95 ${
                    isSuccess
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/30'
                      : isError
                      ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-500/30'
                      : isWarning
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-500/30'
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-500/30'
                  }`}
                >
                  <span>{modalState.confirmText || 'Đã hiểu'}</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
