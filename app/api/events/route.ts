import connectDB from "@/lib/mongodb";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";
import Event from "@/database/event.model";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(res: NextResponse) {
  try {
    await connectDB();

    const formData = await res.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      return NextResponse.json(
        { message: "Invalid JSON Data Format" },
        { status: 400 },
      );
    }

    const file = formData.get("image") as File;

    if (!file)
      return NextResponse.json(
        { message: "Image File is Required" },
        { status: 400 },
      );

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "/DevEvents",
    });

    event.image = uploadResult.url;

    const createdEvent = await Event.create(event);

    return NextResponse.json(
      { message: "Event Created Successfully", event: createdEvent },
      { status: 201 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Events Fetched Successfully", events },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Event Fetching Failed", error: e },
      { status: 500 },
    );
  }
}
