import * as express from "express";
import UserController from '../controllers/UserController';
import LoginController from '../controllers/LoginController';
import {multerMiddleWare} from "../middleware/multer";

export default function setRoutes(app:any){

  const router = express();
  const userControl = new UserController();
  const loginControl = new LoginController();

  app.use("/api",router);

  // User Routes
  router.route('/users').post(multerMiddleWare({type:'single', path:'user'}), userControl.createUser);
  router.route('/users').get(userControl.getAllUsers);
  router.route('/users/:id').get(userControl.getUserById);
  router.route("/users/status").put(userControl.updateUserStatus);
  router.route('/users/:id').put(multerMiddleWare({type:'single', path:'user'}), userControl.updateUser);
  router.route('/users/:id').delete(userControl.deleteUser);
  router.route('/users/image/:name').get(userControl.getUserAvatar);
  router.route('/users/change-password/:id').put(userControl.updateUserPassword);
  
  // Login Routes
  router.route('/users/login').post(loginControl.authenticate);
}