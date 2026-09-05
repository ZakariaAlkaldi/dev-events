"use server";
import { Booking } from "@/app/database";
import connectDB from "../mongodb";
import { error } from "console";

export const createBooking = async ({
  eventId,
  email,
}: {
  eventId: string;
  email: string;
}) => {
  try {
    await connectDB();

    const booking = await Booking.create({ eventId, email });

    return {
      success: true,
    };
  } catch (e) {
    console.error("Creating booking Failed", e);
    return { success: false, error: e };
  }
};
