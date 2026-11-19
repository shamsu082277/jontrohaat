import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const authPromise = getAuth();

export async function GET(req: Request) {
  const auth = await authPromise;
  return toNextJsHandler(auth).GET(req);
}

export async function POST(req: Request) {
  const auth = await authPromise;
  return toNextJsHandler(auth).POST(req);
}
