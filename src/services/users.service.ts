import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { db } from '@/databases/db';
import { ObjectId } from 'mongodb';
import BaseService from '@/base/base.service';
import UserQuery from '@/query/users.query';

class UserService extends BaseService<User, CreateUserDto> {

  protected collectionName: string = 'users';
  protected nameBase: string = 'User';
  protected attributeBase: string = 'email';
  protected listAttribute: string[] = ['email', 'password'];


  protected query: UserQuery;

  constructor() {
    super();
    this.query = new UserQuery();
  }

}

export default UserService;
