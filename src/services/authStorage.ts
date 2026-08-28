import { Preferences } from '@capacitor/preferences';
import type { AuthSession } from '../models/auth';

const SESSION_KEY = 'creditos.auth.session';

export const authStorage = {
  async load(): Promise<AuthSession | null> {
    const { value } = await Preferences.get({ key: SESSION_KEY });
    if (!value) return null;

    try {
      return JSON.parse(value) as AuthSession;
    } catch {
      await Preferences.remove({ key: SESSION_KEY });
      return null;
    }
  },

  async save(session: AuthSession): Promise<void> {
    await Preferences.set({ key: SESSION_KEY, value: JSON.stringify(session) });
  },

  async clear(): Promise<void> {
    await Preferences.remove({ key: SESSION_KEY });
  },
};
