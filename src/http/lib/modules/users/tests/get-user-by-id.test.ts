import { UserService } from '../services/users-service';
import { UserRepository } from '../repositories/users-repository';
import { User } from '../models/user-model';
import { HttpError } from '../../../util/errors/http-error';

jest.mock('../repositories/users-repository');
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

    it('should throw an error when user not found', async () => {
        userRepository.findById.mockResolvedValue(null);

        await expect(userService.getUserById({ params: { id: 'nonexistentId' } } as any))
            .rejects.toThrow(new HttpError('User not found', 404));
    });
});
