import { NextResponse } from "next/server";
import { getAboutPage } from "@/strapi/strapi-utils";

export async function GET() {
  try {
    const aboutPage = await getAboutPage();

    if (!aboutPage) {
      return NextResponse.json(
        { error: "About page data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(aboutPage, { status: 200 });
  } catch (error) {
    console.error("Error in /api/about-uses:", error);
    return NextResponse.json(
      { error: "Failed to fetch about page data" },
      { status: 500 }
    );
  }
}

