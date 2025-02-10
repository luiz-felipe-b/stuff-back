export interface IAccessRepository {
    createAccess(data: {email: string, password: string, publicId: string, userId: number}): Promise<any>;
}
