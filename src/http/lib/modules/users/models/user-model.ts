export interface User {
    id: string;
    organizationId: string | null;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    type: 'admin' | 'staff' | 'root' | 'invited';
    active: boolean;
    authenticated: boolean;
    createdAt: Date;
    updatedAt: Date;
}
