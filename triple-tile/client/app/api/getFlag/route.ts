import { NextRequest } from "next/server";
import { createHash } from "crypto";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const secret = process.env.TRIPLE_TILE_SECRET;

  if (!userId || !secret) {
    return new Response(JSON.stringify({ error: "Missing userId or secret" }), {
      status: 400,
    });
  }

  const flag = createHash("sha256")
    .update(`${userId}_${secret}`)
    .digest("hex");

  return new Response(JSON.stringify({ flag }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}