import { configDotenv } from "dotenv";
import { getEnvValidated, getValidatorsAndEnvDiff } from "./lib/server/env";

const envVars = configDotenv({
  path: process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
  quiet: false
});

function validateEnv() {
  const success = [];
  const failed = [];
  const skippedNoValidator = [];
  console.log("\n", "#".repeat(50), "\n");
  console.log(`[instrumentation] validating environment variables...`);
  const keys = Object.keys(envVars.parsed ?? {});
  if (keys.length === 0) {
    console.log(`[instrumentation] no environment variables found`);
    return;
  }
  for (const key of keys) {
    try {
      const val = getEnvValidated(key);
      if (typeof val === "string") success.push(key);
      else skippedNoValidator.push(key);
    } catch {
      failed.push(key);
    }
  }
  console.log(
    `[instrumentation] validation complete: ${success.length} success, ${failed.length} failed, ${skippedNoValidator.length} skipped (no validator)`,
  );
  if (failed.length > 0) {
    console.log(`[instrumentation] validation failed: ${failed.join(", ")}`);
  }
  if (skippedNoValidator.length > 0) {
    console.log(
      `[instrumentation] validation skipped (no validator): ${skippedNoValidator.length > 3 ? skippedNoValidator.length : skippedNoValidator.join(", ")}`,
    );
  }

  if (failed.length > 0) {
    throw new Error(
      `[instrumentation] validation failed: ${failed.join(", ")}`,
    );
  }

  const { hasValidatorButNotSet, hasNoValidatorButSet } =
    getValidatorsAndEnvDiff(keys);
  if (hasValidatorButNotSet.length > 0) {
    console.warn(
      `[instrumentation] missing env vars but have validators: ${hasValidatorButNotSet.join(", ")}`,
    );
  }
  if (hasNoValidatorButSet.length > 0) {
    console.warn(
      `[instrumentation] env vars with missing validators: ${hasNoValidatorButSet.join(", ")}`,
    );
  }

  console.log("\n", "#".repeat(50), "\n");
}

validateEnv();
