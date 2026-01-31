import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const room = request.nextUrl.searchParams.get("room");
  const username = request.nextUrl.searchParams.get("username");
  const isHost = request.nextUrl.searchParams.get("host") === "true";

  if (!room || !username) {
    return NextResponse.json(
      { error: "Missing room or username" },
      { status: 400 }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Server misconfigured" },
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
  
  return NextResponse.json({ token });
}
