"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

const authBaseURL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000");

export const authClient = createAuthClient({
  ...(authBaseURL ? { baseURL: authBaseURL } : {}),
  plugins: [jwtClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
