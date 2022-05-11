import { Logger } from '../loaders/logger';
import { IUser } from '../interfaces/IUser';
import { IUserService } from '../services/interfaces/IUserService';
import { UserService } from '../services/UserService';
import { ILogin } from '../interfaces/ILogin';
import { ILoginService } from '../services/interfaces/ILoginService';
import { LoginService } from '../services/LoginService';
import * as autoBind from 'auto-bind';
import * as mime from 'mime';
import * as fs from 'fs';

const bcrypt =  require('bcrypt');

export default class UserController {
    private logger: Logger;
    private userService: IUserService;
    private loginService: ILoginService;

    constructor() {
        this.logger = Logger.getInstance();
        this.userService = UserService.getInstance();
        this.loginService = LoginService.getInstance();
        autoBind(this);
    }

    public async createUser(req: any, res: any) {
        this.logger.info('UserController - createUser()');

        let user: IUser;
        let login: ILogin;

        if (req.body) {
            user = JSON.parse(req.body.data);
            login = JSON.parse(req.body.data);
        }

        if (user) {
            if (req.file) {
                user.avatar = req.file.filename;
            }

            await this.userService.createUser(user)
                .then(async data => {
                    if (data._id) {
                        // Set user ID as corresponding login ID
                        login._id = data._id.toString();
                        // Set user type
                        login.type = 'user';
                        // Encrypt password
                        login.password = bcrypt.hashSync(login.password, 8);

                        await this.loginService.createLogin(login)
                            .then(() => {
                                res.status(200).send(data);
                            })
                            .catch(error => {
                                this.logger.error(error.message);
                                res.status(500).send({ err: error.message });
                            });
                    }
                })
                .catch(error => {
                    this.logger.error(error.message);
                    res.status(500).send({ err: error.message });
                });
        }
    }

    public async getAllUsers(req: any, res: any) {
        this.logger.info('UserController - getAllUsers()');

        await this.userService.getAllUsers()
            .then(data => {
                res.status(200).send(data);
            })
            .catch(error => {
                this.logger.error(error.message);
                res.status(500).send({ err: error.message });
            });
    }

    public async getUserById(req: any, res: any) {
        this.logger.info('UserController - getUserById()');
        
        const id = req.params.id;

        await this.userService.getUserById(id)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(error => {
                this.logger.error(error.message);
                res.status(500).send({ err: error.message });
            });
    }

    public async updateUser(req: any, res: any) {
        this.logger.info('UserController - updateUser()');
        
        let user: IUser;
        let login: ILogin;

        const id = req.params.id;
        
        if (req.body) {
            user = JSON.parse(req.body.data);
            login = JSON.parse(req.body.data);
        }

        if (user) {
            if (req.file) {
                user.avatar = req.file.filename;
            }

            await this.userService.updateUser(id, user)
                .then(async data => {
                    if ('_id' in data) {
                        // Encrypt password
                        if (login.password) {
                            login.password = bcrypt.hashSync(login.password, 8);
                        }

                        await this.loginService.updateLogin(id, login)
                            .then(() => {
                                res.status(200).send(data);
                            })
                            .catch(error => {
                                this.logger.error(error.message);
                                res.status(500).send({ err: error.message });
                            });
                    } else {
                        res.status(404).send(data);
                    }
                })
                .catch(error => {
                    this.logger.error(error.message);
                    res.status(500).send({ err:error.message });
                });
        }
    }

    public async updateUserStatus(req: any, res: any) {
        this.logger.info('UserController - updateUserStatus()');
        const id = req.body.id;
        const status = req.body.status;
        await this.userService.updateUserStatus(id,status)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(error => {
                this.logger.error(error.message);
                res.status(500).send({err: error.message});
            });
    }

    public async updateUserPassword(req: any, res: any) {
        this.logger.info('UserController - updateUserPassword()');
        
        if (req.body) {
            const id = req.params.id;
            const email = req.body.email;
            const currentPassword = req.body.currentPassword;
            const newPassword = req.body.newPassword;

            await this.loginService.getLogin(email, 'user')
                .then(data => {
                    if ('_id' in data) {
                        if (bcrypt.compareSync(currentPassword, data.password)) {
                            const login = {
                                email: email,
                                password: bcrypt.hashSync(newPassword, 8),
                                type: 'user'
                            }

                            this.loginService.updateLogin(id, login)
                                .then(() => {
                                    res.status(200).send(data);
                                })
                                .catch(error => {
                                    this.logger.error(error.message);
                                    res.status(500).send({ err: error.message });
                                });
                        } else {
                            res.status(401).send({ msg: 'Password invalid' });
                        }
                    } else {
                        res.status(404).send(data);
                    }
                })
                .catch(error => {
                    this.logger.error(error.message);
                    res.status(500).send({ err: error.message });
                })
        }
    }

    public async deleteUser(req: any, res: any) {
        this.logger.info('UserController - deleteUser()');

        const id = req.params.id;

        await this.loginService.deleteLogin(id).then(() => {
            this.userService.deleteUser(id)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(error => {
                this.logger.error(error.message);
                res.status(500).send({ err: error.message });
            });
        });
    }

    public async getUserAvatar(req: any, res: any) {
        this.logger.info('UserController - getUserAvatar()');

        // Define filename and path
        const filename = req.params.name;
        const path = `./public/uploads/images/user/${filename}`;
        
        // Create a mime-type and set it as the content type in the response header
        const mimeType = mime.lookup(path);
        res.contentType(mimeType)

        // Open the file as a readable stream and pipe it to the response object
        let readStream = fs.createReadStream(path);
        readStream.on('open', () => {
            readStream.pipe(res);
        });

        // Catch errors if they occur
        readStream.on('error', err => {
            Logger.getInstance().error(`Image ${filename} not found`);
            res.status(404).send(err);
        })
    }
}
