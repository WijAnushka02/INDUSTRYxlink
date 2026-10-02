/**
 * INDUSTRYxLINK – Company Matching Agent
 *
 * Identifies suitable companies based on the students' degree/subjects
 * and requested visit area.
 * Calculates a suitability score for each company using:
 *   - Degree match, topic match, capacity match
 *   - Date compatibility, location proximity
 *   - Previous engagement history
 * Returns a ranked list of suitable companies.
 */

import VisitOpportunity from '../models/VisitOpportunity';
import Company from '../models/Company';
import VisitRequest from '../models/VisitRequest';
import {
  IAgent,
  AgentResult,
  AgentLog,
  VisitRequirements,
  CompanyMatch,
} from './types';

class CompanyMatchingAgent implements IAgent<VisitRequirements, CompanyMatch[]> {
  public name = 'CompanyMatchingAgent';

  public async execute(input: VisitRequirements): Promise<AgentResult<CompanyMatch[]>> {
    const logs: AgentLog[] = [];

    logs.push({
      agentName: this.name,
      action: 'START_MATCHING',
      timestamp: new Date(),
      input,
      status: 'RUNNING',
    });

    try {
      // Find all open opportunities
      const opportunities = await VisitOpportunity.find({ status: 'OPEN' })
        .populate('companyId', 'name location industry');

      if (opportunities.length === 0) {
        return {
          success: true,
          data: [],
          logs: [...logs, {
            agentName: this.name,
            action: 'NO_OPPORTUNITIES',
            timestamp: new Date(),
            status: 'COMPLETED',
            output: 'No open opportunities found',
          }],
        };
      }

      const matches: CompanyMatch[] = [];

      for (const opportunity of opportunities) {
        const company = opportunity.companyId as any;
        if (!company) continue;

        // Calculate suitability scores
        const degreeMatch = this.calculateDegreeMatch(
          input.degreeProgram,
          opportunity.eligibleDegrees
        );

        const topicMatch = this.calculateTopicMatch(
          input.topicInterests,
          opportunity.topic || ''
        );

        const capacityMatch = this.calculateCapacityMatch(
          input.studentCount,
          opportunity.capacity
        );

        const dateCompatibility = this.calculateDateCompatibility(
          input.preferredMonth,
          opportunity.visitDate
        );

        const locationScore = 50; // Default score; would use Google Maps API in production

        // Check previous engagement
        const previousVisits = await VisitRequest.countDocuments({
          universityId: input.universityId,
          companyId: company._id,
          status: 'ACCEPTED',
        });
        const previousEngagement = Math.min(previousVisits * 10, 100);

        // Calculate overall suitability score (weighted average)
        const suitabilityScore = Math.round(
          (degreeMatch * 0.25) +
          (topicMatch * 0.25) +
          (capacityMatch * 0.20) +
          (dateCompatibility * 0.15) +
          (locationScore * 0.05) +
          (previousEngagement * 0.10)
        );

        matches.push({
          companyId: company._id.toString(),
          companyName: company.name,
          opportunityId: opportunity._id.toString(),
          suitabilityScore,
          matchDetails: {
            degreeMatch,
            topicMatch,
            capacityMatch,
            dateCompatibility,
            locationScore,
            previousEngagement,
          },
        });
      }

      // Sort by suitability score descending
      matches.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

      logs.push({
        agentName: this.name,
        action: 'MATCHING_COMPLETE',
        timestamp: new Date(),
        output: { totalMatches: matches.length, topScore: matches[0]?.suitabilityScore },
        status: 'COMPLETED',
      });

      return {
        success: true,
        data: matches,
        logs,
      };
    } catch (error: any) {
      logs.push({
        agentName: this.name,
        action: 'MATCHING_ERROR',
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

  /** Score degree compatibility (0–100) */
  private calculateDegreeMatch(requiredDegree: string, eligibleDegrees: string[]): number {
    if (!eligibleDegrees || eligibleDegrees.length === 0) return 50; // No restriction = neutral match

    const normalised = requiredDegree.toLowerCase();
    for (const degree of eligibleDegrees) {
      if (degree.toLowerCase().includes(normalised) || normalised.includes(degree.toLowerCase())) {
        return 100;
      }
    }

    // Partial match check (e.g., "Software" in "Software Engineering")
    const words = normalised.split(/\s+/);
    for (const degree of eligibleDegrees) {
      const degreeWords = degree.toLowerCase().split(/\s+/);
      const overlap = words.filter(w => degreeWords.includes(w));
      if (overlap.length > 0) {
        return Math.round((overlap.length / words.length) * 80);
      }
    }

    return 10;
  }

  /** Score topic compatibility (0–100) */
  private calculateTopicMatch(interests: string[], opportunityTopic: string): number {
    if (!opportunityTopic) return 30;

    const topicLower = opportunityTopic.toLowerCase();
    let bestScore = 0;

    for (const interest of interests) {
      const interestLower = interest.toLowerCase();
      if (topicLower.includes(interestLower) || interestLower.includes(topicLower)) {
        bestScore = 100;
        break;
      }

      // Word-level overlap
      const topicWords = topicLower.split(/\s+/);
      const interestWords = interestLower.split(/\s+/);
      const overlap = interestWords.filter(w => topicWords.includes(w));
      const score = Math.round((overlap.length / Math.max(interestWords.length, 1)) * 80);
      bestScore = Math.max(bestScore, score);
    }

    return bestScore;
  }

  /** Score capacity fit (0–100) */
  private calculateCapacityMatch(studentCount: number, capacity: number): number {
    if (capacity >= studentCount) {
      // Perfect fit when capacity is close to student count
      const ratio = studentCount / capacity;
      return Math.round(ratio * 100);
    }
    // Under capacity
    return Math.round((capacity / studentCount) * 60);
  }

  /** Score date compatibility (0–100) */
  private calculateDateCompatibility(preferredMonth: string | undefined, visitDate: Date): number {
    if (!preferredMonth) return 50;

    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december',
    ];

    const preferredIndex = months.indexOf(preferredMonth.toLowerCase());
    if (preferredIndex === -1) return 50;

    const visitMonth = new Date(visitDate).getMonth();
    const diff = Math.abs(preferredIndex - visitMonth);

    if (diff === 0) return 100;
    if (diff === 1) return 70;
    if (diff === 2) return 40;
    return 10;
  }
}

export default new CompanyMatchingAgent();
