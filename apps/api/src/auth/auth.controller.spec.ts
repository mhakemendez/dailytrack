import type { Response } from 'express';
import { AUTH_COOKIE_MAX_AGE_MS, AUTH_COOKIE_NAME } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    register: jest.Mock;
    login: jest.Mock;
    getUserById: jest.Mock;
  };
  let response: { cookie: jest.Mock; clearCookie: jest.Mock };

  const user = {
    id: 'user-1',
    name: 'Jane Doe',
    email: 'jane@example.com',
  };

  beforeEach(() => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      getUserById: jest.fn(),
    };
    response = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    controller = new AuthController(authService as unknown as AuthService);
  });

  it('registers a user', async () => {
    authService.register.mockResolvedValue(user);

    await expect(
      controller.register({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      }),
    ).resolves.toEqual(user);
  });

  it('sets an HttpOnly authentication cookie on login and does not return the token', async () => {
    authService.login.mockResolvedValue({
      accessToken: 'signed-token',
      user,
    });

    const result = await controller.login(
      { email: 'jane@example.com', password: 'password123' },
      response as unknown as Response,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      AUTH_COOKIE_NAME,
      'signed-token',
      expect.objectContaining({
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: AUTH_COOKIE_MAX_AGE_MS,
      }),
    );
    expect(result).toEqual({ user });
    expect(result).not.toHaveProperty('accessToken');
  });

  it('clears the authentication cookie on logout without a max age', () => {
    controller.logout(response as unknown as Response);

    expect(response.clearCookie).toHaveBeenCalledWith(
      AUTH_COOKIE_NAME,
      expect.objectContaining({
        httpOnly: true,
        path: '/',
      }),
    );
    expect(response.clearCookie.mock.calls[0][1]).not.toHaveProperty('maxAge');
  });

  it('returns the current authenticated user', async () => {
    authService.getUserById.mockResolvedValue(user);

    await expect(
      controller.me({ userId: 'user-1', email: 'jane@example.com' }),
    ).resolves.toEqual(user);
    expect(authService.getUserById).toHaveBeenCalledWith('user-1');
  });
});
