import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const room = request.nextUrl.searchParams.get("room");
    const username = request.nextUrl.searchParams.get("username");
    const isHost = request.nextUrl.searchParams.get("host") === "true";

    console.log('[LiveKit API] Request received:', { room, username, isHost });

    if (!room || !username) {
      console.error('[LiveKit API] Missing parameters:', { room, username });
      return NextResponse.json(
        { error: "Missing room or username" },
        { status: 400 }
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    console.log('[LiveKit API] Config check:', { 
      hasApiKey: !!apiKey, 
      hasApiSecret: !!apiSecret 
    });

    if (!apiKey || !apiSecret) {
      console.error('[LiveKit API] Missing credentials');
      return NextResponse.json(
        { error: "Server misconfigured - LiveKit credentials missing" },
        { status: 500 }
      );
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: username,
      name: username,
      ttl: "24h",
    });

    at.addGrant({
      room: room,
      roomJoin: true,
      canPublish: isHost,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();
    
    console.log('[LiveKit API] ✓ Token generated successfully');
    return NextResponse.json({ token });
  } catch (error) {
    console.error('[LiveKit API] Error:', error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
