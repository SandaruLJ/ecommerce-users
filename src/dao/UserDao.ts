import { Logger } from '../loaders/logger';
import { IUser } from '../interfaces/IUser';
import User from '../models/User';

export class UserDao {
    private logger = Logger.getInstance();
    public static instance: UserDao = null;

    public static getInstance(): UserDao {
        if (this.instance === null) {
            this.instance = new UserDao();
        }

        return this.instance;
    }

    public async save(request: IUser) {
        this.logger.info('UserDao - save()');
        const user = new User(request);

        return await user.save()
            .then(data => {
                this.logger.info(`User ${data.firstname} ${data.lastname} Inserted Successfully`);
                return data;
            })
            .catch(error => {
                this.logger.error('Error in inserting user' + error.message);
                throw error;
            });
    }

    public async getAll() {
        this.logger.info('UserDao - getAll()');

        return await User.find({})
            .then(data => {
                if (data.length > 0) {
                    this.logger.info('Users Retrieved Successfully');
                } else {
                    this.logger.error('Users Not Found');
                }

                return data;
            })
            .catch(error => {
                this.logger.error('Error in retrieving users' + error.message);
                throw error;
            });
    }

    public async getById(id: String) {
        this.logger.info('UserDao - getById()');

        return await User.findById(id)
            .then(data => {
                if (data) {
                    this.logger.info(`${data.firstname} ${data.lastname} User Retrieved Successfully`);
                    return data;
                } else {
                    this.logger.info(`User ${id} Not Found`);
                    return { msg: 'User Not Found' };
                }
            })
            .catch(error => {
                this.logger.error(`Error in retrieving user ${id} ${error.message}`);
                throw error;
            });
    }

    public async update(id: String, user: IUser) {
        this.logger.info('UserDao - update()');

        return await User.findByIdAndUpdate(id, {$set: user}, {new: true})
            .then(data => {
                if (data) {
                    this.logger.info(`${data.firstname} ${data.lastname} User Updated Successfully`);
                    return data;
                } else {
                    this.logger.info(`User ${id} Not Found`);
                    return { msg: 'User Not Found' };
                }
            })
            .catch(error => {
                this.logger.error(`Error in updating user ${id} ${error.message}`);
                throw error;
            });
    }

    public async updateStatus(id:string,status:string){
        this.logger.info("UserDao - updateStatus()");
        return await User.findByIdAndUpdate(id,{$set:{status:status}},{new:true})
            .then(data=>{
                if(data){
                    this.logger.info(`${data.firstname} ${data.lastname} User Status Updated Successfully to ${status}`);
                    return data;
                }else{
                    this.logger.info(`User ${id} Not Found`);
                    return {msg:"User Not Found"};
                }
            })
            .catch(error=>{
                this.logger.error(`Error in updating user ${id} ${error.message}`);
                throw error;
            })
    }

    public async delete(id: String) {
        this.logger.info('UserDao - delete()');

        return await User.findByIdAndDelete(id)
            .then(data => {
                if (data) {
                    this.logger.info(`${data.firstname} ${data.lastname} User Deleted Successfully`);
                    return data;
                } else {
                    this.logger.info(`User ${id} Not Found`);
                    return {msg: 'User Not Found'};
                }
            })
            .catch(error => {
                this.logger.error(`Error in deleting user ${id} ${error.message}`);
                throw error;
            })
    }
}
