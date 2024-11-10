// event.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define an interface for the Event document (only for TypeScript)
interface IEvent extends Document {
  name: string;
  date: Date;
  // Add any additional fields for your event data
}

// Define the Event schema
const EventSchema: Schema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  // Add other fields as necessary, like description, location, etc.
});

// Register the Event model with Mongoose
const Event = mongoose.model<IEvent>('Event', EventSchema);

export default Event;
