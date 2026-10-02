# INDUSTRYxLINK – Architecture Documentation

This directory contains architecture documentation for INDUSTRYxLINK.

## System Architecture

INDUSTRYxLINK follows a multi-layered architecture:

### Frontend Layer
- **React + TypeScript + Tailwind CSS** single-page application
- Component-based UI with reusable design system
- State management via React Context API

### Backend Layer
- **Node.js + Express.js** REST API
- JWT-based authentication with RBAC
- Request validation via Zod schemas

### Agentic Layer
Seven specialised agents that orchestrate the visit management workflow:

1. **Visit Request Agent** – Parses coordinator requests
2. **Company Matching Agent** – Identifies suitable companies
3. **Capacity Agent** – Checks seat availability
4. **Communication Agent** – Generates and sends emails
5. **Reminder Agent** – Schedules automated reminders
6. **Attendance Agent** – Processes post-visit attendance
7. **Report Agent** – Generates summary reports

### Data Layer
- **MongoDB** for persistent storage
- **Redis + BullMQ** for background job processing (emails, reminders)

### External Services
- Google Maps API (location/distance)
- Email service (SMTP/SendGrid)
- Sentry (error monitoring)
