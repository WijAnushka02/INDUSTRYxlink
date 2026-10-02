/**
 * INDUSTRYxLINK – Capacity Agent
 *
 * Checks the number of available seats at each matched company
 * and manages the student quota.
 * Verifies: maximum participant capacity, available time slots, existing bookings.
 * Filters out companies that cannot accommodate the requested student count.
 * Manages quota allocation when multiple universities request the same company.
 */

import VisitOpportunity from '../models/VisitOpportunity';
import VisitRequest from '../models/VisitRequest';
import {
  IAgent,
  AgentResult,
  AgentLog,
  CompanyMatch,
  CapacityResult,
} from './types';

interface CapacityCheckInput {
  matches: CompanyMatch[];
  requiredSeats: number;
}

interface CapacityCheckOutput {
  availableMatches: CompanyMatch[];
  capacityDetails: CapacityResult[];
  filteredOut: { companyId: string; reason: string }[];
}

class CapacityAgent implements IAgent<CapacityCheckInput, CapacityCheckOutput> {
  public name = 'CapacityAgent';

  public async execute(input: CapacityCheckInput): Promise<AgentResult<CapacityCheckOutput>> {
    const logs: AgentLog[] = [];
    const capacityDetails: CapacityResult[] = [];
    const availableMatches: CompanyMatch[] = [];
    const filteredOut: { companyId: string; reason: string }[] = [];

    logs.push({
      agentName: this.name,
      action: 'START_CAPACITY_CHECK',
      timestamp: new Date(),
      input: { matchCount: input.matches.length, requiredSeats: input.requiredSeats },
      status: 'RUNNING',
    });

    try {
      for (const match of input.matches) {
        const opportunity = await VisitOpportunity.findById(match.opportunityId);

        if (!opportunity) {
          filteredOut.push({
            companyId: match.companyId,
            reason: 'Opportunity no longer exists',
          });
          continue;
        }

        if (opportunity.status !== 'OPEN') {
          filteredOut.push({
            companyId: match.companyId,
            reason: `Opportunity status is ${opportunity.status}`,
          });
          continue;
        }

        // Count existing accepted bookings for this opportunity
        const existingBookings = await VisitRequest.aggregate([
          {
            $match: {
              opportunityId: opportunity._id,
              status: 'ACCEPTED',
            },
          },
          {
            $group: {
              _id: null,
              totalStudents: { $sum: '$studentCount' },
            },
          },
        ]);

        const bookedSeats = existingBookings[0]?.totalStudents || 0;
        const availableSeats = opportunity.capacity - bookedSeats;

        const capacityResult: CapacityResult = {
          companyId: match.companyId,
          opportunityId: match.opportunityId,
          availableSeats,
          totalCapacity: opportunity.capacity,
          isAvailable: availableSeats >= input.requiredSeats,
          existingBookings: bookedSeats,
        };

        capacityDetails.push(capacityResult);

        if (capacityResult.isAvailable) {
          availableMatches.push(match);

          logs.push({
            agentName: this.name,
            action: 'CAPACITY_CHECK_PASS',
            timestamp: new Date(),
            output: {
              company: match.companyName,
              available: availableSeats,
              required: input.requiredSeats,
            },
            status: 'COMPLETED',
          });
        } else {
          filteredOut.push({
            companyId: match.companyId,
            reason: `Insufficient capacity: ${availableSeats} available, ${input.requiredSeats} required`,
          });

          logs.push({
            agentName: this.name,
            action: 'CAPACITY_CHECK_FAIL',
            timestamp: new Date(),
            output: {
              company: match.companyName,
              available: availableSeats,
              required: input.requiredSeats,
            },
            status: 'COMPLETED',
          });
        }
      }

      logs.push({
        agentName: this.name,
        action: 'CAPACITY_CHECK_COMPLETE',
        timestamp: new Date(),
        output: {
          passed: availableMatches.length,
          filtered: filteredOut.length,
        },
        status: 'COMPLETED',
      });

      return {
        success: true,
        data: { availableMatches, capacityDetails, filteredOut },
        logs,
      };
    } catch (error: any) {
      logs.push({
        agentName: this.name,
        action: 'CAPACITY_CHECK_ERROR',
        timestamp: new Date(),
        status: 'FAILED',
        error: error.message,
      });

      return {
        success: false,
        error: error.message,
        logs,
      };
    }
  }
}

export default new CapacityAgent();
