import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-static";

export async function GET() {
    const html = readFileSync(
        join(process.cwd(), "public", "admin", "index.html"),
        "utf8"
    );
    return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
    });
}
