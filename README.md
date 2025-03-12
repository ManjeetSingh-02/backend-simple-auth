# backend-simple-auth

- This project is a simple authentication backend built with Node.js and Express.
- It provides basic user authentication features such as registration, login, and token-based authentication using JWT (JSON Web Tokens).

## Project Structure

```
.
├── controllers
│   └── user.controller.js
├── index.js
├── models
│   └── User.model.js
├── package.json
├── README.md
├── routes
│   └── user.route.js
└── utils
    ├── db.js
    ├── email.js
    └── validate.js

5 directories, 9 files
```

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/ManjeetSingh-02/backend-simple-auth
   ```
2. Navigate to the project directory:
   ```sh
   cd backend-simple-auth
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```
4. Set up the environment variables by creating a `.env` file in the root directory, then copy the given content in that file, edit and add the necessary configurations.
   ```sh
    BASE_URL=http://127.0.0.1:3000
    PORT=3000
    NODE_ENV=development
    MONGO_URL=
    MAILTRAP_HOST=
    MAILTRAP_PORT=
    MAILTRAP_USERNAME=
    MAILTRAP_PASSWORD=
    MAILTRAP_SENDER_EMAIL=
    JWT_SECRET=shhhhh
    JWT_EXPIRES=24
    VERIFICATION_TOKEN_SIZE=32
    VERIFICATION_TOKEN_EXPIRES=300000
    RESET_TOKEN_SIZE=16
    RESET_TOKEN_EXPIRES=600000
   ```
5. Start the development server:
   ```sh
   npm run dev
   ```

## Auth Requests

The following endpoints are available for user authentication:

### Register a new user

- **URL:** `/api/v1/users/register`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Required:** `Name`, `Email`, `Password`

### Login a user

- **URL:** `/api/v1/users/login`
- **Method:** `POST`
- **Description:** Login a user.
- **Required:** `Email`, `Password`

### Verify user account

- **URL:** `/api/v1/users/verify/?token=`
- **Method:** `GET`
- **Description:** Verifies a user's account.
- **Required:** `Token` in `url-query`

### Get user details

- **URL:** `/api/v1/users/profile`
- **Method:** `GET`
- **Description:** Gives user details from user ID while logged-in.

### Forgot password

- **URL:** `/api/v1/users/forgot-password`
- **Method:** `POST`
- **Description:** Requests a password reset.
- **Required:** `Email`

### Reset password

- **URL:** `/api/v1/users/reset-password?token=`
- **Method:** `POST`
- **Description:** Resets the user's password.
- **Required:** `Token` in `url-query`, `New Password`

### Logout a user

- **URL:** `/api/v1/users/logout`
- **Method:** `GET`
- **Description:** Logout a user.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push to the branch.
5. Create a pull request.
