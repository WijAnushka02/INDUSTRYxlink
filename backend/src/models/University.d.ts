import mongoose, { Document } from 'mongoose';
export interface IUniversity extends Document {
    name: string;
    location?: string;
    website?: string;
    coordinators: mongoose.Types.ObjectId[];
    degreePrograms: {
        name: string;
        field: string;
    }[];
    academicCalendar: {
        semesterStart?: Date;
        semesterEnd?: Date;
        internshipStart?: Date;
        internshipDurationMonths?: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUniversity, {}, {}, {}, mongoose.Document<unknown, {}, IUniversity, {}, mongoose.DefaultSchemaOptions> & IUniversity & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUniversity>;
export default _default;
//# sourceMappingURL=University.d.ts.map