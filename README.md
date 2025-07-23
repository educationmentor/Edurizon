# Edurizon

Edurizon is a full-stack web application designed to help students explore study abroad opportunities, book consultations, interact with counselors, and access a wide range of resources for global education. The platform features real-time chat, role-based dashboards, admin management, and integrations with Google services.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Contribution](#contribution)
- [License](#license)

---

## Project Overview
Edurizon connects students with counselors and universities worldwide. It provides:
- User authentication (including Google OAuth)
- Real-time chat and notifications
- Consultation and meeting management
- College predictor tool
- Admin and counselor dashboards
- SEO-optimized frontend with dynamic content

---

## Features
- **User Roles:** Student, Counselor, Admin, Super Admin
- **Authentication:** JWT-based, Google OAuth
- **Consultation Booking:** Book, manage, and track consultations
- **Real-time Chat:** Socket.io-based messaging between users and counselors
- **Admin Panel:** Manage users, consultations, meetings, and content
- **College Predictor:** Tool to help students find suitable colleges
- **Google Meet Integration:** Schedule and join online meetings
- **Email Notifications:** Automated emails for key actions
- **SEO & Analytics:** Sitemap, meta tags, Google Analytics

---

## Tech Stack
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, MUI (Material UI), Socket.io-client
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, JWT, Google APIs, Nodemailer
- **Other:** Vercel (deployment), CSV import/export, MySQL (for some reporting)

---

## Folder Structure
```
Edurizon/
  backend/      # Node.js/Express API server
    controllers/
    models/
    routes/
    middleware/
    utils/
    config/
    scripts/
    app.js
    package.json
  frontend/     # Next.js/React frontend
    components/
    pages/
    services/
    lib/
    styles/
    public/
    context/
    package.json
  scripts/      # Utility scripts
  README.md     # Project documentation
  package.json  # Root (monorepo) config
```

---

## Setup & Installation

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud)

### 1. Clone the Repository
```bash
git clone <repo-url>
cd Edurizon
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file (see below)
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create a .env.local file (see below)
npm run dev
```

---

## Environment Variables

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
# ...other variables as needed
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## API Overview
See `backend/api-endpoints.txt` for a full list of API endpoints, request/response formats, and usage examples.

---

## Contribution
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License
This project is licensed under the MIT License. 