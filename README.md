**Install and run**

```bash
$ npm i
$ npm run dev
```

**API**

*Signup:*

* Method: POST
* URL: http://localhost:3000/signup
* Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
*Login:*

* Method: POST
* URL: http://localhost:3000/login
* Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

*Logout:*

* Method: POST
* URL: http://localhost:3000/logout

*Get All Users:*

* Method: GET
* URL: http://localhost:3000/users

*Get User By Id:*

* Method: GET
* URL: http://localhost:3000/users/:id

*Create User:*

* Method: POST
* URL: http://localhost:3000/users
* Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

*Update User:*

* Method: PUT
* URL: http://localhost:3000/users/:id
* Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

*Delete User:*

* Method: DELETE
* URL: http://localhost:3000/users/:id