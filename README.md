# Api Users
![GitHub](https://img.shields.io/github/license/PabloFerrari013/apiUsers)
## 💻 About the project
Api users consists of an application of creating, editing and removing users in the database, in addition to routes for password recovery using email sending
## 🧪 Technologies used
- Javascript
- Express
- json web token
- Bcrypt
- uuid
- Knex js
- MySQL
## 🔥 How to run the project
Clone the project and access the project folder.
```bash
$ git clone https://github.com/PabloFerrari013/apiUsers
$ cd apiUsers
```
To start it, follow the steps below:
```bash
# Install as dependencies
$ yarn 

# Start the project
yarn dev
```
The app is available in your browser at http://localhost:4000.\
Rememberthat you will need to create a database with the crud name on your MySQl, in addition to creating your appropriate tables: users and tokens.\
Also create a. ENV with the variables:
```txt
SECRET="contains the secret key of the json web token",
PASS="contains your connection password as the database",
PORT=4000
```
---
Made with ❤️ by Pablo Ferrari 🤟🏽 [Linkedin](https://www.linkedin.com/in/pablo-ferrari-32bb7a1a8/)
