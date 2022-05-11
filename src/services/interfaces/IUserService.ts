import { IUser } from '../../interfaces/IUser';

export interface IUserService {
    createUser(request: IUser): Promise<IUser>;
    getAllUsers(): Promise<IUser[]>;
    getUserById(id: String): Promise<IUser | Object>;
    updateUser(id: String, user: IUser): Promise<IUser | Object>;
    updateUserStatus(id: string, status: string): Promise<IUser | Object>;
    deleteUser(id: String): Promise<IUser | Object>;
}
