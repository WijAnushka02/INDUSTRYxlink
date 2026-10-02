# INDUSTRYxLINK – API Documentation

This directory contains API documentation for INDUSTRYxLINK.

## Base URL

```
http://localhost:5000/api/v1
```

## Authentication

All endpoints (except public ones) require a JWT token set via HTTP-only cookie.

### Auth Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |
| POST | `/auth/logout` | Clear JWT cookie |
| GET | `/auth/me` | Get current user profile |

### Opportunity Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/opportunities/public` | List public opportunities |
| POST | `/opportunities` | Create opportunity (Company) |
| GET | `/opportunities` | List opportunities (Auth) |
| GET | `/opportunities/:id` | Get opportunity by ID |

### Request Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/requests` | Create visit request (Uni) |
| GET | `/requests` | List requests |
| PUT | `/requests/:id/status` | Update request status (Company) |

### Agent Pipeline Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/agents/status` | Get all agent statuses |
| POST | `/agents/pipeline/pre-visit` | Trigger pre-visit pipeline |
| POST | `/agents/pipeline/post-visit` | Trigger post-visit pipeline |
| POST | `/agents/reminders/schedule` | Schedule visit reminders |
| GET | `/agents/audit/:pipelineId` | Get pipeline audit logs |
| GET | `/agents/reports/:visitId` | Get visit report |

### Stats Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats/public` | Get public statistics |
