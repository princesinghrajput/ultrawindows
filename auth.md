# Authentication & Onboarding Implementation Plan

## Overview
This document outlines the implementation of the "Request Access" style authentication flow using Next.js 15+, NextAuth.js (v5), and MongoDB with Mongoose.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Auth**: NextAuth.js v5
- **Database**: MongoDB
- **ORM**: Mongoose
- **Validation**: Zod
- **Styling**: TailwindCSS (Existing)

## Database Schema (`User` Model)
```typescript
interface IUser {
  name: string;
  email: string;
  password?: string; // Hashed
  company: string;
  phone: string;
  role: 'user' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
```

## User Flows

### 1. Request Access (Registration)
- **URL**: `/request-access`
- **Fields**: Full Name, Company, Email, Phone, Password, Confirm Password.
- **Backend Logic**:
  - Validate input (Zod).
  - Check if email already exists.
  - Hash password.
  - Create User document with `status: 'pending'` and `role: 'user'`.
  - **Important**: Do NOT log the user in.
- **Next Step**: Redirect to `/portal/pending`.

### 2. Login
- **URL**: `/login` (or `/portal/login`)
- **Fields**: Email, Password.
- **Backend Logic**:
  - Find user by email.
  - Verify password.
  - **Check Status**:
    - If `pending`: Throw error "Your account is awaiting approval."
    - If `rejected`: Throw error "Your access request was rejected."
    - If `approved`: detailed session creation.
- **Next Step**: Redirect to `/portal/dashboard`.

### 3. Pending Approval
- **URL**: `/portal/pending`
- **Content**: Static message explaining the review process.
- **Access**: Public (or strictly for users with a signed-up-but-pending cookie/state, but public is easier for now).

### 4. Admin Approval (Database Level initially)
- To approve a user, we will manually update the MongoDB document `status` to `'approved'`.

## Implementation Steps

1.  **Setup**: Install `mongoose`, `next-auth@beta`, `bcryptjs`, `zod`.
2.  **Database**: Configure `lib/db.ts` for MongoDB connection.
3.  **Models**: Create `models/User.ts`.
4.  **Auth Config**: Setup `auth.ts` and `auth.config.ts` for NextAuth credentials provider.
5.  **API Routes**:
    - `POST /api/auth/register`: Handle access requests.
6.  **UI Implementation** (based on `onboardflow.md`):
    - `app/login/page.tsx`: Custom login page.
    - `app/request-access/page.tsx`: Registration form.
    - `app/portal/pending/page.tsx`: Pending state page.
    - `app/portal/dashboard/page.tsx`: Protected dashboard.
7.  **Middleware**: Protect `/portal` routes, redirect unauthenticated to login.

## Security
- Passwords hashed with bcrypt.
- Input validation with Zod.
- Protected routes via Next.js Middleware.
