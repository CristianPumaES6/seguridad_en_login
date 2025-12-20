
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    passwordHash: 'hashedpassword',
    profileImagePath: null,
};

const mockUsersRepository = {
    find: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockImplementation((options) => {
        if (options.where.id === 1 || options.where.email === 'test@example.com') {
            return Promise.resolve(mockUser);
        }
        return Promise.resolve(null);
    }),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((user) => Promise.resolve({ id: 1, ...user })),
    remove: jest.fn().mockResolvedValue(mockUser),
};

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUsersRepository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should find all users', async () => {
        const users = await service.findAll();
        expect(users).toEqual([mockUser]);
        expect(mockUsersRepository.find).toHaveBeenCalled();
    });

    it('should find one user by id', async () => {
        const user = await service.findOne(1);
        expect(user).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
        await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should update user password', async () => {
        const updateDto = { password: 'newPassword123' };
        const savedUser = await service.update(1, updateDto, 1);
        expect(savedUser.passwordHash).not.toEqual('hashedpassword'); // Should be re-hashed
        expect(mockUsersRepository.save).toHaveBeenCalled();
    });
});
