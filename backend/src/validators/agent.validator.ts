import { z } from 'zod';

export const preVisitPipelineSchema = z.object({
  body: z.object({
    studentCount: z.number().int().min(1).max(500, 'Student count must be between 1 and 500'),
    yearOfStudy: z.number().int().min(1).max(6).optional(),
    degreeProgram: z.string().min(2, 'Degree programme is required'),
    topicInterests: z.array(z.string()).min(1, 'At least one topic interest is required'),
    preferredMonth: z.string().optional(),
    preferredStartDate: z.string().datetime().optional(),
    preferredEndDate: z.string().datetime().optional(),
  }),
});

export const postVisitPipelineSchema = z.object({
  body: z.object({
    visitId: z.string().min(1, 'Visit ID is required'),
    universityName: z.string().min(1),
    companyName: z.string().min(1),
    visitDate: z.string().datetime(),
    registeredStudents: z.array(z.object({
      studentId: z.string(),
      studentName: z.string(),
    })),
    attendeeList: z.array(z.object({
      studentId: z.string(),
      checkInTime: z.string().datetime().optional(),
    })),
    coordinatorNotes: z.string().optional(),
  }),
});

export const scheduleRemindersSchema = z.object({
  body: z.object({
    visitId: z.string().min(1),
    visitDate: z.string().datetime(),
    companyName: z.string().min(1),
    universityName: z.string().min(1),
    studentEmails: z.array(z.string().email()).optional(),
    companyEmail: z.string().email().optional(),
  }),
});
