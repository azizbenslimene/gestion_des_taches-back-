import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const RepliesSchema = new Schema({
  desc: {
    type: String, // Use String for textual data
    required: true // Make description required
  },
  dateR :{
    type : 'date'
  },
  tacheid: {
    type: Schema.Types.ObjectId,
    ref: "tache",
    required: true // Ensure tacheid is required
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true // Ensure user is required
  },
  cmnt: {
    type: Schema.Types.ObjectId,
    ref: "comment",
    required: true 
  }
});

export default model("replies", RepliesSchema);
