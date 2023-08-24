import jwt from 'jsonwebtoken';
import { appConfig } from '../../constant/appConfiguration';

export interface USER_JWT {
    id: number;
    email?: string;
    userName: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    address?: string;
    avatarURL?: string;
    isActive: boolean;
    role: number;
}

export const generateJWT = (user: USER_JWT) => {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign(
        {
            ...user,
            exp: parseInt((expirationDate.getTime() / 1000) as any, 10),
        },
        appConfig.secretSign
    );
};
