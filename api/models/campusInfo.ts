import mongoose, { Schema, Document } from 'mongoose';

interface ICampusInfo extends Document {
  regulation: string;
  department: string;
  academicCalendarUrl: string;
  syllabusUrl: string;
}

const CampusInfoSchema: Schema = new Schema({
  regulation: { type: String, required: true },
  department: { type: String, required: true },
  academicCalendarUrl: { type: String, required: true },
  syllabusUrl: { type: String, required: true },
});

const CampusInfo = mongoose.model<ICampusInfo>('CampusInfo', CampusInfoSchema, 'campusinfos');
export default CampusInfo;
