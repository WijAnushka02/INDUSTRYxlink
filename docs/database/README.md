# INDUSTRYxLINK – Database Documentation

This directory contains database schema documentation for INDUSTRYxLINK.

## Database

- **Engine**: MongoDB
- **ODM**: Mongoose

## Collections

### Users
Stores all user accounts across roles.

| Field | Type | Description |
|-------|------|-------------|
| email | String | Unique email address |
| password | String | Hashed password (bcrypt) |
| role | Enum | STUDENT, LECTURER, UNIVERSITY_COORDINATOR, COMPANY_COORDINATOR, ADMIN |
| universityId | ObjectId | Reference to University |
| companyId | ObjectId | Reference to Company |

### Universities
| Field | Type | Description |
|-------|------|-------------|
| name | String | University name |
| location | String | Physical location |
| website | String | University website |
| coordinators | [ObjectId] | Users managing this university |
| degreePrograms | Array | List of offered degrees |
| academicCalendar | Object | Semester dates, exam periods, internship info |

### Companies
| Field | Type | Description |
|-------|------|-------------|
| name | String | Company name |
| industry | String | Industry sector |
| location | String | Physical location |
| website | String | Company website |
| coordinators | [ObjectId] | Users managing this company |

### VisitOpportunities
| Field | Type | Description |
|-------|------|-------------|
| companyId | ObjectId | Company offering the visit |
| visitDate | Date | Scheduled visit date |
| durationHours | Number | Duration in hours |
| capacity | Number | Maximum participants |
| topic | String | Visit topic/area |
| status | Enum | OPEN, CLOSED, CANCELLED |
| eligibleDegrees | [String] | Eligible degree programmes |

### VisitRequests
| Field | Type | Description |
|-------|------|-------------|
| universityId | ObjectId | Requesting university |
| companyId | ObjectId | Target company |
| opportunityId | ObjectId | Target opportunity |
| requestedDate | Date | Date of request submission |
| status | Enum | PENDING, ACCEPTED, REJECTED |
| studentCount | Number | Number of participating students |

### AttendanceRecords (New – Agentic)
| Field | Type | Description |
|-------|------|-------------|
| visitId | String | Visit identifier |
| studentId | String | Student identifier |
| present | Boolean | Whether student attended |
| checkInTime | Date | When student checked in |
| notes | String | Additional notes |

### VisitReports (New – Agentic)
| Field | Type | Description |
|-------|------|-------------|
| visitId | String | Visit identifier |
| generatedAt | Date | Report generation timestamp |
| universityName | String | University name |
| companyName | String | Company name |
| visitDate | Date | Date of the visit |
| totalRegistered | Number | Total registered students |
| totalAttended | Number | Total who attended |
| attendanceRate | Number | Percentage attendance |
| noShows | Number | Students who didn't attend |
| summary | String | Generated report text |
| recommendations | [String] | Actionable recommendations |

### AgentAuditLogs (New – Agentic)
| Field | Type | Description |
|-------|------|-------------|
| pipelineId | String | Pipeline execution identifier |
| agentName | String | Name of the agent |
| action | String | Action performed |
| timestamp | Date | When the action occurred |
| status | Enum | IDLE, RUNNING, COMPLETED, FAILED |
| input | String | Serialised input data |
| output | String | Serialised output data |
| error | String | Error message if failed |
