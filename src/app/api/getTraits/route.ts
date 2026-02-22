import { NextResponse } from "next/server";
import { fetchTraits } from "@/lib/datadragon";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const setKey = searchParams.get("set") ?? undefined;
    const traits = await fetchTraits(setKey);
    return NextResponse.json(traits);
  } catch (error) {
    console.error("CDragon fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch traits" },
      { status: 500 }
    );
  }
}
