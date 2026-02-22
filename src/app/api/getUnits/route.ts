import { NextResponse } from "next/server";
import { fetchUnits } from "@/lib/datadragon";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const setKey = searchParams.get("set") ?? undefined;
    const units = await fetchUnits(setKey);
    return NextResponse.json(units);
  } catch (error) {
    console.error("CDragon fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch units" },
      { status: 500 }
    );
  }
}
