import { IUser } from '../interfaces/IUser';
import { Logger } from '../loaders/logger';
import { IUserService } from './interfaces/IUserService';
import { UserDao } from '../dao/UserDao';

export class UserService implements IUserService {
    private logger = Logger.getInstance();
    public static instance: UserService = null;
    private userDao = UserDao.getInstance();

    public static getInstance(): UserService {
        if (this.instance === null) {
            this.instance = new UserService();
        }

        return this.instance;
    }

    public async createUser(request: IUser): Promise<IUser> {
        this.logger.info('UserService - createUser()');

        return await this.userDao.save(request)
            .then(data => {
                return data;
            })
            .catch(error => {
                this.logger.error(error.message);
                throw error;
            });
    }

    public async getAllUsers(): Promise<IUser[]> {
        this.logger.info('UserService - getAllUsers()');

        return await this.userDao.getAll()
            .then(data => {
                return data;
            })
            .catch(error => {
                this.logger.error(error.message);
                throw error;
            });
    }

    public async getUserById(id: String): Promise<IUser | Object> {
        this.logger.info('UserService - getUserById()');

        return await this.userDao.getById(id)
            .then(data => {
                return data;
            })
            .catch(error => {
                this.logger.error(error.message);
                throw error;
            });
    }

    public async updateUser(id: String, user: IUser): Promise<IUser | Object> {
        this.logger.info('UserService - updateUser()');

        return await this.userDao.update(id, user)
            .then(data => {
                return data;
            })
            .catch(error => {
                this.logger.error(error.message);
                throw error;
            });
    }

    public async updateUserStatus(id:string,status:string):Promise<IUser | Object>{
        this.logger.info("User Services - updateUserStatus()");
        return await this.userDao.updateStatus(id,status)
            .then(data=>{
                return data;
            })
            .catch(error=>{
                this.logger.error(error.message);
                throw error;
            })
    }

    public async deleteUser(id: String): Promise<IUser | Object> {
        this.logger.info('UserService - deleteUser()');

        return await this.userDao.delete(id)
            .then(data => {
                return data;
            })
            .catch(error => {
                this.logger.error(error.message);
                throw error;
            });
    }
}
