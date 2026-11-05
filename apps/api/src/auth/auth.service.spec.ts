import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };
  let jwtService: { signAsync: jest.Mock };

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('signed-token'),
    };
    service = new AuthService(
      prisma as unknown as PrismaService,
      jwtService as unknown as JwtService,
    );
  });

  describe('register', () => {
    it('hashes the password and returns only safe user fields', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockImplementation(({ data }) => ({
        id: 'user-1',
        name: data.name,
        email: data.email,
      }));

      const result = await service.register({
        name: '  Jane Doe  ',
        email: '  Jane@Example.COM ',
        password: 'password123',
      });

      const createArgs = prisma.user.create.mock.calls[0][0];
      expect(createArgs.data.email).toBe('jane@example.com');
      expect(createArgs.data.name).toBe('Jane Doe');
      expect(createArgs.data.passwordHash).not.toBe('password123');
      expect(
        await bcrypt.compare('password123', createArgs.data.passwordHash),
      ).toBe(true);

      expect(result).toEqual({
        id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
      });
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('rejects an email that is already registered', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing-user' });

      await expect(
        service.register({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
        }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const password = 'password123';
    let passwordHash: string;

    beforeAll(async () => {
      passwordHash = await bcrypt.hash(password, 4);
    });

    it('returns an access token and safe user fields for valid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        passwordHash,
      });

      const result = await service.login({
        email: 'JANE@example.com',
        password,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'jane@example.com' },
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-1',
        email: 'jane@example.com',
      });
      expect(result).toEqual({
        accessToken: 'signed-token',
        user: {
          id: 'user-1',
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
      });
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('rejects an invalid password without issuing a token', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        passwordHash,
      });

      await expect(
        service.login({
          email: 'jane@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('rejects an unknown email without revealing which field was wrong', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'nobody@example.com',
          password,
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('returns only the authenticated user fields', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
      });

      await expect(service.getUserById('user-1')).resolves.toEqual({
        id: 'user-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
      });
    });

    it('rejects when the user no longer exists', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserById('missing-user')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });
});
