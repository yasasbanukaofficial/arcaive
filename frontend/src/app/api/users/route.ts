import { mapToUser } from "@/app/data/mockMapper";
import { UserIdentityData } from "@/app/data/settings";
import { NextRequest, NextResponse } from "next/server";
import { error, success } from "simple-api-responser";

const MOCK_USER = process.env.MOCK_USER_DATA_URL!;

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(MOCK_USER, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(error("Error when fetching user details!", 404));
    }

    const rawData = await response.json();

    const result: UserIdentityData = mapToUser(rawData);
    return NextResponse.json(
      success(result, "User details fetched successfully!", 200),
    );
  } catch (err) {
    console.error("Exception:", err);
    return NextResponse.json(error("Failed to process user data", 500));
  }
}

// export async function GET(req: NextRequest) {
//   try {
//     const response = await fetch(MOCK_USER, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       return NextResponse.json(error("Error when fetching user details!", 404));
//     }

//     const result = await response.json();
//     return NextResponse.json(
//       success(result, "User details fetched successfully!", 200),
//     );
//   } catch (err) {
//     console.error("Exception:", err);
//     return NextResponse.json(error("Failed to process user data", 500));
//   }
// }
