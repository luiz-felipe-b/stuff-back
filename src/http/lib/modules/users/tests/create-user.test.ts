import { UserService } from '../services/user-service';
import { UserRepository } from '../repositories/user-repository';
import { hashPassword } from '../../../util/hash-password';
import { nanoid } from 'nanoid';
import { User } from '../models/user-model';

jest.mock('../repositories/user-repository');
jest.mock('../../../util/hash-password', () => ({ hashPassword: jest.fn() }));
jest.mock("nanoid", () => ({ nanoid: jest.fn() }));

describe('createUser', () => {
    let userService: UserService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        userService = new UserService(userRepository);
    });

    it('should create a user successfully', async () => {
        const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'active' | 'authenticated'> = {
            organizationId: null,
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@example.com',
            password: 'password123',
            type: 'invited',
        };
        (hashPassword as jest.Mock).mockResolvedValue('hashedPassword123');
        (nanoid as jest.MockedFunction<typeof nanoid>).mockReturnValue('uniqueId123');
        userRepository.findByEmail.mockResolvedValue(null);
        userRepository.create.mockResolvedValue({
            id: 'uniqueId123',
            organizationId: userData.organizationId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: 'hashedPassword123',
            type: userData.type,
            createdAt: new Date(),
            updatedAt: new Date(),
            active: true,
            authenticated: false
        });

        const result = await userService.createUser({ body: userData } as any);

        expect(result).toHaveProperty('id', 'uniqueId123');
        expect(result.email).toBe(userData.email);
    });

    it('should throw an error if email is already taken', async () => {
        const userData: User = {
            id: 'uniqueId123',
            organizationId: null,
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@example.com',
            password: 'hashedPassword123',
            type: 'invited',
            createdAt: new Date(),
            updatedAt: new Date(),
            active: true,
            authenticated: false
        };

        userRepository.findByEmail.mockResolvedValue(userData);

        await expect(userService.createUser({ body: userData } as any)).rejects.toThrow('User already exists');
    });

    it('should not create a user if the required fields are missing', async () => {
        const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'active' | 'authenticated' | 'password'> = {
            organizationId: null,
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@example.com',
            type: 'invited'
        }

        await expect(userService.createUser({ body: userData } as any)).rejects.toThrow('Missing or invalid parameters');
    });
});
