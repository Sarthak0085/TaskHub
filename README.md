# 🚀 TaskHub – Project & Task Management App

**TaskHub** is a full-stack web application that helps teams manage work, track progress, and collaborate efficiently. It includes features like workspaces, projects, tasks, subtasks, comments, attachments, and role-based permissions with 2FA support.

---

## 📁 Project Structure

TaskHub/
│
├── sever/                       # Node.js + Express API with MongoDB
│     └── src/
│          ├── controllers/      # Route handlers
│          ├── models/           # Mongoose models
│          ├── routes/           # API routes
│          ├── middleware/       # Custom middleware (e.g., auth, error handler)
│          ├── utils/            # Utility functions (e.g., sendEmail, cloudinary)
│          ├── libs/             # libs files (e.g., schema)
│            ├── config/           # configuration files (e.g., db connection)
│          ├── index.ts          # Entry point for the backend
│          └── ...               # Other backend files
│
│
├── client/               # React + TypeScript + Vite + ShadCN UI
│     └── src/
│         ├── components/       # Shared UI components
│         ├── pages/            # Page components (routes)
│         ├── hooks/            # Custom React hooks
│         ├── hooks/            # Custom React hooks
│         ├── lib/              # schema and helpers function
│         ├── main.tsx          # starting point
│         └── ...               # Other frontend files
│
└── README.md                   # Project documentation


---

## ⚙️ Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- TailwindCSS + ShadCN UI
- React Router
- React Query

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- Cloudinary SDK
- JWT Auth
- bcrypt, zod, dotenv
- Cloudinary (for image upload)

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sarthak0085/TaskHub.git
cd TaskHub
```

### 2. Setup Backend

```bash
cd server
pnpm install
```

Create `.env` file in `/server`

```bash
PORT = 4000
FRONTEND_URL = http://localhost:5173
MONGODB_URI = YOUR_MONGODB_URI
JWT_SECRET = YOUR_JWT_SECRET
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 465
SMTP_SERVICE = gmail
SMTP_MAIL = YOUR_SMTP_MAIL
SMTP_PASS = YOUR_SMTP_PASSWORD
CLOUDINARY_CLOUD_NAME = YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY = YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET = YOUR_CLOUDINARY_API_SECRET
```

Start the backend server

```bash
pnpm run dev
```

### 2. Setup Frontend

```bash
cd client
pnpm install
```

Create `.env` file in `/client`

```bash
VITE_API_URL= http://localhost:4000/api/v1
```

Start the frontend

```bash
pnpm run dev
```

App will run at: http://localhost:5173

---

## 🔐 Authentication

- 🔑 **JWT-based authentication**
- 📧 **Email verification**
- 🔐 **Two-Factor Authentication (2FA)**
- 🛡️ **Role-based access control** (Admin, Member, Viewer)


---

## 📌 Features

- ✅ **User registration and login** (with 2FA)
- 🧑‍🤝‍🧑 **Workspace & Project management**
- 📋 **Tasks, Subtasks, Attachments**
- 🔔 **Activity Logs & Notifications**
- 👥 **Member roles and permissions**
- ☁️ **Avatar upload using Cloudinary**
- 🎨 **Responsive UI with ShadCN**

---

## 🧪 Scripts

### Backend:

```bash
pnpm run dev      # Start dev server
pnpm run build    # Build for production
pnpm run format   # Format using Prettier
```

### Frontend:

```bash
pnpm run dev      # Start frontend
pnpm run build    # Build for production
pnpm run lint     # Run ESLint
pnpm run format   # Format using Prettier

```

---

## 🛠️ Tools Used

- [MongoDB Atlas](https://www.mongodb.com/atlas) – Cloud-hosted MongoDB database
- [Cloudinary](https://cloudinary.com/) – Media management and file storage
- [Vercel](https://vercel.com/) / [Render](https://render.com/) – Deployment platforms
- [Zod](https://zod.dev/) – TypeScript-first schema validation
- [ShadCN UI](https://ui.shadcn.dev/) – Beautifully styled React components

---

## 📸 Screenshots

### 🏠 Home Page
![Home](https://task-hub-lyart-one.vercel.app/screenshot/home.png)

### 📋 Dashboard
![Dashboard](https://task-hub-lyart-one.vercel.app/screenshot/dashboard.png)

### 👥 Members Management
![Members](https://task-hub-lyart-one.vercel.app/screenshot/members.png)

---

## 📬 Contact

Created with ❤️ by **Sarthak**

- 🐙 GitHub: [Sarthak](https://github.com/Sarthak0085)
- 📧 Email: sarth.mahajan2000@gmail.com

