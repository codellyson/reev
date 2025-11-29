import { NextRequest, NextResponse } from "next/server";
import type { TrendData } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "7");

    const trendData: TrendData = {
      dates: Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        return date.toISOString().split("T")[0];
      }),
      sessionCounts: Array.from({ length: days }, () =>
        Math.floor(Math.random() * 200) + 1000
      ),
    };

    return NextResponse.json({ success: true, data: trendData });
  } catch (error) {
    console.error("Error fetching trend:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch trend data" },
      { status: 500 }
    );
  }
}

