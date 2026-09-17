# Pathfind — Frontend Application

Modern React 19 + TypeScript frontend for the Pathfind mentorship platform, built with Vite and Tailwind/Vanilla CSS.

---

## 🚀 Features & Capabilities

- **Authentication & Roles**: Mentee signup, Mentor profile application flow, Signin, JWT session persistence via Axios & Zustand.
- **Mentor Discovery & Filtering**: Search by keyword, expertise tags, request types, and verification status with real-time UI filtering.
- **Structured Request Workflow**: Interactive request scheduling modal supporting 5 mentorship categories (*CV Review*, *Portfolio Feedback*, *Career Conversation*, *Interview Prep*, *Role Insight*) with file attachment uploads.
- **Mentee & Mentor Dashboards**:
  - **Mentee Dashboard**: Outgoing requests status tracker, session details modal, saved mentors directory, private session notes.
  - **Mentor Dashboard**: Incoming pending request queue, accept/decline action modals, session management.
- **Real-Time Admin Management Portal**:
  - Live metric stat cards (`GET /admin/stats`).
  - Pending Mentor Verification Queue with one-click Approve/Reject.
  - All Mentors Directory with badges and Delete controls.
  - Registered Mentees Directory with Remove Account controls.
- **User Profile Management**: Edit profile modal for updating bio, location, job title, company, avatar, and social links.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Routing**: React Router v7 (`BrowserRouter`, `Routes`, `Route`, `Navigate`)
- **State Management**: Zustand (`useAuthStore`)
- **HTTP Client**: Axios with Bearer Authorization token interceptor
- **Icons**: Lucide React
- **Linting**: ESLint v9

---

## 📂 Directory Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── admin/          # Admin verification cards & roster components
│   │   ├── auth/           # Login, Register, & Role Selection cards
│   │   ├── layout/         # Navbar, Footer, UserMenuLink, ProtectedRoute
│   │   ├── mentors/        # MentorCard, MentorFilter, BookingModal
│   │   └── ui/             # Reusable UI elements (Badge, Button, Modal)
│   ├── lib/
│   │   └── api.ts          # Axios API client & endpoint wrapper functions
│   ├── pages/
│   │   ├── AdminDashboardPage.tsx
│   │   ├── LandingPage.tsx
│   │   ├── MenteeDashboardPage.tsx
│   │   ├── MentorDashboardPage.tsx
│   │   ├── MentorDetailPage.tsx
│   │   ├── MentorsPage.tsx
│   │   ├── ScheduleSessionPage.tsx
│   │   └── SessionDetailsPage.tsx
│   ├── store/
│   │   └── useAuthStore.ts # Global user auth & profile store
│   ├── types/
│   │   └── api.ts          # TypeScript interfaces matching backend models
│   ├── App.tsx             # Application routing & layout frame
│   ├── main.tsx            # App entrypoint
│   └── index.css           # Design tokens, variables & utility classes
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Run Development Server
```bash
npm run dev
```
The development server will run at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```

### 5. Run Lint Checks
```bash
npx eslint .
```
