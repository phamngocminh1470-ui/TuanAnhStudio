/**
 * SyncStatusBadge.jsx
 * ==================
 * Small inline badge showing sync status to the user.
 * Displayed in IRT test engine and SM2 flashcards after saves.
 *
 * Props:
 *   status: 'idle' | 'syncing' | 'saved' | 'error' | 'offline'
 *   lastSyncAt: ISO string or null
 */

import React from 'react';
import { Cloud, CloudOff, CheckCircle2, Loader, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  idle: null,  // Show nothing when idle
  syncing: {
    icon: Loader,
    text: 'Đang lưu...',
    cls: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    spin: true,
  },
  saved: {
    icon: CheckCircle2,
    text: 'Đã đồng bộ',
    cls: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    spin: false,
  },
  error: {
    icon: AlertCircle,
    text: 'Lỗi lưu',
    cls: 'text-red-400 border-red-500/30 bg-red-500/10',
    spin: false,
  },
  offline: {
    icon: CloudOff,
    text: 'Offline',
    cls: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    spin: false,
  },
};

export default function SyncStatusBadge({ status, lastSyncAt, className = '' }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;

  const Icon = cfg.icon;

  // Format time
  let timeStr = '';
  if (lastSyncAt && status === 'saved') {
    try {
      const d = new Date(lastSyncAt);
      timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch {}
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all duration-300 ${cfg.cls} ${className}`}
      title={lastSyncAt ? `Lần cuối lưu: ${lastSyncAt}` : ''}
    >
      <Icon className={`w-3 h-3 ${cfg.spin ? 'animate-spin' : ''}`} />
      <span>{cfg.text}{timeStr ? ` ${timeStr}` : ''}</span>
    </span>
  );
}
