import { NextResponse } from "next/server";
import { getAppointments } from "@/lib/payload";

export async function GET() {
  try {
    const appointments = await getAppointments();
    return NextResponse.json(appointments);
  } catch (error: any) {
    console.error("Error in GET /api/appointments:", error);
    return NextResponse.json({ docs: [] });
  }
}
