import { JobListing } from "@/@types/jobs";
import { mapToJobListing } from "@/app/data/mockMapper";
import { NextRequest, NextResponse } from "next/server";
import { error, success } from "simple-api-responser";

const MOCK_JOBS = process.env.MOCK_JOB_DATA_URL!;

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(MOCK_JOBS);

    if (!response.ok) {
      return NextResponse.json(error("Error when fetching job data!", 404));
    }

    const rawData = await response.json();

    const mappedData: JobListing[] = rawData.map(mapToJobListing);

    return NextResponse.json(
      success(mappedData, "Job Listing Fetched Successfully", 200),
    );
  } catch (err) {
    console.error("Exception:", err);
    return NextResponse.json(error("Failed to process job data", 500));
  }
}

// For real backend req handling
// export async function GET(req: NextRequest) {
//   try {
//     const response = await fetch(MOCK_JOBS, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     if (!response.ok) {
//       return NextResponse.json(error("Error when fetching data!", 404));
//     }
//     const data = await response.json();
//     return NextResponse.json(
//       success(data, "Job Listing Fetched Successfully", 200),
//     );
//   } catch (err) {
//     console.error("Fetch Exception:", err);
//     return NextResponse.json(
//       error("Failed to connect to job data service", 500),
//     );
//   }
// }
