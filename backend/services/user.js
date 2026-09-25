import User from '../models/user.js';
import { NotFoundError } from '../errors/notfound.js';

export const create = async (data) => {
    const user = await User.create(data);
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
};

export const index = async () => {
    const users = await User.find({}, { password: 0 });
    return users;
};

export const find = async (param, config) => {
    const user = await User.findOne(param, config);

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return user;
};

export const update = async (id, data) => {
    const user = await User.findByIdAndUpdate(id, data, {
        returnDocument: 'after',
        projection: {
            password: 0,
        },
    });

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return user;
};

export const remove = async (id) => {
    const user = await User.findByIdAndDelete(id, {
        projection: {
            password: 0,
        },
    });

    if (!user) {
        throw new NotFoundError('User not found');
    }

    return user;
}; 