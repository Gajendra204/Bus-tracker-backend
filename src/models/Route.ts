import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema({
  name: String,
  location: {
    lat: Number,
    lng: Number
  },
  order: Number,
  estimatedTimeFromPrevious: Number 
});

const routeSchema = new mongoose.Schema({
  name: String,
  stops: [stopSchema],
  assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  active: Boolean
});

export const Route = mongoose.model('Route', routeSchema);