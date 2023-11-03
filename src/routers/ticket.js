
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const TicketSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  code: { type: String, default: uuidv4 },
  purchase_datetime: { type: Date, default: Date.now },
  amount: Number,
  purchaser: String,
});

export const Ticket = mongoose.model('Ticket', TicketSchema);
