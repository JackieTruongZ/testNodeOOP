import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import passport from 'passport';


class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.post(`${this.path}signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    // this.router.post(`${this.path}login`, validationMiddleware(CreateUserDto, 'body'), this.authController.logIn);
    // this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);
    this.router.get(`${this.path}/login/success`, this.authController.loginSuccess);
    this.router.get(`${this.path}/login/failed`, this.authController.loginFail);
    this.router.get(`${this.path}/google`, this.authController.google);
    this.router.get(`${this.path}/google/callback`, passport.authenticate("google", {
      successRedirect: "http://localhost:3000",
      failureRedirect: "/login/failed",
    }));
    this.router.get(`${this.path}/logout`, this.authController.googleLogout);

  }
}

export default AuthRoute;
