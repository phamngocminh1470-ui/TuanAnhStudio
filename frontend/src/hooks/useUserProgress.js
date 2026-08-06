/**
 * useUserProgress.js — Shared Hook for User Progress Sync
 * =========================================================
 * Handles synchronization between localStorage (offline cache) and
 * the backend SQLite database (persistent server-side storage).
 *
 * Strategy:
 *   - localStorage = fast read cache, works offline
 *   - Server = source of truth when user is logged in
 *   - On login → pull server data and merge into localStorage (server wins for history)
 *   - On answer submit → push to server silently (non-blocking)
 *   - On network failure → keep localStorage, retry on next opportunity
 *
 * IMPORTANT: This hook DOES NOT modify any IRT/CAT/SM2/FSRS algorithms.
 * It only manages the storage and retrieval layer.
 */

import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

const API_BASE = '/api';

/**
 * Merge server history with local history:
 * - Server data is authoritative
 * - Append any local-only items (by itemId) not already on server
 * - Deduplicate by itemId, keeping the most recent result
 */
function mergeHistories(serverHistory, localHistory) {
  if (!Array.isArray(serverHistory)) serverHistory = [];
  if (!Array.isArray(localHistory)) localHistory = [];

  const serverIds = new Set(serverHistory.map(h => h.itemId).filter(Boolean));
  const localOnlyItems = localHistory.filter(h => h.itemId && !serverIds.has(h.itemId));

  // Server history first (authoritative), then local-only items appended
  return [...serverHistory, ...localOnlyItems];
}

/**
 * Merge skill mastery objects:
 * - For each skill, take the higher mastery value (more progress is better)
 */
function mergeMastery(serverMastery, localMastery) {
  const merged = { ...(localMastery || {}) };
  if (serverMastery && typeof serverMastery === 'object') {
    for (const [skill, val] of Object.entries(serverMastery)) {
      if (merged[skill] === undefined || val > merged[skill]) {
        merged[skill] = val;
      }
    }
  }
  return merged;
}

/**
 * Safe JSON parse with fallback
 */
function safeParse(str, fallback) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useUserProgress() {
  const [syncStatus, setSyncStatus] = useState('idle');
  // 'idle' | 'syncing' | 'saved' | 'error' | 'offline'
  const [lastSyncAt, setLastSyncAt] = useState(null);
  const [serverStats, setServerStats] = useState(null);
  // ^ { streak_days, total_sessions, total_questions, total_correct, accuracy }

  const pendingOfflineSteps = useRef([]);
  // Offline steps to be flushed after login

  /**
   * isLoggedIn: check if user has a valid auth token in storage
   */
  const isLoggedIn = useCallback(() => {
    return !!localStorage.getItem('auth_token');
  }, []);

  // ─── LOAD FROM SERVER ─────────────────────────────────────────────────────

  /**
   * loadFromServer()
   * Called after a successful login.
   * Pulls the user's progress from the server, merges with localStorage,
   * and flushes any pending offline steps back to the server.
   *
   * Returns { success: bool, mergedTheta, mergedHistory, mergedMastery }
   */
  const loadFromServer = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      const res = await axios.get(`${API_BASE}/user/progress`, { timeout: 8000 });

      if (!res.data || res.data.status !== 'success' || !res.data.progress) {
        throw new Error('Server returned empty progress');
      }

      const serverProg = res.data.progress;

      // Pull current localStorage values
      const localTheta = parseFloat(localStorage.getItem('user_theta') || '0.0');
      const localHistory = safeParse(localStorage.getItem('irt_history'), []);
      const localMastery = safeParse(localStorage.getItem('skill_mastery'), {});
      const localSm2Ef = parseFloat(localStorage.getItem('user_ef') || '2.52');
      const localSm2Int = parseInt(localStorage.getItem('user_next_interval') || '6', 10);
      const localVocab = parseInt(localStorage.getItem('user_vocab_count') || '0', 10);

      // Server-side data
      const serverTheta = serverProg.theta ?? 0.0;
      const serverHistory = serverProg.irt_history || [];
      const serverMastery = serverProg.skill_mastery || {};
      const serverSm2 = serverProg.sm2_data || {};

      // ── Merge Strategy ─────────────────────────────────────────────────────
      // theta: take the max (most progress wins)
      const mergedTheta = Math.max(serverTheta, localTheta);

      // history: server is authoritative; local-only items get appended
      const mergedHistory = mergeHistories(serverHistory, localHistory);

      // mastery: take higher value per skill
      const mergedMastery = mergeMastery(serverMastery, localMastery);

      // sm2: use server data if available, else local
      const serverEf = serverSm2.ef ?? localSm2Ef;
      const serverInt = serverSm2.next_interval ?? localSm2Int;
      const serverVocab = serverSm2.vocab_count ?? localVocab;

      // ── Write merged data back to localStorage ─────────────────────────────
      localStorage.setItem('user_theta', mergedTheta.toString());
      localStorage.setItem('irt_history', JSON.stringify(mergedHistory));
      if (Object.keys(mergedMastery).length > 0) {
        localStorage.setItem('skill_mastery', JSON.stringify(mergedMastery));
      }
      localStorage.setItem('user_ef', serverEf.toString());
      localStorage.setItem('user_next_interval', serverInt.toString());
      if (serverVocab > 0) {
        localStorage.setItem('user_vocab_count', serverVocab.toString());
      }
      if (serverProg.streak_days !== undefined) {
        localStorage.setItem('user_streak', serverProg.streak_days.toString());
      }

      // ── Update server stats state ──────────────────────────────────────────
      setServerStats({
        streak_days: serverProg.streak_days || 0,
        total_sessions: serverProg.total_sessions || 0,
        total_questions: serverProg.total_questions || 0,
        total_correct: serverProg.total_correct || 0,
        accuracy: serverProg.accuracy || 0,
        updated_at: serverProg.updated_at || null,
      });

      // ── Flush pending offline steps ────────────────────────────────────────
      if (pendingOfflineSteps.current.length > 0) {
        const offlineItems = pendingOfflineSteps.current;
        pendingOfflineSteps.current = [];
        // Push the local-only items to server in one batch
        const offlineOnlyItems = offlineItems.filter(
          s => !serverHistory.some(h => h.itemId === s.itemId)
        );
        if (offlineOnlyItems.length > 0) {
          try {
            await axios.post(`${API_BASE}/user/progress`, {
              theta: mergedTheta,
              irt_history: offlineOnlyItems,
              skill_mastery: mergedMastery,
              session_type: 'irt_test',
              questions_answered: offlineOnlyItems.length,
              correct_count: offlineOnlyItems.filter(s => s.result === 1).length,
              skill_focus: 'Offline sync',
            }, { timeout: 8000 });
          } catch (flushErr) {
            console.warn('[Sync] Could not flush offline steps:', flushErr.message);
          }
        }
      }

      setSyncStatus('saved');
      setLastSyncAt(new Date().toISOString());

      return {
        success: true,
        mergedTheta,
        mergedHistory,
        mergedMastery,
        serverStats: serverProg,
      };

    } catch (err) {
      console.error('[Sync] loadFromServer failed:', err.message);

      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setSyncStatus('offline');
      } else if (err.response?.status === 401) {
        // Token expired — clear it
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_session');
        delete axios.defaults.headers.common['Authorization'];
        setSyncStatus('error');
      } else {
        setSyncStatus('error');
      }

      return { success: false };
    }
  }, []);

  // ─── SAVE TO SERVER ───────────────────────────────────────────────────────

  /**
   * saveToServer(payload)
   * Silent, non-blocking save after each answer/rating.
   * If not logged in: saves step to pendingOfflineSteps (for later flush).
   *
   * payload = {
   *   theta, skill_mastery, irt_history_step,
   *   sm2_data, session_type, questions_answered,
   *   correct_count, skill_focus, session_data
   * }
   */
  const saveToServer = useCallback(async (payload) => {
    const {
      theta,
      skill_mastery,
      irt_history_step,  // Single new step object
      sm2_data,
      session_type = 'irt_test',
      theta_before,
      questions_answered = 1,
      correct_count = 0,
      skill_focus = '',
      session_data,
    } = payload;

    if (!isLoggedIn()) {
      // Buffer offline steps for later flush
      if (irt_history_step) {
        pendingOfflineSteps.current.push(irt_history_step);
      }
      setSyncStatus('offline');
      return { success: false, reason: 'not_logged_in' };
    }

    setSyncStatus('syncing');

    try {
      const body = {
        session_type,
        questions_answered,
        correct_count,
        skill_focus,
      };
      if (theta !== undefined) body.theta = theta;
      if (theta_before !== undefined) body.theta_before = theta_before;
      if (skill_mastery !== undefined) body.skill_mastery = skill_mastery;
      if (irt_history_step) body.irt_history = [irt_history_step];
      if (sm2_data !== undefined) body.sm2_data = sm2_data;
      if (session_data !== undefined) body.session_data = session_data;

      const res = await axios.post(`${API_BASE}/user/progress`, body, { timeout: 6000 });

      if (res.data?.status === 'success') {
        setSyncStatus('saved');
        setLastSyncAt(new Date().toISOString());

        // Update streak from server response
        if (res.data.streak_days !== undefined) {
          localStorage.setItem('user_streak', res.data.streak_days.toString());
          setServerStats(prev => prev ? {
            ...prev,
            streak_days: res.data.streak_days,
            total_sessions: res.data.total_sessions ?? prev.total_sessions,
          } : null);
        }
        return { success: true };
      } else {
        throw new Error('Save returned non-success');
      }

    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setSyncStatus('offline');
        // Buffer the step for retry
        if (irt_history_step) {
          pendingOfflineSteps.current.push(irt_history_step);
        }
        console.warn('[Sync] Offline — buffered step for later sync.');
      } else if (err.response?.status === 401) {
        // Token expired
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_session');
        delete axios.defaults.headers.common['Authorization'];
        setSyncStatus('error');
      } else {
        setSyncStatus('error');
        console.warn('[Sync] saveToServer error:', err.message);
      }
      return { success: false, reason: err.message };
    }
  }, [isLoggedIn]);

  // ─── REFRESH SERVER STATS ─────────────────────────────────────────────────

  /**
   * refreshStats()
   * Pull latest stats from server (for dashboard display).
   * Does NOT modify localStorage — only updates serverStats state.
   */
  const refreshStats = useCallback(async () => {
    if (!isLoggedIn()) {
      setServerStats(null);
      return null;
    }
    try {
      const res = await axios.get(`${API_BASE}/user/progress`, { timeout: 6000 });
      if (res.data?.status === 'success' && res.data.progress) {
        const p = res.data.progress;
        const stats = {
          streak_days: p.streak_days || 0,
          total_sessions: p.total_sessions || 0,
          total_questions: p.total_questions || 0,
          total_correct: p.total_correct || 0,
          accuracy: p.accuracy || 0,
          updated_at: p.updated_at || null,
        };
        setServerStats(stats);
        return stats;
      }
    } catch (err) {
      console.warn('[Sync] refreshStats error:', err.message);
    }
    return null;
  }, [isLoggedIn]);

  return {
    syncStatus,      // 'idle' | 'syncing' | 'saved' | 'error' | 'offline'
    lastSyncAt,      // ISO string or null
    serverStats,     // { streak_days, total_sessions, total_questions, total_correct, accuracy }
    isLoggedIn,
    loadFromServer,
    saveToServer,
    refreshStats,
  };
}

export default useUserProgress;
