import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TSR_PATH = path.resolve(__dirname, "../../src/ts-run/index.ts");
const SAMPLE_TS = path.resolve(__dirname, "sample-script.ts");
const SAMPLE_TSCONFIG = path.resolve(__dirname, "sample-tsconfig.json");
function runTsr(args) {
    const cmd = `node --import tsx ${TSR_PATH} ${args.join(" ")}`;
    console.log(`Running: ${cmd}`);
    return execSync(cmd, { encoding: "utf-8" });
}
console.log("--- Test 1: Simple run ---");
const out1 = runTsr([SAMPLE_TS]);
console.log(out1);
if (!out1.includes("Hello from TS!"))
    throw new Error("Test 1 failed");
console.log("--- Test 2: Run with arguments ---");
const out2 = runTsr([SAMPLE_TS, "arg1", "arg2"]);
console.log(out2);
if (!out2.includes("Arguments: [\"arg1\",\"arg2\"]"))
    throw new Error("Test 2 failed");
console.log("--- Test 3: Run with --tsconfig ---");
const out3 = runTsr([SAMPLE_TS, "--tsconfig", SAMPLE_TSCONFIG, "foo"]);
console.log(out3);
if (!out3.includes("Hello from TS!") || !out3.includes("Arguments: [\"foo\"]"))
    throw new Error("Test 3 failed");
console.log("All tests passed!");
