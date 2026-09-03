import connectDB from "@/lib/mongodb";
import Event from "@/app/database/event.model";

export const getSimilarEventsByslug = async (slug: string) => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug });

    return await Event.find({
      _id: { $ne: event?._id },
      tags: { $in: event?.tags },
    }).lean();
  } catch {
    return [];
  }
  // Implementation for fetching similar events by slug
};
