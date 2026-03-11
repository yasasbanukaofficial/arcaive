import { NextRequest, NextResponse } from "next/server";
import { mapToJobListing } from "@/features/jobs/utils/mockMapper";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get("query") || "software engineer";
  const location = searchParams.get("location") || "";

  const url = new URL(`${API_URL}/jobs/search`);
  url.searchParams.set("query", query);
  if (location) url.searchParams.set("location", location);

  try {
    const response = await fetch(url.toString(), { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch jobs from backend" },
        { status: response.status }
      );
    }

    const result = await response.json();
    const rawJobs: any[] = result?.data ?? [];
    const mappedJobs = rawJobs.map(mapToJobListing);

    return NextResponse.json({ success: true, data: mappedJobs });
  } catch (error) {
    console.error("Job search proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to reach job service" },
      { status: 502 }
    );
  }
}
