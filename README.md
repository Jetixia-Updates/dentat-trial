# 🦷 Dental Clinic Management System

نظام إدارة عيادة أسنان متكامل | Complete Dental Clinic Management System

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TailwindCSS + Radix UI
- **Backend**: Node.js + Express
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT + Role-based Access (Admin, Doctor, Reception, Patient)
- **i18n**: Arabic (RTL) + English (LTR)

## Structure

```
├── apps/
│   ├── web/        # Next.js (Website + Admin + Patient + Doctor + Reception)
│   └── api/        # Express REST API
├── packages/
│   ├── database/   # Prisma schema & client
│   └── shared/     # Shared types & schemas
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup database (create .env with DATABASE_URL first)
pnpm db:push

# Run development
pnpm dev
```

- **Website**: http://localhost:3000
- **API**: http://localhost:4000/api

## Environment Variables

Create `.env` in root:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/dental_clinic"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:4000"
```
