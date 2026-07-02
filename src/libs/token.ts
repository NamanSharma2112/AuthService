import jwt from 'jsonwebtoken';

export function generateAccessToken(userId: string, role: "user" | "admin", tokenVersion: number) {

    const payload = {
        sub: userId,
        role: role,
        tokenVersion: tokenVersion,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
    return token;
}

export function createRefreshToken(userId: string, role: "user" | "admin", tokenVersion: number) {

    const payload = {
        sub: userId,
    
        tokenVersion: tokenVersion,
    };
    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
    return token;
}