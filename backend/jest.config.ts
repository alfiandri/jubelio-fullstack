import type { Config } from "jest";
const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/src/tests/**/*.test.ts"],
    extensionsToTreatAsEsm: [".ts"],
    globals: {
        "ts-jest": { useESM: true }
    }
};
export default config;
