import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};

export const generatePassword = () => {
    return crypto.randomBytes(20).toString('hex');
};
