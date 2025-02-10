export interface RefreshToken {
    id: string,
    userId: string,
    token: string,
    revoked: boolean,
    expiresAt: Date,
    createdAt: Date,
}
