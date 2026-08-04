// import "server-only";
import { configDotenv } from "dotenv";

configDotenv({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env.local"
})

const databaseUrlValidator = (envVal: string) => {
  const value = typeof envVal === "string" ? envVal.trim() : undefined;
  if (!value) {
    throw new Error("DATABASE_URL is required");
  }
  try {
    const url = new URL(value);

    if (url.protocol !== "postgresql:") {
      throw new Error("DATABASE_URL must be a valid PostgreSQL URL");
    }
  } catch (e) {
    throw e;
  }

  return value;
};

const validateStringRequired = (envVal: string, key: string) => {
  const value = typeof envVal === "string" ? envVal.trim() : undefined;

  if (!value) {
    throw new Error(`${key} is required`);
  }
  return value;
};

const validateURL = (envVal: string, key: string) => {
  const value = typeof envVal === "string" ? envVal.trim() : undefined;

  if (!value) {
    throw new Error(`${key} is required`);
  }

  try {
    const url = new URL(envVal);
    return value;
  } catch (e) {
    throw new Error(
      `${key} is not a valid URL. Reason: ${(e as Error).message}`,
    );
  }
};

const getEnumValidator = (possibleVals: string[]) => {
  return function (envVal: string, key: string) {
    const value = typeof envVal === "string" ? envVal.trim() : undefined;

    if (!value) {
      throw new Error(`${key} is required`);
    }
    if (!possibleVals.includes(envVal)) {
      throw new Error(`${envVal} value to ${key} invalid. Value can only be ${possibleVals.join(", ")}`)
    }
    return value;
  }
}

const validators: Record<string, (value: string, key: string) => string> = {
  DATABASE_URL: databaseUrlValidator,
  RESEND_KEY: validateStringRequired,
  NEXT_PUBLIC_SUPABASE_URL: validateURL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: validateStringRequired,
};

export const getValidatorsAndEnvDiff = (keys: string[]) => {
  const full = keys.concat(Object.keys(validators));
  const diff = full.filter(
    (key) => !(key in validators) || !keys.some((k) => k === key),
  );

  const hasValidatorButNotSet = diff.filter((key) => key in validators);
  const hasNoValidatorButSet = diff.filter((key) => !(key in validators));
  return { hasValidatorButNotSet, hasNoValidatorButSet };
};

export const getEnv = (key: string, defaultValue: string): string => {
  console.log("ENVVAR ACCESSED:", key)
  return process.env[key] ?? defaultValue;
};

export const getEnvValidated = (key: string): string | undefined => {
  const value = process.env[key];
  if (!value) {
    console.warn(
      `[env-validation:warn] No value set for environment variable ${key}.`,
    );
    throw new Error(`Missing environment variable: ${key}`);
  }
  if (key in validators) {
    try {
      console.log(`[env-validation] Validating environment variable ${key}`);
      return validators[key](value, key);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `[env-validation:error] Failed to validate environment variable ${key}:`,
          error.message,
        );
      } else {
        console.error(
          `[env-validation:error] Failed to validate environment variable ${key}:`,
          String(error),
        );
      }
      throw error;
    }
  }
  console.warn(
    `[env-validation:warn] No validator found for environment variable ${key}. Skipping validation.`,
  );
};

export const serverEnv = {
  databaseUrl: getEnv("DATABASE_URL", ""),
  supabaseUrl: getEnv("NEXT_PUBLIC_SUPABASE_URL", ""),
  supabaseKey: getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", ""),
  resendKey: getEnv("RESEND_KEY", ""),
};
