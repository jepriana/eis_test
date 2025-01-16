import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import { AuthConfig } from '../configs/auth.config'

export const TokenManager = {
    generateAccessToken: (payload: object) => jwt.sign(
        payload,
        AuthConfig.accessKey,
        {
            expiresIn: AuthConfig.accessAge,
        }
    ),
    generateRefreshToken: (payload: object) => jwt.sign(
        payload,
        AuthConfig.refreshKey,
        {
            expiresIn: AuthConfig.refreshAge,
        }
    ),
    generateResetToken: () => bcrypt.genSaltSync(20),
    verifyRefreshToken: (refreshToken: string) => {
        return jwt.verify(refreshToken, AuthConfig.refreshKey) as jwt.JwtPayload;
    },
    verifyAccessToken: (accessToken: string) => {
        return jwt.verify(accessToken, AuthConfig.accessKey) as jwt.JwtPayload;
    }
};
