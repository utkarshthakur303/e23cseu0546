import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "http://4.224.186.213/evaluation-service";

/**
 * GET /api/notifications
 *
 * Server-side proxy to avoid browser CORS issues.
 * Forwards query params (page, limit, notification_type) to the evaluation API.
 */
export async function GET(request) {
  try {
    const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication token is not configured. Set NEXT_PUBLIC_AUTH_TOKEN in .env.local" },
        { status: 401 }
      );
    }

    // Forward query params from the client
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";
    const notificationType = searchParams.get("notification_type") || "";

    const params = { page, limit };
    if (notificationType) {
      params.notification_type = notificationType;
    }

    const response = await axios.get(`${BASE_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params,
      timeout: 10000,
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("[API Proxy] Error fetching notifications:", error?.message);

    if (error.response) {
      return NextResponse.json(
        {
          error: "Upstream API error",
          details: error.response.data,
          status: error.response.status,
        },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch notifications. Please try again later." },
      { status: 500 }
    );
  }
}