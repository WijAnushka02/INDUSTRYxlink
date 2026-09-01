import mongoose, { Document } from 'mongoose';
export interface IVisitOpportunity extends Document {
    companyId: mongoose.Types.ObjectId;
    visitDate: Date;
    durationHours?: number;
    capacity: number;
    topic?: string;
    status: 'OPEN' | 'CLOSED' | 'CANCELLED';
    eligibleDegrees: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IVisitOpportunity, {}, {}, {}, mongoose.Document<unknown, {}, IVisitOpportunity, {}, mongoose.DefaultSchemaOptions> & IVisitOpportunity & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IVisitOpportunity>;
export default _default;
//# sourceMappingURL=VisitOpportunity.d.ts.map