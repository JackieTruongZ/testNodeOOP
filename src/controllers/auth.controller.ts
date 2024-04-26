import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { log } from 'console';

const passport = require("passport");

class AuthController {

  public authService = new AuthService();

  // public signUp = async (req: Request, res: Response, next: NextFunction) => {
  //   // const {db} = req.app.db;
  //   try {
  //     const userData: CreateUserDto = req.body;
  //     const signUpUserData: User = await this.authService.signup(userData);

  //     res.status(201).json({ data: signUpUserData, message: 'signup' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public logIn = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const userData: CreateUserDto = req.body;
  //     const { cookie, findUser } = await this.authService.login(userData);

  //     res.setHeader('Set-Cookie', [cookie]);
  //     res.status(200).json({ data: findUser, message: 'login' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  //   try {
  //     const userData: User = req.user;
  //     const logOutUserData: User = await this.authService.logout(userData);

  //     res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
  //     res.status(200).json({ data: logOutUserData, message: 'logout' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  googleLogout(req: any, res: Response, next: NextFunction) {
    req.logout((err: any) => {
      if (err) {
        return next(err);
      }
      res.redirect("http://localhost:3000/");
    });
  }

  googleCallBack(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("google", {
      successRedirect: "http://localhost:3000",
      failureRedirect: "/login/failed",
    })
  }

  google(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  }

  loginFail(req: Request, res: Response, next: NextFunction) {
    res.status(401).json({
      error: true,
      message: "Log in failure",
    });
  }

  loginSuccess(req: RequestWithUser, res: Response, next: NextFunction) {
    if (req.user) {
      res.status(200).json({
        error: false,
        message: "Successfully Loged In",
        user: req.user,
      });
    } else {
      res.status(403).json({ error: true, message: "Not Authorized" });
    }
  }

}

export default AuthController;
