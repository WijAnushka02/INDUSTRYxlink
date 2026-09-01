declare class RequestService {
    createRequest(data: any): Promise<import("mongoose").Document<unknown, {}, import("../models/VisitRequest").IVisitRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../models/VisitRequest").IVisitRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getPaginatedRequests(query: any, page: number, limit: number): Promise<{
        requests: (import("mongoose").Document<unknown, {}, import("../models/VisitRequest").IVisitRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../models/VisitRequest").IVisitRequest & Required<{
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
    updateRequestStatus(id: string, status: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/VisitRequest").IVisitRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../models/VisitRequest").IVisitRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
declare const _default: RequestService;
export default _default;
//# sourceMappingURL=RequestService.d.ts.map