import mongoose, { type Document, type Model, type Types } from "mongoose";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event reference is required"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Please provide a valid email address",
      },
    },
  },
  { timestamps: true },
);

// Validate the booking against an existing Event before persisting it.
bookingSchema.pre("save", async function () {
  if (!this.eventId) {
    throw new Error("Event reference is required.");
  }

  const eventExists = await mongoose
    .model("Event")
    .exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error("The referenced event does not exist.");
  }
});

const Booking: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking>) ||
  mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
