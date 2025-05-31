// get journal entries
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
// GET request to fetch all journal entries
export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = Object.fromEntries(searchParams.entries());

    // Fetch all journal entries with optional filtering
    const journalEntries = await prisma.journalEntry.findMany({
      where: queryParams,
      include: {
        account: true, 
      },
    });

    return NextResponse.json(
      { status: 200, data: journalEntries },
      { status: 200 }
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
// POST request to create a new journal entry
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    // Validate that the required fields are present
    if (!body.accountId || (!body.debit && !body.credit)) {
      return NextResponse.json(
        { status: 400, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch existing entries for the account
    const existingEntries = await prisma.journalEntry.findMany({
      where: {
        accountId: body.accountId,
      },
    });
    const totalDebit = existingEntries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const totalCredit = existingEntries.reduce((sum, entry) => sum + (entry.credit || 0), 0);

    // If this is a debit entry, check if enough credit is available
    if (body.debit && body.debit > 0) {
      if ((totalDebit + body.debit) > totalCredit) {
        return NextResponse.json(
          { status: 400, error: "Insufficient credit for this debit transaction" },
          { status: 400 }
        );
      }
    }

    // Create a new journal entry
    const journalEntry = await prisma.journalEntry.create({
      data: body,
    });

    return NextResponse.json(
      { status: 201, data: journalEntry },
      { status: 201 }
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
