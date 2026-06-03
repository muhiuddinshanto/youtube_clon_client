import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    return Response.json({ token: "" }, { status: 401 });
  }

  const tokenData = await auth.api.getToken({
    headers: requestHeaders,
  });

  return Response.json({ token: tokenData?.token ?? "" });
}
