# Developers Mentorship Blog System

A modern, blog platform designed for developer mentorship with real-time features and secure authentication.

---

## 🚀 Features

### Core Features

- **Post**: Add, update, Read, and remove posts with instant synchronization
- **Secure Authentication**: JWT-based authentication with refresh tokens
- **Post Management**: Browse, search, and filter posts, view comments, replies and likes
- **Data Persistence**: Posts data persists on the database


### Technical Features

- **TypeScript**: Full type safety across backend
- **API-First**: RESTful API with proper error handling
- **Security**: JWT authentication, password hashing, rate limiting
- **Performance**: Optimized queries, caching, and efficient database indexing

---

## 🛠️ Tech Stack

### Backend

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB ODM
- **JWT** – Authentication tokens
- **bcryptjs** – Password hashing
- **Helmet** – Security middleware
- **CORS** – Cross-origin resource sharing
- **Redis** - For data caching

---

## 📁 Project Structure

```
├── src/                  # Node.js backend application
│   ├── controllers/      # Route logic and request handling
│   ├── middlewares/      # Express middleware functions
│   ├── models/           # Mongoose schemas and models
│   ├── routes/           # API route definitions
│   ├── services/         # Logic for various features
|   ├── database/         # mongodb configuration
|   ├── utils/            # General utility functions
|   ├── repositories/ 
|   ├── shared/ 
|   ├── config/ 
|   ├── app.ts 
└── README.md
└── doc.yaml
└── example.env
└── package.json
└── types/ 
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn
- Redis

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/salimkarbm/dmc.git
   ```

2. **Navigate to project directory**
   ```bash
   cd dmc
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

### Environment Setup

Create a `.env` file in the `server/` directory with the following variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | `3000` | No |
| `NODE_ENV` | Environment mode | `dev` | Yes |
| `DB_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | - | Yes |
| `JWT_ACCESS_TOKEN_SECRET` | Access token secret | - | Yes |
| `JWT_REFRESH_TOKEN_SECRET` | Refresh token secret | - | Yes |
| `JWT_ACCESS_TOKEN_EXPIRY` | Access token expiration time | `15m` | Yes |
| `JWT_REFRESH_TOKEN_EXPIRY` | Refresh token expiration time | `7d` | Yes |
| `CLOUDINARY_NAME` | cloudinary cloud name | - | Yes |
| `CLOUDINARY_API_KEY` | cloudinary cloud api key | - | Yes |
| `CLOUDINARY_API_SECRET` | cloudinary cloud api secret | `7d` | Yes |
| `BCRYPT_PASSWORD` | Bcrypt secret | -- | Yes |
| `SALT_ROUNDS` | Bcrypt salt round for hashing password  | - | Yes |

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Standard start
npm run start
```

---

## 🌐 Deployment

The API endpoints and documentation are available at: [localhost:{server_port}/api-docs](localhost:3000/api-doc)

### Backend Deployment

1. Set up your database with MongoDB Atlas or a local instance
2. Configure environment variables for your production environment
3. Deploy to platforms like Railway, Heroku, or AWS
4. Set up CI/CD pipeline for automated deployments

---

## 🎯 Key Features Implementation

- **Manage Posts**:Add, update, Read, and remove posts with instant synchronization .

- **Secure Authentication**: Implements JWT tokens with refresh mechanism. Passwords securely hashed with bcrypt, and all sensitive routes protected by middleware.

- **Manage comments**:Add, update, Read, and remove comments with instant synchronization.

- **Manage likes**: like and unlike post and view like counts for a post.

- **Manage replies**: Add and view replies to a comments.

- **Data Persistence**: All data stored in MongoDB with Mongoose schemas for validation and structured data. Indexed queries used for improved performance.

---

## 📁 Project Files & Security

### .gitignore Files

The project includes comprehensive .gitignore files to prevent sensitive files from being committed:

- **Root .gitignore**: Covers common files for the entire project
- **server/.gitignore**: Node.js/Express-specific ignores (node_modules, logs, etc.)

**Key Ignored Files:**
- Environment variables (`.env*`)
- Dependencies (`node_modules/`)
- Build outputs (`.next/`, `dist/`, `build/`)
- IDE files (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Logs and cache files
- SSL certificates and other sensitive data

---

## 🔧 Development

- **Code Quality**: TypeScript for type safety, ESLint for linting, Prettier for formatting
- **Testing**: Plans for unit tests, integration tests for API endpoints, and E2E testing with Jest ans Super 
- **Performance**: Optimized database queries, efficient state management, code splitting, lazy loading, and image optimization

---

## 🤝 Contributing

Contributions are currently not allowed ❌ but please feel free to submit issues and feature requests ✅

---

## 💬 Support

Give a ⭐ if you like this project!

---

## 📞 Stay in Touch

- **GitHub**: [@salimkarbm](https://github.com/salimkarbm)
- **LinkedIn**: [Salim Imuzai](https://www.linkedin.com/in/salim-karbm/)
- **Twitter**: [@salimkarbm](https://twitter.com/salimkarbm)

---

