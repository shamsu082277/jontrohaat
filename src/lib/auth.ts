import { APIError, betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

async function createAuth() {
  const { default: clientPromise, getDatabase } = await import("./mongodb");
  const db = await getDatabase();
  const baseURL =
    process.env.BETTER_AUTH_URL ||
    (process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_APP_URL
      : "http://localhost:3000");
  if (!baseURL) {
    throw new Error("BETTER_AUTH_URL must be configured for production");
  }
  const secret = process.env.BETTER_AUTH_SECRET;
  if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
    throw new Error("BETTER_AUTH_SECRET must be at least 32 characters in production");
  }
  const isValidProfileImage = (image: unknown) => {
    if (image === undefined || image === null || image === "") return true;
    if (typeof image !== "string") return false;
    try {
      const url = new URL(image);
      return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
    } catch {
      return false;
    }
  };
  return betterAuth({
    baseURL,
    secret: secret || "temporary-development-secret-at-least-32-chars",
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
      databaseHooks: {
        user: {
          create: {
            before: async (user) => {
              if (!isValidProfileImage(user.image)) {
                throw new APIError("BAD_REQUEST", { message: "Profile image must be a valid HTTPS URL" });
              }
            },
          },
          update: {
            before: async (user) => {
              if ("image" in user && !isValidProfileImage(user.image)) {
                throw new APIError("BAD_REQUEST", { message: "Profile image must be a valid HTTPS URL" });
              }
            },
          },
        },
      },
    },
    plugins: [
      jwt({
        jwt: {
          expirationTime: "7d",
          definePayload: ({ user }) => ({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }),
        },
      }),
    ],
  });
}

type AuthInstance = Awaited<ReturnType<typeof createAuth>>;

let _auth: AuthInstance | null = null;
let _authPromise: Promise<AuthInstance> | null = null;

export async function getAuth(): Promise<AuthInstance> {
  if (_auth) return _auth;
  if (_authPromise) return _authPromise;
  _authPromise = createAuth().then((instance) => {
    _auth = instance;
    return instance;
  });
  return _authPromise;
}
