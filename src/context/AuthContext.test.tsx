import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  apiRequest: vi.fn(),
  setAccessToken: vi.fn(),
  setUnauthorizedHandler: vi.fn(),
  load: vi.fn().mockResolvedValue(null),
  save: vi.fn().mockResolvedValue(undefined),
  clear: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../services/api', () => ({
  apiRequest: mocks.apiRequest,
  setAccessToken: mocks.setAccessToken,
  setUnauthorizedHandler: mocks.setUnauthorizedHandler,
}));
vi.mock('../services/authStorage', () => ({
  authStorage: { load: mocks.load, save: mocks.save, clear: mocks.clear },
}));

import { AuthProvider, useAuth } from './AuthContext';

function Probe() {
  const { session, isLoading, login, logout } = useAuth();
  if (isLoading) return <span>loading</span>;
  return (
    <div>
      <span data-testid="user">{session?.user.email ?? 'none'}</span>
      <button onClick={() => void login('user@example.com', 'Demo1234!')}>login</button>
      <button onClick={() => void logout()}>logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  it('moves from logged out to logged in and back out', async () => {
    mocks.apiRequest.mockResolvedValue({
      accessToken: 'token',
      expiresAt: '2099-01-01T00:00:00Z',
      user: { id: '1', email: 'user@example.com', displayName: 'User' },
    });

    render(<AuthProvider><Probe /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('none'));

    fireEvent.click(screen.getByText('login'));
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('user@example.com'));
    expect(mocks.save).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByText('logout'));
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('none'));
    expect(mocks.clear).toHaveBeenCalled();
  });
});
