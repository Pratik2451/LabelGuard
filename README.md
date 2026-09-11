# 💰 Expense Manager REST API

A RESTful API for managing personal expenses with secure user authentication. Built using **Node.js**, **Express.js**, and **MongoDB Atlas**, this project allows users to register, log in, and securely manage their expenses using JWT-based authentication.

---

## 🌐 Live API

**Base URL**

https://expense-manager-api-gkx8.onrender.com

**Example Endpoint**

```http
POST https://expense-manager-api-gkx8.onrender.com/api/v1/user/register
```

> **Note:** This project is hosted on **Render's Free Tier**. The first request after a period of inactivity may take **30–60 seconds** while the server wakes up.

---

## 🚀 Features

### 🔐 User Authentication

- User Registration
- User Login
- User Logout
- Refresh Access Token
- JWT Authentication
- Password Hashing using bcrypt

### 💸 Expense Management

- Create Expense
- Update Expense
- Delete Expense
- View Logged-in User's Expenses

### ⚙️ Other Features

- Protected Routes using JWT Middleware
- Cookie-based Authentication
- Standardized API Responses
- Environment Variable Support
- MongoDB Atlas Integration

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Authentication

- JSON Web Token (JWT)
- bcrypt

### Other Packages

- dotenv
- cookie-parser
- cors
- Nodemon

---

## 📂 Project Structure

```text
backend/
│
├── src/
│   ├── controllers/
│   │   ├── expense.js
│   │   └── user.controller.js
│   │
│   ├── db/
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── expense.model.js
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   ├── expense.routes.js
│   │   └── user.routes.js
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── AsyncHandler.js
│   │   └── constants.js
│   │
│   └── server.js
│
├── app.js
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/Pratik2451/Expense-Manager.git
```

### Navigate to the Project Folder

```bash
cd Expense-Manager/backend
```

### Install Dependencies

```bash
npm install
```

### Create a `.env` File

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
```

### Run the Development Server

```bash
npm run dev
```

### Run in Production

```bash
npm start
```

The server will run on:

```text
http://localhost:5000
```

---

## 📌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/user/register` | Register a new user |
| POST | `/api/v1/user/login` | Login user |
| POST | `/api/v1/user/logout` | Logout user *(Protected)* |
| POST | `/api/v1/user/refresh-access-token` | Generate a new access token |

---

### Expense

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/expense/create-expense` | Create a new expense *(Protected)* |
| PATCH | `/api/v1/expense/:expenseId` | Update an existing expense *(Protected)* |
| DELETE | `/api/v1/expense/:expenseId` | Delete an existing expense *(Protected)* |
| GET | `/api/v1/expense/getmyexpenses` | Get all expenses of the logged-in user *(Protected)* |

---

## 🔐 Authentication

Protected routes require a valid JWT Access Token.

Example Header:

```http
Authorization: Bearer <your_access_token>
```

---

## 🧪 Example Request

### Register User

```http
POST /api/v1/user/register
```

Request Body

```json
{
  "email": "john@example.com",
  "username": "john123",
  "password": "12345678"
}
```

---

## 📦 Dependencies

```
bcrypt
cookie-parser
cors
dotenv
express
jsonwebtoken
mongoose
nodemon
```

---

## 📜 Available Scripts

### Start the Development Server

```bash
npm run dev
```

### Start the Production Server

```bash
npm start
```

---

## 🧪 Testing

You can test the API using:

- Thunder Client
- Postman
- Insomnia
- cURL

**Base URL**

```text
https://expense-manager-api-gkx8.onrender.com
```

---

## 🌐 Deployment

The API is successfully deployed on **Render**.

Live URL:

```text
https://expense-manager-api-gkx8.onrender.com
```

---

## 🚧 Future Features

Future enhancements and additional features will be added as the project evolves.

---

## 👨‍💻 Author

**Pratik Munde**

GitHub: https://github.com/Pratik2451

---

## 📄 License

This project is licensed under the ISC License.
