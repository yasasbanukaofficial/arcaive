import { mapToMember } from "@/app/data/mockMapper";
import { MemberIdentityData } from "@/app/data/settings";
import { NextRequest, NextResponse } from "next/server";
import { error, success } from "simple-api-responser";

const MOCK_MEMBER = process.env.MOCK_MEMBER_DATA_URL!;

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(MOCK_MEMBER, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(error("Error when fetching member details!", 404));
    }

    const rawData = await response.json();

    const result: MemberIdentityData = mapToMember(rawData);
    return NextResponse.json(
      success(result, "Member details fetched successfully!", 200),
    );
  } catch (err) {
    console.error("Exception:", err);
    return NextResponse.json(error("Failed to process member data", 500));
  }
}
