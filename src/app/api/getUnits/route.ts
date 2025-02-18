import { NextResponse } from "next/server";
import { execStoredProcedure } from "../../lib/db";
import { Unit } from "@/d";

export async function GET() {
  try {
    const units = await execStoredProcedure<Unit>("GetAllUnitsWithTraits", {
      p_SetID: 1,
    });
    return NextResponse.json(units);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch units" },
      { status: 500 }
    );
  }
}
