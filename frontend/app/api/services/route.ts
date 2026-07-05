import { NextResponse } from "next/server";
import { getServices } from "@/lib/payload";

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json(services);
  } catch (error: any) {
    console.error("Error in GET /api/services:", error);
    return NextResponse.json({ docs: [] });
  }
}
