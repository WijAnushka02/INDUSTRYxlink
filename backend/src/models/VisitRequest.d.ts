import mongoose, { Document } from 'mongoose';
export interface IVisitRequest extends Document {
    universityId: mongoose.Types.ObjectId;
    companyId: mongoose.Types.ObjectId;
    opportunityId: mongoose.Types.ObjectId;
    requestedDate: Date;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    studentCount?: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IVisitRequest, {}, {}, {}, mongoose.Document<unknown, {}, IVisitRequest, {}, mongoose.DefaultSchemaOptions> & IVisitRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IVisitRequest>;
export default _default;
//# sourceMappingURL=VisitRequest.d.ts.map