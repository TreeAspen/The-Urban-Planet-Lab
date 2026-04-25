import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const provider = url.searchParams.get("provider") || "github";
    const scope = url.searchParams.get("scope") || "repo,user";

    if (provider !== "github") {
        return new Response(`Provider "${provider}" is not supported`, { status: 400 });
    }

    const clientId = process.env.OAUTH_CLIENT_ID;
    if (!clientId) {
        return new Response("OAUTH_CLIENT_ID is not configured on the server", {
            status: 500,
        });
    }

    const state = randomBytes(16).toString("hex");
    const redirectUri = `${url.origin}/api/callback`;

    const authUrl = new URL("https://github.com/login/oauth/authorize");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("scope", scope);
    authUrl.searchParams.set("state", state);

    const response = NextResponse.redirect(authUrl.toString());
    response.cookies.set("oauth_state", state, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 600,
        path: "/",
    });
    return response;
}
