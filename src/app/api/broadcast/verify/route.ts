import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();
    
    const broadcastKey = process.env.BROADCAST_KEY;
    
    if (!broadcastKey) {
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }
    
    if (key === broadcastKey) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false, error: "Invalid broadcast key" });
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
