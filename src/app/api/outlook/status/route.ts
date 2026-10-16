import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/microsoft";
export async function GET(request: NextRequest) { const session = await getSession(request); return NextResponse.json({ connected: Boolean(session?.accessToken) }); }
