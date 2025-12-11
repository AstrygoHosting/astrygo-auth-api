# Astrygo Auth API

Secure authentication microservice for the Astrygo Hosting platform.  
Built with **Node.js, TypeScript, Express, Prisma, and PostgreSQL**, and deployed on **Google Cloud Run**.

---

## Stack

- **Runtime:** Node.js 20 + TypeScript
- **Framework:** Express
- **ORM:** Prisma + PostgreSQL (Cloud SQL)
- **Auth:** JWT Access & Refresh tokens with session binding
- **Security:**
  - Hashed refresh tokens
  - Refresh token rotation
  - Session revocation
  - Cleanup job endpoint protected by `CRON_CLEANUP_KEY`
- **Deployment:** Docker + Google Cloud Run
- **CI/CD:** GitHub Actions

---

## Local Development

### 1. Install dependencies

```bash
npm install
