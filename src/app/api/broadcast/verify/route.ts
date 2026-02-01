import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();
    
    // Get broadcast key from environment
    const broadcastKey = process.env.BROADCAST_KEY;
    
    console.log('[Verify] Received key:', key?.substring(0, 3) + '***');
    console.log('[Verify] Expected key exists:', !!broadcastKey);
    
    if (!broadcastKey) {
      console.error('[Verify] BROADCAST_KEY not configured in environment');
      return NextResponse.json(
        { error: "Server misconfigured - no broadcast key set" },
        { status: 500 }
      );
    }
    
    // Trim whitespace and compare
    const normalizedKey = key?.trim();
    const normalizedBroadcastKey = broadcastKey.trim();
    
    console.log('[Verify] Normalized comparison - key length:', normalizedKey?.length, 'expected length:', normalizedBroadcastKey.length);
    
    if (normalizedKey === normalizedBroadcastKey) {
      console.log('[Verify] ✓ Broadcast key verified successfully');
      return NextResponse.json({ valid: true, message: "Broadcast key verified" });
    } else {
      console.warn('[Verify] ✗ Broadcast key mismatch');
      return NextResponse.json(
        { valid: false, error: "Invalid broadcast key. Please check and try again." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('[Verify] Error:', error);
    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 400 }
    );
  }
}

