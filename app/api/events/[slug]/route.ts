import connectDB from "@/lib/mongodb";
import Event, { type IEvent } from "@/app/database/event.model";
import { NextResponse } from "next/server";

type EventRouteParams = {
  slug: string;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

/**
 * Fetch a single event by its slug.
 * Returns 400 for invalid slugs, 404 when no record matches, and 500 for unexpected server errors.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<EventRouteParams> },
): Promise<NextResponse> {
  try {
    const { slug } = await context.params;

    if (!slug || typeof slug !== "string" || !slug.trim()) {
      return NextResponse.json(
        { message: "Event slug is required." },
        { status: 400 },
      );
    }

    const normalizedSlug = slug.trim();

    if (!SLUG_PATTERN.test(normalizedSlug)) {
      return NextResponse.json(
        {
          message:
            "Invalid event slug. Use a URL-friendly value such as 'tech-summit-2026'.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const event = await Event.findOne({ slug: normalizedSlug })
      .lean<IEvent>()
      .exec();

    if (!event) {
      return NextResponse.json(
        { message: `Event with slug "${normalizedSlug}" was not found.` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Event fetched successfully.",
        event,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching event by slug:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch event details.",
        error: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 },
    );
  }
}
