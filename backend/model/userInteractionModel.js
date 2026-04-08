import mongoose from "mongoose";

const userInteractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  interactionType: {
    type: String,
    enum: ["view", "purchase", "complete", "review", "wishlist", "search"],
    required: true,
  },
  // Additional metadata based on interaction type
  metadata: {
    timeSpent: Number, // seconds
    rating: Number, // for reviews
    searchQuery: String, // for searches
    deviceType: String,
    referrer: String,
  },
  weight: {
    type: Number,
    default: 1, // Base weight for scoring
    min: 0.1,
    max: 5,
  },
  timestamp: { type: Date, default: Date.now },
});

// Create compound index for efficient queries
userInteractionSchema.index({ userId: 1, courseId: 1 });
userInteractionSchema.index({ userId: 1, timestamp: -1 });
userInteractionSchema.index({ courseId: 1, interactionType: 1 });

// Pre-save middleware to set weight based on interaction type
userInteractionSchema.pre("save", function (next) {
  switch (this.interactionType) {
    case "purchase":
      this.weight = 5;
      break;
    case "complete":
      this.weight = 4;
      break;
    case "review":
      this.weight = 3;
      break;
    case "view":
      this.weight = 1;
      break;
    case "search":
      this.weight = 0.5;
      break;
    default:
      this.weight = 1;
  }
  next();
});

const UserInteraction =
  mongoose.models.UserInteraction ||
  mongoose.model("UserInteraction", userInteractionSchema);

export default UserInteraction;
