import * as v from "valibot";

const envSchema = v.object({
    DATABASE_URL: v.pipe(v.string(), v.trim(), v.nonEmpty("DATABASE_URL is required")),
    PORT: v.pipe(
        v.string(),
        v.trim(),
        v.toNumber("Port must be a number"),
        v.integer(),
        v.minValue(1001, "Port number must be greater than 1000."),
        v.maxValue(65535, "Port number must not exceed 65535."),
    ),
    JWT_SECRET: v.pipe(v.string(), v.trim(), v.minLength(10, "JWT_SECRET value must have atleast 10 characters")),
    NODE_ENV: v.optional(v.picklist(["development", "staging", "production"] as const), "development"),
    S3_BUCKET: v.pipe(v.string(), v.trim(), v.nonEmpty("Bucket name is required")),
    AWS_REGION: v.pipe(v.string(), v.trim(), v.nonEmpty("Region name is required"), v.regex(/^[a-z]{2}(?:-[a-z]+)+-\d+$/, "Invalid AWS region")),
});

const env = v.parse(envSchema, process.env, { abortEarly: true });

export default env;
