import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook endpoint for Mini App notifications
 * This receives events from Base/Farcaster when users interact with your Mini App
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Log the webhook event
        console.log("[Webhook] Received event:", JSON.stringify(body, null, 2));

        // Handle different event types
        switch (body.type) {
            case "frame_added":
                // User added your Mini App
                console.log(`[Webhook] User ${body.fid} added the app`);
                break;

            case "frame_removed":
                // User removed your Mini App
                console.log(`[Webhook] User ${body.fid} removed the app`);
                break;

            case "notifications_enabled":
                // User enabled notifications
                console.log(`[Webhook] User ${body.fid} enabled notifications`);
                // Store notification token: body.notificationToken
                break;

            case "notifications_disabled":
                // User disabled notifications
                console.log(`[Webhook] User ${body.fid} disabled notifications`);
                break;

            default:
                console.log(`[Webhook] Unknown event type: ${body.type}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[Webhook] Error processing:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Verify webhook signature (optional but recommended)
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-Signature",
        },
    });
}
