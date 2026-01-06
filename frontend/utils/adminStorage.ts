const isBrowser = typeof window !== 'undefined';

type AuthKey = 'adminToken' | 'adminData';
type AuthScope = 'auto' | 'session' | 'local' | 'all';

const getStorage = (scope: 'session' | 'local'): Storage | null => {
  if (!isBrowser) return null;
  try {
    return scope === 'session' ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
};

const safeGetItem = (storage: Storage | null, key: AuthKey) => {
  if (!storage) return null;
  try {
    return storage.getItem(key) ?? null;
  } catch {
    return null;
  }
};

const clearItems = (storage: Storage | null) => {
  if (!storage) return;
  try {
    storage.removeItem('adminToken');
    storage.removeItem('adminData');
  } catch {
    // ignore storage errors
  }
};

const setItem = (storage: Storage | null, key: AuthKey, value: string) => {
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch {
    // ignore storage errors
  }
};

export const getStoredAuthItem = (key: AuthKey) => {
  const sessionValue = safeGetItem(getStorage('session'), key);
  if (sessionValue) return sessionValue;
  return safeGetItem(getStorage('local'), key);
};

export const getAdminToken = () => getStoredAuthItem('adminToken');

export const getAdminDataRaw = () => getStoredAuthItem('adminData');

export const getAdminData = <T = any>(): T | null => {
  const raw = getAdminDataRaw();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const persistAdminAuth = (
  token: string,
  data: string,
  scope: 'session' | 'local' = 'local'
) => {
  const storage = getStorage(scope);
  setItem(storage, 'adminToken', token);
  setItem(storage, 'adminData', data);
};

export const clearAdminAuth = (scope: AuthScope = 'auto') => {
  if (scope === 'all') {
    clearItems(getStorage('session'));
    clearItems(getStorage('local'));
    return;
  }

  if (scope === 'session') {
    clearItems(getStorage('session'));
    return;
  }

  if (scope === 'local') {
    clearItems(getStorage('local'));
    return;
  }

  const sessionToken = safeGetItem(getStorage('session'), 'adminToken');
  if (sessionToken) {
    clearItems(getStorage('session'));
    return;
  }

  clearItems(getStorage('local'));
};

export const getAdminAuthScope = (): 'session' | 'local' | null => {
  if (safeGetItem(getStorage('session'), 'adminToken')) return 'session';
  if (safeGetItem(getStorage('local'), 'adminToken')) return 'local';
  return null;
};

