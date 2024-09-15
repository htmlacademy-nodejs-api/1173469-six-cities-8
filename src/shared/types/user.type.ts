import { UserType } from './index.js';

export type User = {
    name: string; // 1 - 15 символов
    email: string;
    avatarPath?: string; // Изображение .jpg или .png
    password: string; // 6 - 12 символов
    type: UserType;
};
