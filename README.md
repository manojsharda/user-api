# user-api
This project demonstrates how to set up a user authentication API using JSON Web Tokens. There are several endpoints exposed in the sample, including user login and signup,  update and logout.
#Installation and Running the App
Clone the repo, then:
npm install
npm start
The app will be served at localhost:3000.
#Local Setup
To setup the API locally, you will need to run MongoDB instance. And new configure
/server/config/config.json file with following parameters like below.

{
  "test": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://localhost:27017/UserAppTest",
    "JWT_SECRET": "poijasdf98435jpgfdpoij3"
  },
  "development": {
    "PORT": 3000,
    "MONGODB_URI": "mongodb://localhost:27017/UserApp",
    "JWT_SECRET": "pojiaj234oi234oij234oij4"
  }
}

#Available Routes
#### **POST** `/users`
*	Used for signing up a user. Returns a JWT in response header (x-auth).
*  Sample request:
    {
	"email":"abc@example.com",
	"password":"password123",
	"firstName":"firstName",
	"lastName":"lastName",
	"dateOfBirth":"2000-05-05",
	"address":[{
	"addrType":"Office",
	"addrText":"Unit 1,XYZ street, CBD, NSW 2000"
	},{
	"addrType":"Home",
	"addrText":"Unit 1,XYZ street, Castle Hill, NSW 2000"
	}]
    }
*  Sample Response: 200 OK
    {
    "_id": "59f41c0f73e2a00e908cf4b6",
    "email": "abc@example.com",
    "firstName": "firstName",
    "lastName": "lastName",
    "dateOfBirth": "2000-05-05T00:00:00.000Z",
    "address": [
        {
            "addrType": "Office",
            "addrText": "Unit 1,XYZ street, CBD, NSW 2000",
            "_id": "59f41c0f73e2a00e908cf4b8"
        },
        {
            "addrType": "Home",
            "addrText": "Unit 1,XYZ street, Castle Hill, NSW 2000",
            "_id": "59f41c0f73e2a00e908cf4b7"
        }
    ]
    }

#### **POST** `/users/login`
*	Used for logging a user in. Accepts email and password to authenticate a user. Returns a User along with JWT in the response (x-auth).
*	Sample Request:
    {
	"email":"xyz@example.com",
	"password":"password123"
    }
*   Sample Response: 200 OK
    {
    "_id": "59f41b4f73e2a00e908cf4b0",
    "email": "xyz@example.com",
    "firstName": "firstName",
    "lastName": "lastName",
    "dateOfBirth": "2000-05-05T00:00:00.000Z",
    "address": [
        {
            "addrType": "Home",
            "addrText": "Unit 1, XYZ street, Parramatta, NSW 2150",
            "_id": "59f41b4f73e2a00e908cf4b1"
        }
    ]
    } 
#### **GET** `/users/me`
*	Returns all current authenticated login user. Requires a valid JWT (x-auth).
*	Sample Request
*   Header: x-auth :<JWT Token>
*	Sample Response: 200 OK
    {
    "_id": "59f41b4f73e2a00e908cf4b0",
    "email": "xyz@example.com",
    "firstName": "firstName",
    "lastName": "lastName",
    "dateOfBirth": "2000-05-05T00:00:00.000Z",
    "address": [
        {
            "addrType": "Home",
            "addrText": "Unit 1,XYZ street, Parramatta, NSW 2150",
            "_id": "59f41b4f73e2a00e908cf4b1"
        }
    ]
    }
#### **PATCH** `/users/{id}`
*	Updates a user. Requires a valid JWT (x-auth).
*	Sample Request:
*   Header: x-auth :<JWT Token>
    {
    "firstName": "firstName111",
    "lastName": "lastName111",
    "dateOfBirth": "2008-08-11T00:00:00.000Z",
    "address": [
        {
            "addrType": "Home",
            "addrText": "Unit 1,XYZ street, Parramatta, NSW 2150"
        }
    ]
    }
* Sample Response: 200 OK
    {
    "user": {
        "_id": "59f41b4f73e2a00e908cf4b0",
        "email": "xyz@example.com",
        "firstName": "firstName111",
        "lastName": "lastName111",
        "dateOfBirth": "2008-08-11T00:00:00.000Z",
        "address": [
            {
                "addrText": "Unit 1,XYZ street, Parramatta, NSW 2150",
                "addrType": "Home",
                "_id": "59f4448ec282323ac0deb536"
            }
        ]
    }
    }
#### **DELETE** `/users/me/token`
* Logout the Current Logged in. Requires a valid JWT (x-auth).
