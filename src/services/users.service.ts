import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { db } from '@/databases/db';
import { ObjectId } from 'mongodb';
import baseService from '@/base/base.service';

class UserService extends baseService<User, CreateUserDto> {

  protected collectionName: string = 'users';
  protected nameBase: string = 'User';
  protected attributeBase: string = 'email';
  protected listAttribute: string[] = ['email', 'password'];

}

export default UserService;
