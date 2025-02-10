import { UserService } from '../services/user-service';
import { UserRepository } from '../repositories/user-repository';
import { User } from '../models/user-model';

jest.mock('../repositories/user-repository');
jest.mock("nanoid", () => ({ nanoid: jest.fn() }));

describe('getAllUsers', () => {
    let userService: UserService;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepository = new UserRepository() as jest.Mocked<UserRepository>;
        userService = new UserService(userRepository);
    });

    it('should return all users', async () => {
        const users: User[] = [
            {
                id: 'user1',
                organizationId: null,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'hashedPassword123',
                type: 'invited',
                createdAt: new Date(),
                updatedAt: new Date(),
                active: true,
                authenticated: false
            },
            {
                id: 'user2',
                organizationId: null,
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                password: 'hashedPassword123',
                type: 'invited',
                createdAt: new Date(),
                updatedAt: new Date(),
                active: true,
                authenticated: false
            }
        ];

        userRepository.findAll.mockResolvedValue(users);

        const result = await userService.getAllUsers();

        expect(result).toEqual(users);
    });

    it('should return an empty array if no users are found', async () => {
        userRepository.findAll.mockResolvedValue([]);

        const result = await userService.getAllUsers();

        expect(result).toEqual([]);
    });
});
