---

# Goo Cast Studio Reservation System

A modern web application for booking and managing studio reservations, built with React, Vite, Node.js, and Express.

## Features
- Studio selection and gallery preview
- Date/time and package selection
- Add-on services and coupon support
- User authentication and dashboard
- Admin dashboard with analytics
- Responsive, mobile-friendly UI
- Animated transitions using Framer Motion

## Tech Stack
- **Frontend:** React, Vite, Framer Motion, Axios, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd "Goo Cast Studio Reservation System"
   ```

2. **Install dependencies:**
   - For the client:
     ```sh
     cd client
     npm install
     ```
   - For the server:
     ```sh
     cd ../server
     npm install
     ```

3. **Environment Variables:**
   - Copy `.env.example` to `.env` in both `client` and `server` folders and fill in the required values.

4. **Run the development servers:**
   - In two terminals:
     ```sh
     # Terminal 1 (client)
     cd client
     npm run dev
     # Terminal 2 (server)
     cd server
     npm run dev
     ```

5. **Open the app:**
   - Visit [http://localhost:5173](http://localhost:5173) for the client.
   - The server runs on [http://localhost:5000](http://localhost:5000) by default.

## Project Structure
```
client/      # React frontend
server/      # Node.js backend
```

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run lint` — Lint code

## License
Dottopia Marketing Agency

---

For more details, see the code and comments in each folder.
