import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ get: vi.fn(), set: vi.fn(), remove: vi.fn() }));
vi.mock('@capacitor/preferences', () => ({ Preferences: mocks }));

import { authStorage } from './authStorage';

describe('authStorage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('persists and clears the authenticated session', async () => {
    const session = {
      accessToken: 'token', expiresAt: '2026-08-28T10:00:00Z',
      user: { id: 'u1', email: 'user@example.com', displayName: 'User' },
    };
    await authStorage.save(session);
    await authStorage.clear();
    expect(mocks.set).toHaveBeenCalledOnce();
    expect(mocks.remove).toHaveBeenCalledOnce();
  });

  it('returns null when no session exists', async () => {
    mocks.get.mockResolvedValue({ value: null });
    await expect(authStorage.load()).resolves.toBeNull();
  });
});
