# GogoSoft - School Management System

A comprehensive school management system with QR code-based student badges and integrated mobile payments.

## Technologies Used

### Frontend
- React 18.3.1 with TypeScript
- Vite for build tooling and development server
- TailwindCSS for styling
- React Router for navigation
- React Hook Form for form handling
- Zod for form validation
- Lucide React for icons
- Chart.js for data visualization
- React Toastify for notifications
- QRCode.react for QR code generation
- jsPDF for PDF report generation

### Backend (To Be Implemented)
- Supabase for:
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Edge Functions

## Database Schema

### Tables

1. users
   - id (uuid, primary key)
   - email (text, unique)
   - name (text)
   - role (enum: admin, parent, student, educator, driver, cook)
   - avatar_url (text, nullable)
   - created_at (timestamptz)

2. students
   - id (uuid, primary key)
   - name (text)
   - qr_code (text, unique)
   - balance (decimal)
   - parent_id (uuid, foreign key)
   - class (text)
   - attendance_rate (decimal)

3. transactions
   - id (uuid, primary key)
   - student_id (uuid, foreign key)
   - amount (decimal)
   - type (enum: CANTINE, SORTIE, SCOLARITE, RECHARGE)
   - date (timestamptz)
   - details (text, nullable)

4. badges
   - id (uuid, primary key)
   - student_id (uuid, foreign key)
   - qr_code (text, unique)
   - is_active (boolean)
   - created_at (timestamptz)

## Project Structure

```
src/
├── components/         # Reusable UI components
│   └── ui/
├── contexts/          # React contexts (auth, etc.)
├── layouts/           # Page layouts
├── pages/            # Page components
│   ├── admin/        # Admin-specific pages
│   ├── auth/         # Authentication pages
│   ├── cook/         # Cook-specific pages
│   ├── driver/       # Driver-specific pages
│   ├── educator/     # Educator-specific pages
│   ├── parent/       # Parent-specific pages
│   └── student/      # Student-specific pages
├── services/         # API and business logic
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Features

### Role-Based Access
- Admin: Full system management
- Parent: Monitor children, make payments
- Student: View balance, activities
- Educator: Take attendance, manage classes
- Driver: Record transport activities
- Cook: Manage meal services

### QR Code System
- Unique QR codes for each student
- Scan for attendance, meals, transport
- Real-time balance checking
- Activity tracking

### Payment System
- Mobile money integration (MTN, Orange)
- Card payments
- Balance management
- Transaction history
- PDF report generation

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project
   - Click "Connect to Supabase" in the top right
   - Follow the setup wizard
   - Add the provided environment variables to `.env`

4. Run migrations:
   - Migrations will be automatically applied

5. Start development server:
   ```bash
   npm run dev
   ```

## Demo Accounts

```
Admin:
- Email: admin@example.com
- Password: admin123

Parent:
- Email: parent@example.com
- Password: parent123

Student:
- Email: student@example.com
- Password: student123

Educator:
- Email: educator@example.com
- Password: educator123

Driver:
- Email: driver@example.com
- Password: driver123

Cook:
- Email: cook@example.com
- Password: cook123
```

## Deployment

The application can be deployed to:
- Netlify (frontend)
- Supabase (backend)

## Security

- JWT-based authentication
- Row Level Security (RLS) for database access
- Secure QR code generation
- Payment data encryption
- Role-based access control

## Future Enhancements

1. Real-time notifications
2. Mobile app version
3. Advanced reporting
4. Parent-teacher communication
5. Integration with academic systems
6. Biometric authentication option