import { Schema, model, Document } from "mongoose";

interface ICampusNews extends Document {
  userId: string;
  text: string;
  link: string;
  timestamp: Date;
  startDate: Date;
  endDate: Date;
}

const CampusNewsSchema = new Schema<ICampusNews>({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  link: { type: String },
  timestamp: { type: Date, default: Date.now },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const CampusNews = model<ICampusNews>("CampusNews", CampusNewsSchema);

export default CampusNews;
