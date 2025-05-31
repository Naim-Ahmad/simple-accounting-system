import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    // const accountId = searchParams.get("accountId");

    const queryParams = Object.fromEntries(searchParams.entries());
    const accounts = await prisma.account.findMany({
      where: queryParams,
    });
    return NextResponse.json({ status: 200, data: accounts }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { status: 500, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { status: 500, error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

// post request
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const account = await prisma.account.create({
      data: body,
    });
    return NextResponse.json({ status: 201, data: account }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { status: 500, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { status: 500, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
