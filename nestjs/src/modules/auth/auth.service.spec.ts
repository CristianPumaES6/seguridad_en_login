
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    passwordHash: '$2b$10$C8.1.1.1.1.1.1.1.1.1.1', // Mock hash
};

const mockUsersRepository = {
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockResolvedValue(mockUser),
};

const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_access_token'),
};

describe('AuthService', () => {
    let service: AuthService;
    let repo: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUsersRepository,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        repo = module.get(getRepositoryToken(User));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register a new user', async () => {
        repo.findOne.mockResolvedValue(null);
        (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

        const result = await service.register({
            name: 'New User',
            email: 'new@example.com',
            password: 'password123',
        });
        expect(result).toEqual({ message: 'User registered successfully' });
        expect(repo.save).toHaveBeenCalled();
    });

    it('should throw conflict if email exists', async () => {
        repo.findOne.mockResolvedValue(mockUser);
        await expect(
            service.register({
                name: 'New User',
                email: 'test@example.com',
                password: 'password123',
            }),
        ).rejects.toThrow(ConflictException);
    });

    it('should login with valid credentials', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        repo.findOne.mockResolvedValue(mockUser);

        const result = await service.login({
            email: 'test@example.com',
            password: 'validpassword',
        });

        expect(result).toHaveProperty('access_token');
        expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should throw unauthorized with invalid password', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);
        repo.findOne.mockResolvedValue(mockUser);

        await expect(
            service.login({
                email: 'test@example.com',
                password: 'wrongpassword',
            }),
        ).rejects.toThrow(UnauthorizedException);
    });
});
