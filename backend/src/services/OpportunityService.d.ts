declare class OpportunityService {
    createOpportunity(data: any): Promise<import("mongoose").Document<unknown, {}, import("../models/VisitOpportunity").IVisitOpportunity, {}, import("mongoose").DefaultSchemaOptions> & import("../models/VisitOpportunity").IVisitOpportunity & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getPaginatedOpportunities(page: number, limit: number): Promise<{
        opportunities: (import("mongoose").Document<unknown, {}, import("../models/VisitOpportunity").IVisitOpportunity, {}, import("mongoose").DefaultSchemaOptions> & import("../models/VisitOpportunity").IVisitOpportunity & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        page: number;
        pages: number;
        total: number;
    }>;
    getOpportunityById(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/VisitOpportunity").IVisitOpportunity, {}, import("mongoose").DefaultSchemaOptions> & import("../models/VisitOpportunity").IVisitOpportunity & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
declare const _default: OpportunityService;
export default _default;
//# sourceMappingURL=OpportunityService.d.ts.map