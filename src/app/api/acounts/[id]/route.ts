import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET request to fetch a specific account by id
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    // Validate that the id is provided
    if (!id) {
      return NextResponse.json(
        { status: 400, error: "Account ID is required" },
        { status: 400 }
      );
    }
    // Fetch the account with the given id
    const account = await prisma.account.findUnique({
      where: { id },
    });
    // If account not found, return 404
    if (!account) {
      return NextResponse.json(
        { status: 404, error: "Account not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: 200, data: account }, { status: 200 });
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
// PATCH request to update a specific account by id
export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json();
    const { id } = params;

    // Validate that the id is provided
    if (!id) {
      return NextResponse.json(
        { status: 400, error: "Account ID is required" },
        { status: 400 }
      );
    }

    // Update the account with the given id
    const account = await prisma.account.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ status: 200, data: account }, { status: 200 });
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
// delete request
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    // Validate that the id is provided
    if (!id) {
      return NextResponse.json(
        { status: 400, error: "Account ID is required" },
        { status: 400 }
      );
    }

    // Delete the account with the given id
    await prisma.account.delete({
      where: { id },
    });

    return NextResponse.json(
      { status: 204, message: "Account deleted successfully" },
      { status: 204 }
    );
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
