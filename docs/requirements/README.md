# INDUSTRYxLINK – Requirements Documentation

This directory contains requirements documentation for INDUSTRYxLINK.

## Functional Requirements

### FR-1: User Management
- Users can register with email and password
- Role-based access: Student, Lecturer, University Coordinator, Company Coordinator, Admin
- JWT-based authentication with HTTP-only cookies

### FR-2: University Management
- University coordinators can create and manage university profiles
- Maintain academic calendar (semester dates, exam periods, internship periods)
- Define degree programmes and specialisations

### FR-3: Company Management
- Company coordinators can create and manage company profiles
- Define industry visit opportunities with capacity, dates, and topics

### FR-4: Visit Request Management
- University coordinators can submit visit requests
- Company coordinators can accept/reject requests
- Full lifecycle tracking: PENDING → ACCEPTED/REJECTED → COMPLETED

### FR-5: Agentic Pipeline
- **Visit Request Agent**: Parse and validate coordinator requests
- **Company Matching Agent**: Score and rank companies by suitability
- **Capacity Agent**: Verify real-time seat availability
- **Communication Agent**: Generate and send automated emails
- **Reminder Agent**: Schedule visit reminders at configurable intervals
- **Attendance Agent**: Process post-visit attendance records
- **Report Agent**: Generate comprehensive post-visit reports

### FR-6: Analytics & Reporting
- Dashboard statistics for universities and companies
- Historical engagement tracking
- Automated report generation via Report Agent

### FR-7: Notifications
- Automated email notifications for request status changes
- Visit reminder notifications (1 week, 3 days, 1 day before)
- Postponement and cancellation notifications

## Non-Functional Requirements

### NFR-1: Security
- Passwords hashed with bcrypt
- Role-based authorization middleware
- Rate limiting on authentication endpoints
- Input validation via Zod schemas

### NFR-2: Performance
- Background job processing via BullMQ/Redis
- Database indexing for frequent queries
- Paginated API responses

### NFR-3: Observability
- Full agent audit trail (AgentAuditLog)
- Sentry error monitoring and profiling
- Structured logging

### NFR-4: Deployment
- Docker and Docker Compose support
- GitHub Actions CI/CD pipelines
