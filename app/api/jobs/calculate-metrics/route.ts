import { NextResponse } from "next/server";
import { calculateMetrics } from "@/lib/jobs/calculate-metrics";

export async function POST() {
  try {
    await calculateMetrics();
    return NextResponse.json({ success: true, message: "Metrics calculated successfully" });
  } catch (error) {
    console.error("Error running metrics job:", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate metrics" },
      { status: 500 }
    );
  }
}

