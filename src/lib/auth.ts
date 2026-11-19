import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import clientPromise, { getDatabase } from "./mongodb";

let _auth: ReturnType<typeof betterAuth> | null = null;
let _authPromise: Promise<ReturnType<typeof betterAuth>> | null = null;

async function createAuth() {
  const db = await getDatabase();
  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    secret:
      process.env.BETTER_AUTH_SECRET ||
      "temporary-development-secret-at-least-32-chars",
    database: mongodbAdapter(db, {
      client: await clientPromise,
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 6,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        enabled: Boolean(
          process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ),
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "customer",
          input: false, // Prevents users from passing role during registration
        },
        phone: {
          type: "string",
          required: false,
        },
        district: {
          type: "string",
          required: false,
        },
        division: {
          type: "string",
          required: false,
        },
      },
    },
    plugins: [
      jwt({
        jwt: {
          expirationTime: "7d",
        },
      }),
    ],
  });
}

export async function getAuth() {
  if (_auth) return _auth;
  if (_authPromise) return _authPromise;
  _authPromise = createAuth().then((instance) => {
    _auth = instance;
    return instance;
  });
  return _authPromise;
}
