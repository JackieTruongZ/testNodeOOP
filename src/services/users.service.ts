import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { db } from '@/databases/db';
import { ObjectId } from 'mongodb';

class UserService {

  public async findAllUser(): Promise<User[]> {
    const users: User[] = await db.collection<User>('users').find().toArray();
    return users;
  }

  public async findUserById(userId: string): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, "UserId is empty");

    const findUser: User = await db.collection<User>('users').findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: User = await db.collection<User>('users').findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: any = await db.collection<CreateUserDto>('users').insertOne({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    if (userData.email) {
      const findUser: User = await db.collection<User>('users').findOne({ email: userData.email });
      if (findUser && findUser._id != userId) throw new HttpException(409, `This email ${userData.email} already exists`);
    }

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    //======================
    const findUser = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    let updatedUser: any;
    if (findUser) {
      // Update the user's data
      updatedUser = { ...findUser, ...userData };

      // Update the user in the database
      await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: updatedUser });

    } else {
      // User not found
      throw new HttpException(409, "User doesn't exist");
    }
    //======================
    return updatedUser;
  }

  public async deleteUser(userId: string): Promise<User> {
    //======================
    const findUser = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    let result: any;
    if (findUser) {
      // Delete User
      result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

    } else {
      // User not found
      throw new HttpException(409, "User doesn't exist");
    }
    //======================
    return result;
  }
}

export default UserService;
