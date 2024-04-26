import BaseQuery from "@/base/base.query";
import { CreateUserDto } from "@/dtos/users.dto";
import { User } from "@/interfaces/users.interface";

class UserQuery extends BaseQuery<User, CreateUserDto> {
    protected collectionName: string = 'users';
    protected attributeBase: string = 'email';
    protected listAttribute: string[] = ['email', 'password'];
}

export default UserQuery;