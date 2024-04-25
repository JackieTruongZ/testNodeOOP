import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import baseController from '@/base/base.controller';

class UsersController extends baseController<User, CreateUserDto> {
  protected service: userService;

  constructor() {
    super();
    this.service = new userService();
  }

  
}

export default UsersController;
