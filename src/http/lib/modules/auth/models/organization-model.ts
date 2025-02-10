export interface Organization {
    id: string;
    code: string;
    name: string;
    active: boolean;
    tier: 'bronze' | 'silver' | 'gold' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}
