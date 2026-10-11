<a href="https://whispr-messanger-backend.onrender.com"><img align="right" src="./backend-button.svg" width="140" alt="Live Backend" /></a>
### Whispr Messanger Backend 
<em>Secure real-time messaging API for a modern chat application, built with Express, MongoDB, Socket.IO, and TypeScript.</em>


<p align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js" />
  &nbsp;
  <img src="https://img.shields.io/badge/Express-222222?style=flat&logo=express&logoColor=white" alt="Express" />
  &nbsp;
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  &nbsp;
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white" alt="MongoDB" />
  &nbsp;
  <img src="https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socketdotio&logoColor=white" alt="Socket.IO" />
  &nbsp;
  <img src="https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  &nbsp;
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white" alt="Zod" />
</p>

<hr />

### 🚀 About the project

**Whispr Messanger Backend** powers the secure API for the real-time chat platform. It handles user registration, login, cookie-based authentication, one-to-one messaging, online presence, conversation management, and live message delivery using Socket.IO.

### ✨ Features

<table>
  <tr>
    <td valign="top">

- ✅ User registration and login
- ✅ JWT-based cookie authentication
- ✅ Protected profile and user lookup APIs
- ✅ Search users by phone number
- ✅ One-to-one messaging between users
- ✅ Conversation listing with unread counts

</td>
    <td valign="top">

- ✅ Real-time message delivery with Socket.IO
- ✅ Typing and online/offline presence updates
- ✅ Mark messages as delivered or read
- ✅ Edit and delete sent messages
- ✅ Delete a full conversation for the current user
- ✅ MongoDB-based persistence with validation and structured error handling

</td>
  </tr>
</table>


### 🛠️ Tech Stack

| Backend | Database | Auth & Real-time | Tools & Utilities |
|:-------:|:--------:|:----------------:|:-----------------:|
| Node.js, Express.js, TypeScript | MongoDB, Mongoose | JWT, Socket.IO, bcryptjs, Zod | CORS, Cookie Parser, dotenv, tsx |

### 🚀 Getting Started

<table>
  <tr>
    <td valign="top" width="40%">

#### Prerequisites

- **Node.js** (v18+)
- **npm** (v9+)
- **MongoDB** running locally or via MongoDB Atlas
- **Frontend app** configured with the backend CORS origins

#### ⚙️ Environment Variables

Create a `.env` file in the project root and add your own values:

```env
PORT=3030
MONGO_URI=mongodb://localhost:27017/whispr-messenger
JWT_SECRET=your_own_jwt_secret
NODE_ENV=development
```

> 💡 The app already includes the frontend origins in the backend configuration, so `CORS_ORIGINS` is optional unless you want to override them. Replace the values above with your own local or deployed configuration. Never commit your `.env` file.

</td>
    <td valign="top" width="60%">

#### Installation

1. Clone the repository

```bash
   git clone https://github.com/NEELSAMEL19/Whispr_Messanger_Backend.git
   cd Whispr_Messanger_Backend
```

2. Install dependencies

```bash
   npm install
```

3. Start the development server

```bash
   npm run dev
```

4. Build for production

```bash
   npm run build
   npm start
```

</td>
  </tr>
</table>

### 🔗 API Endpoints (Base URL: `/api`)

<table>
  <tr>
    <td valign="top" width="60%">

| Method | Endpoint | Description | Auth Required |
|:------:|----------|-------------|:-------------:|
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Login user and set JWT cookie | No |
| `POST` | `/auth/logout` | Clear auth cookie | Yes |
| `GET` | `/auth/profile` | Get currently authenticated user | Yes |
| `GET` | `/auth/users` | Search users by phone number | Yes |
| `GET` | `/messages/conversations` | Get all conversations for the logged-in user | Yes |
| `GET` | `/messages/:userId` | Get chat history with a specific user | Yes |
| `POST` | `/messages/:userId` | Send a message to a user | Yes |
| `PATCH` | `/messages/:userId/read` | Mark a conversation as read | Yes |
| `PATCH` | `/messages/message/:messageId` | Edit a sent message | Yes |
| `DELETE` | `/messages/message/:messageId` | Delete a sent message | Yes |
| `DELETE` | `/messages/:userId` | Delete a conversation for the current user | Yes |

</td>
    <td valign="top" width="40%">

#### 📁 Project Structure

```text
Whispr_Messanger_Backend/
├── src/                                  # Application source code
│   ├── app.ts                            # Express app setup and CORS
│   ├── server.ts                         # Server entry point and Socket.IO setup
│   ├── common/                           # Shared utilities and middleware
│   │   ├── middlewares/                  # Auth and error middleware
│   │   └── utils/                        # Token, async handler, app error helpers
│   ├── config/                           # Database configuration
│   ├── models/                           # Mongoose schemas for User and Message
│   └── modules/                          # Auth and messaging feature modules
│       ├── auth/                         # Login, register, profile, user search logic
│       └── messages/                     # Messaging routes, controller, and socket events
├── dist/                                 # Compiled output
├── .env                                  # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
└── backend-button.svg
```

</td>
  </tr>
</table>

<table>
  <tr>
    <td valign="top" width="50%">

#### 👥 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for new chat features, bug fixes, or API enhancements.

</td>
    <td valign="top" width="50%">

#### 📄 License

This project is licensed under the [MIT License](LICENSE).

</td>
  </tr>
</table>


Made with ❤️ by [Neel Samel](https://github.com/NEELSAMEL19)
