import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnvUrl = (): string | undefined => {
  const envVal = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
  if (envVal && envVal.trim() !== '' && envVal.startsWith('https://')) return envVal.trim();
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('evencify_supabase_url');
    if (saved && saved.trim() !== '' && saved.startsWith('https://')) return saved.trim();
  }
  return undefined;
};

const getEnvKey = (): string | undefined => {
  const envVal = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (envVal && envVal.trim() !== '') return envVal.trim();
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('evencify_supabase_key');
    if (saved && saved.trim() !== '') return saved.trim();
  }
  return undefined;
};

export const getSupabaseConfig = () => ({
  url: getEnvUrl(),
  key: getEnvKey(),
});

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key);
};

export const setSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('evencify_supabase_url', url.trim());
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

// Initialize the real client if configured, or a placeholder instance that reports unconfigured
export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(config.url!, config.key!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createClient(
      'https://placeholder-project.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

