import { z } from "zod";

const publicEnvBaseSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Template Next Backoffice"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3300"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default("http://127.0.0.1:55330"),
  NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED: z.coerce.boolean().optional().default(false),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional().default(""),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional().default(""),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().default("")
});

const publicEnvSchema = publicEnvBaseSchema.superRefine((value, ctx) => {
  if (!value.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !value.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY または NEXT_PUBLIC_SUPABASE_ANON_KEY のいずれかが必要です",
      path: ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]
    });
  }
});

const serverEnvSchema = publicEnvBaseSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SENTRY_DSN: z.string().optional().default(""),
  SENTRY_ENVIRONMENT: z.string().optional().default("development"),
  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
  MICROSOFT_CLIENT_ID: z.string().optional().default(""),
  MICROSOFT_CLIENT_SECRET: z.string().optional().default("")
}).superRefine((value, ctx) => {
  if (!value.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !value.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY または NEXT_PUBLIC_SUPABASE_ANON_KEY のいずれかが必要です",
      path: ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]
    });
  }
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getPublicEnv(): PublicEnv {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "Template Next Backoffice",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3300",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:55330",
    NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });
}

export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "Template Next Backoffice",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3300",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:55330",
    NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
    MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET
  });
}

export function getSupabasePublishableKey() {
  const env = getPublicEnv();
  return env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}
