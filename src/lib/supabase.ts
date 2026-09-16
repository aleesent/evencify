import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://tutspdayygbrrqtuepao.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_gn9U1OxaMNUwGMroOA_Rew_k4F9fMPH';

const cleanUrl = (rawUrl?: string): string | undefined => {
  if (!rawUrl || typeof rawUrl !== 'string') return undefined;
  const trimmed = rawUrl.trim();
  if (!trimmed.startsWith('https://') && !trimmed.startsWith('http://')) return undefined;
  // Strip trailing /rest/v1 or /rest/v1/ or trailing slashes
  return trimmed.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
};

const getEnvUrl = (): string => {
  const envVal = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
  const cleanedEnv = cleanUrl(envVal);
  if (cleanedEnv) return cleanedEnv;

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('evencify_supabase_url');
    const cleanedSaved = cleanUrl(saved || undefined);
    if (cleanedSaved) return cleanedSaved;
  }
  return DEFAULT_SUPABASE_URL;
};

const getEnvKey = (): string => {
  const envVal = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (envVal && envVal.trim() !== '') return envVal.trim();

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('evencify_supabase_key');
    if (saved && saved.trim() !== '') return saved.trim();
  }
  return DEFAULT_SUPABASE_ANON_KEY;
};

export const getSupabaseConfig = () => ({
  url: getEnvUrl(),
  key: getEnvKey(),
});

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key && url.startsWith('http'));
};

export const setSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    const cleaned = cleanUrl(url) || url.trim();
    localStorage.setItem('evencify_supabase_url', cleaned);
    localStorage.setItem('evencify_supabase_key', key.trim());
    window.location.reload();
  }
};

export const clearSupabaseConfig = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('evencify_supabase_url');
    localStorage.removeItem('evencify_supabase_key');
    window.location.reload();
  }
};

const config = getSupabaseConfig();

export const supabase: SupabaseClient = createClient(config.url, config.key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});


