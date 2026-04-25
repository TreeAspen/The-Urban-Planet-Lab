import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const cookieState = req.cookies.get("oauth_state")?.value;

    if (!code || !state || state !== cookieState) {
        return htmlResponse(buildMessage("error", { message: "Invalid OAuth state" }));
    }

    const clientId = process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        return htmlResponse(
            buildMessage("error", { message: "OAuth credentials not configured" })
        );
    }

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
        }),
    });

    const tokenData = (await tokenRes.json()) as {
        access_token?: string;
        error?: string;
        error_description?: string;
    };

    if (tokenData.error || !tokenData.access_token) {
        return htmlResponse(
            buildMessage("error", {
                message: tokenData.error_description || tokenData.error || "Token exchange failed",
            })
        );
    }

    return htmlResponse(
        buildMessage("success", {
            token: tokenData.access_token,
            provider: "github",
        })
    );
}

function buildMessage(status: "success" | "error", payload: object) {
    return `authorization:github:${status}:${JSON.stringify(payload)}`;
}

function htmlResponse(message: string) {
    const safeMessage = JSON.stringify(message);
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Authorizing…</title></head>
<body>
<p>Authorizing with GitHub… You can close this window.</p>
<script>
(function() {
  var message = ${safeMessage};
  function receiveMessage(e) {
    if (!window.opener) return;
    window.opener.postMessage(message, e.origin);
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  if (window.opener) {
    window.opener.postMessage("authorizing:github", "*");
  }
})();
</script>
</body>
</html>`;
    return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
    });
}
