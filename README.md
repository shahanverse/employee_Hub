# Employee Management System (MERN Stack)

A premium, full-stack **Employee Management System** designed for administrator operations. Built as a MERN stack application, it features advanced search, filtering, column sorting, pagination, and real-time statistic cards, all styled with a modern glassmorphic Tailwind CSS dark mode theme.

---

## Technical Stack & Architecture

- **Database**: MongoDB (with Mongoose modeling and validations)
- **Backend**: Node.js & Express.js (Controller-Route-Model architecture with JWT protection)
- **Frontend**: React.js (Vite compiler, React Router DOM, Tailwind CSS styling, Lucide React icons)
- **State & API Communication**: Reusable custom hook `useApi()` managing request states (data, loading, error)

---

## Core Features

1. **JWT Administrator Authentication**:
   - Secure register and login panel for administrators.
   - Guarded dashboard routes; requests without valid authorization token automatically redirect to the login screen.
2. **Comprehensive Employee CRUD**:
   - Register new employees with client & server-side validation checks.
   - Edit profiles (pre-populated form with disabled Employee ID to maintain database integrity).
   - Delete employee records with a custom styled confirmation dialog.
3. **Advanced Directory Controls**:
   - **Search Bar**: Real-time regex matching against employee Name and Email.
   - **Department Filter**: Dropdown filtering employees by department (automatically populated by distinct values present in the database).
   - **Status Filter**: Toggle between Active / Inactive states.
   - **Sortable Columns**: Toggle ascending/descending sorting on Employee ID, Name, Department, Designation, and Salary.
   - **Pagination Control**: Clean pagination to manage large databases (items limit set to 8 per page).
4. **Interactive Dashboard Statistics**:
   - Real-time stat cards displaying: Total Employees, Active Personnel, Inactive Personnel, and Department Counts.
5. **Polished User Experience**:
   - Custom skeleton screens matching table columns during loading states.
   - Global dark-mode UI containing animated gradients and glassmorphism styling.

---

## Directory Structure

```text
employee-management-system/
├── package.json         # Root configuration to run both client and server
├── README.md            # Startup documentation
├── AI_USAGE.md          # Custom hook generation summary
├── backend/             # Express API
│   ├── .env             # Backend environment keys
│   ├── server.js        # Main server entrypoint
│   ├── config/          # Database configuration
│   ├── controllers/     # Authentication & Employee controllers
│   ├── middleware/      # JWT verification middleware
│   ├── models/          # Mongoose Schemas (Admin, Employee)
│   └── routes/          # API endpoint routes
└── frontend/            # React App
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── App.jsx      # Router setup
        ├── index.css    # Tailwind imports and theme directives
        ├── main.jsx
        ├── components/  # Navbar, PrivateRoute, Table, Form, Modals, Loaders
        ├── hooks/       # Reusable custom hook (useApi)
        └── pages/       # Login, Dashboard, Add, and Edit screens
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new admin account.
- `POST /api/auth/login` - Authenticate admin credentials and generate a JWT token.
- `GET /api/auth/me` - Retrieve current admin profile details (Protected).

### Employees (All protected by JWT auth)
- `POST /api/employees` - Register a new employee.
- `GET /api/employees` - Fetch employees (supports `search`, `department`, `status`, `sortBy`, `sortOrder`, `page`, `limit` queries).
- `GET /api/employees/:id` - Fetch details of a single employee by their database Object ID.
- `PUT /api/employees/:id` - Update employee details by Object ID.
- `DELETE /api/employees/:id` - Delete an employee record.

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v18+ recommended).
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on default port `27017` (or access to a MongoDB Atlas cluster).

### Step-by-Step Launch

1. **Clone/Open the project directory**:
   ```bash
   cd employee-management-system
   ```

2. **Configure Environment Variables**:
   A default `.env` file is already created inside `backend/`. Review or adjust the parameters:
   ```text
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/employee_db
   JWT_SECRET=super_secret_employee_management_key_123456
   NODE_ENV=development
   ```

3. **Install Dependencies**:
   From the root folder, run the monorepo helper script which installs root, backend, and frontend packages simultaneously:
   ```bash
   npm run install-all
   ```

4. **Launch the Development Servers**:
   Start both the backend server (on port `5000`) and the Vite React frontend (on port `5173`) using:
   ```bash
   npm run dev
   ```

5. **Interact with the Application**:
   Open your browser and navigate to:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API status: [http://localhost:5000](http://localhost:5000)

---

## Admin Credentials for Testing

To quickly test the application, register an admin on the register screen or log in. 
- You can register any username, email, and password.
- A JWT token will be generated, granting dashboard permission and access to CRUD endpoints.
# employee_Hub
