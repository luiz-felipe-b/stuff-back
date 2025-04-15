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

    it('should return uer if id is found', async () => {
        const user: User = {
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
        };

        userRepository.findById.mockResolvedValue(user);

        const result = await userService.getUserById({ params: { id: 'user1' } } as any);

        expect(result).toEqual(user);
    });

    it('should return null if id is not found', async () => {
        userRepository.findById.mockResolvedValue(null);

        const result = await userService.getUserById({ params: { id: 'nonexistentId' } } as any);

        expect(result).toBeNull();
    });
});
