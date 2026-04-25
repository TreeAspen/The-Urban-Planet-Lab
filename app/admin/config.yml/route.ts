import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-static";

export async function GET() {
    const yml = readFileSync(
        join(process.cwd(), "public", "admin", "config.yml"),
        "utf8"
    );
    return new Response(yml, {
        headers: { "content-type": "text/yaml; charset=utf-8" },
    });
}
