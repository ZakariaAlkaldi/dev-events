import mongoose, { type Document, type Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new mongoose.Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      validate: {
        validator: (value: string): boolean => value.trim().length > 0,
        message: "Title cannot be empty",
      },
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      validate: {
        validator: (value: string): boolean => value.trim().length > 0,
        message: "Description cannot be empty",
      },
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
      validate: {
        validator: (value: string): boolean => value.trim().length > 0,
        message: "Overview cannot be empty",
      },
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
      validate: {
        validator: (value: string): boolean => value.trim().length > 0,
        message: "Image cannot be empty",
      },
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
      validate: {
        validator: (value: string): boolean => value.trim().length > 0,
        message: "Venue cannot be empty",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      validate: {
        validator: (value: string): boolean => value.trim().length > 0,
        message: "Location cannot be empty",
      },
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
    },
    mode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      required: [true, "Mode is required"],
      trim: true,
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
      validate: {
        validator: (value: string): boolean => value.trim().length > 0,
        message: "Audience cannot be empty",
      },
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every(
            (item) => typeof item === "string" && item.trim().length > 0,
          ),
        message: "Agenda must contain at least one non-empty item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
      validate: {
        validator: (value: string): boolean => value.trim().length > 0,
        message: "Organizer cannot be empty",
      },
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every(
            (item) => typeof item === "string" && item.trim().length > 0,
          ),
        message: "Tags must contain at least one non-empty item",
      },
    },
  },
  { timestamps: true },
);

// Add a unique index to keep slugs unique across events.
eventSchema.index({ slug: 1 }, { unique: true });

// Generate a URL-friendly slug from the event title and keep it stable unless the title changes.
eventSchema.pre("save", async function () {
  const requiredStringFields = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ] as const;

  for (const field of requiredStringFields) {
    const value = this[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`${field} is required and cannot be empty.`);
    }
  }

  if (!Array.isArray(this.agenda) || this.agenda.length === 0) {
    throw new Error("Agenda must contain at least one item.");
  }

  if (!Array.isArray(this.tags) || this.tags.length === 0) {
    throw new Error("Tags must contain at least one item.");
  }

  if (this.isModified("title") || !this.slug) {
    const slugBase = this.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    this.slug = slugBase || "event";
  }

  // Normalize the event date to a consistent ISO YYYY-MM-DD string.
  const parsedDate = new Date(this.date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Event date must be a valid date.");
  }
  this.date = parsedDate.toISOString().slice(0, 10);

  // Normalize the event time to a stable, readable format.
  const timeValue = this.time.trim();
  const timeMatch = /^([0-9]{1,2}):([0-9]{2})(?:\s*(AM|PM))?$/i.exec(timeValue);

  if (!timeMatch) {
    throw new Error("Event time must be in HH:MM or HH:MM AM/PM format.");
  }

  let hours = Number(timeMatch[1]);
  const minutes = timeMatch[2];
  const meridiem = timeMatch[3]?.toUpperCase();

  if (meridiem) {
    if (meridiem === "AM" && hours === 12) {
      hours = 0;
    }
    if (meridiem === "PM" && hours !== 12) {
      hours += 12;
    }
  }

  if (hours < 0 || hours > 23) {
    throw new Error("Event hour must be between 00 and 23.");
  }

  const minuteValue = Number(minutes);
  if (minuteValue < 0 || minuteValue > 59) {
    throw new Error("Event minutes must be between 00 and 59.");
  }

  this.time = `${String(hours).padStart(2, "0")}:${minutes}`;
  if (meridiem) {
    this.time = `${this.time} ${meridiem}`;
  }
});

const Event: Model<IEvent> =
  (mongoose.models.Event as Model<IEvent>) ||
  mongoose.model<IEvent>("Event", eventSchema);

export default Event;
