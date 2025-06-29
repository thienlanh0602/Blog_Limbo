# Limbo

.
├── client/ # React frontend
│ ├── src/
│ │ ├── api/ # API calls (CRUD)
│ │ ├── components/ # Shared UI components (Drawer, Navbar, etc.)
│ │ ├── layout/ # Layout: Header, Footer, Sidebar
│ │ ├── pages/ # Pages: Homepage, Admin, Login, etc.
│ │ ├── hooks/ # Custom hooks (e.g., useResponsive)
│ │ ├── theme/ # MUI theme config (breakpoints, fonts)
│ │ └── assets/ # Images, Kanit fonts, icons...
│ ├── public/
│ └── README.md
│
├── server/ # Node.js backend
│ ├── controllers/ # Logic for CRUD APIs
│ ├── models/ # Mongoose schemas (Homepage, User, etc.)
│ ├── routes/ # API routes
│ ├── middleware/ # Upload, auth middlewares
│ ├── uploads/ # Stored uploaded images
│ └── index.js
│
└── README.md # This file!
