import { NextResponse } from "next/server";
import { calculateSessionMetrics } from "@/lib/jobs/calculate-metrics";

export async function POST() {
  try {
    await calculateSessionMetrics();
    return NextResponse.json({ success: true, message: "Metrics calculated successfully" });
  } catch (error) {
    console.error("Error running metrics job:", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate metrics" },
      { status: 500 }
    );
  }
}

