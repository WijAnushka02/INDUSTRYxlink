/**
 * INDUSTRYxLINK – Agent Pipeline Tests
 *
 * Basic test stubs for the agentic pipeline.
 * These tests validate the structure and basic behavior of each agent.
 *
 * To run: npx jest (after adding jest to devDependencies)
 */

// Test: Visit Request Agent should parse valid input
describe('VisitRequestAgent', () => {
  it('should exist as a module', () => {
    const agent = require('../src/agents/visitRequestAgent');
    expect(agent).toBeDefined();
    expect(agent.default).toBeDefined();
    expect(agent.default.name).toBe('VisitRequestAgent');
  });
});

// Test: Company Matching Agent should exist
describe('CompanyMatchingAgent', () => {
  it('should exist as a module', () => {
    const agent = require('../src/agents/companyMatchingAgent');
    expect(agent).toBeDefined();
    expect(agent.default).toBeDefined();
    expect(agent.default.name).toBe('CompanyMatchingAgent');
  });
});

// Test: Capacity Agent should exist
describe('CapacityAgent', () => {
  it('should exist as a module', () => {
    const agent = require('../src/agents/capacityAgent');
    expect(agent).toBeDefined();
    expect(agent.default).toBeDefined();
    expect(agent.default.name).toBe('CapacityAgent');
  });
});

// Test: Communication Agent should exist
describe('CommunicationAgent', () => {
  it('should exist as a module', () => {
    const agent = require('../src/agents/communicationAgent');
    expect(agent).toBeDefined();
    expect(agent.default).toBeDefined();
    expect(agent.default.name).toBe('CommunicationAgent');
  });
});

// Test: Reminder Agent should exist
describe('ReminderAgent', () => {
  it('should exist as a module', () => {
    const agent = require('../src/agents/reminderAgent');
    expect(agent).toBeDefined();
    expect(agent.default).toBeDefined();
    expect(agent.default.name).toBe('ReminderAgent');
  });
});

// Test: Attendance Agent should exist
describe('AttendanceAgent', () => {
  it('should exist as a module', () => {
    const agent = require('../src/agents/attendanceAgent');
    expect(agent).toBeDefined();
    expect(agent.default).toBeDefined();
    expect(agent.default.name).toBe('AttendanceAgent');
  });
});

// Test: Report Agent should exist
describe('ReportAgent', () => {
  it('should exist as a module', () => {
    const agent = require('../src/agents/reportAgent');
    expect(agent).toBeDefined();
    expect(agent.default).toBeDefined();
    expect(agent.default.name).toBe('ReportAgent');
  });
});

// Test: Orchestrator should exist
describe('AgentOrchestrator', () => {
  it('should exist as a module', () => {
    const orchestrator = require('../src/agents/orchestrator');
    expect(orchestrator).toBeDefined();
    expect(orchestrator.default).toBeDefined();
  });
});
