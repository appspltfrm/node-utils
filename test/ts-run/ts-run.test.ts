import {execSync, spawnSync} from "child_process";
import {existsSync, mkdirSync, rmSync, writeFileSync} from "fs";
import path from "path";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TSR_PATH = path.resolve(__dirname, "../../src/ts-run/index.ts");
const SAMPLE_TS = path.resolve(__dirname, "sample-script.ts");
const SAMPLE_TSCONFIG = path.resolve(__dirname, "sample-tsconfig.json");
const SCRATCH_DIR = path.resolve(__dirname, ".scratch");

function runTsr(args: string[]) {
  const cmd = `node --import tsx ${TSR_PATH} ${args.join(" ")}`;
  console.log(`Running: ${cmd}`);
  return execSync(cmd, {encoding: "utf-8"});
}

function runTsrCapture(args: string[]) {
  const result = spawnSync("node", ["--import", "tsx", TSR_PATH, ...args], {encoding: "utf-8"});
  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? ""
  };
}

console.log("--- Test 1: Simple run ---");
const out1 = runTsr([SAMPLE_TS]);
console.log(out1);
if (!out1.includes("Hello from TS!")) {
  throw new Error("Test 1 failed");
}

console.log("--- Test 2: Run with arguments ---");
const out2 = runTsr([SAMPLE_TS, "arg1", "arg2"]);
console.log(out2);
if (!out2.includes("Arguments: [\"arg1\",\"arg2\"]")) {
  throw new Error("Test 2 failed");
}

console.log("--- Test 3: Run with --tsconfig ---");
const out3 = runTsr([SAMPLE_TS, "--tsconfig", SAMPLE_TSCONFIG, "foo"]);
console.log(out3);
if (!out3.includes("Hello from TS!") || !out3.includes("Arguments: [\"foo\"]")) {
  throw new Error("Test 3 failed");
}

if (existsSync(SCRATCH_DIR)) {
  rmSync(SCRATCH_DIR, {recursive: true, force: true});
}
mkdirSync(SCRATCH_DIR, {recursive: true});
writeFileSync(path.join(SCRATCH_DIR, "tsconfig.json"), JSON.stringify({
  compilerOptions: {
    module: "ESNext",
    target: "ESNext",
    moduleResolution: "Bundler",
    jsx: "react-jsx",
    skipLibCheck: true,
    strict: false
  }
}));

try {
  console.log("--- Test 4: .tsx input ---");
  const tsxFile = path.join(SCRATCH_DIR, "sample.tsx");
  writeFileSync(tsxFile, 'const x: number = 21; console.log("tsx-result:", x * 2);');
  const out4 = runTsr([tsxFile]);
  if (!out4.includes("tsx-result: 42")) {
    throw new Error(`Test 4 failed: ${out4}`);
  }

  console.log("--- Test 5: exit code propagation ---");
  const exitFile = path.join(SCRATCH_DIR, "exit7.ts");
  writeFileSync(exitFile, "process.exit(7);");
  const r5 = runTsrCapture([exitFile]);
  if (r5.status !== 7) {
    throw new Error(`Test 5 failed: expected exit 7, got ${r5.status}`);
  }

  console.log("--- Test 6: type error fails non-zero ---");
  const typeErrFile = path.join(SCRATCH_DIR, "typeerr.ts");
  writeFileSync(typeErrFile, 'const n: number = "string"; console.log(n);');
  const r6 = runTsrCapture([typeErrFile]);
  if (r6.status === 0) {
    throw new Error(`Test 6 failed: type error should produce non-zero exit, got ${r6.status}`);
  }

  console.log("--- Test 7: --no-check skips type errors ---");
  const r7 = runTsrCapture(["--no-check", typeErrFile]);
  if (r7.status !== 0) {
    throw new Error(`Test 7 failed: --no-check should ignore type errors, got ${r7.status}`);
  }
  if (!r7.stdout.includes("string")) {
    throw new Error(`Test 7 failed: expected stdout 'string', got: ${r7.stdout}`);
  }

  console.log("--- Test 8: missing file ---");
  const r8 = runTsrCapture([path.join(SCRATCH_DIR, "does-not-exist.ts")]);
  if (r8.status !== 1) {
    throw new Error(`Test 8 failed: expected exit 1, got ${r8.status}`);
  }
  if (!r8.stderr.includes("input file not found")) {
    throw new Error(`Test 8 failed: expected stderr 'input file not found', got: ${r8.stderr}`);
  }

  console.log("--- Test 9: source maps in stack trace ---");
  const throwFile = path.join(SCRATCH_DIR, "boom.ts");
  writeFileSync(throwFile, [
    "function boom() {",
    '    throw new Error("from-ts");',
    "}",
    "boom();"
  ].join("\n"));
  const r9 = runTsrCapture([throwFile]);
  if (!r9.stderr.includes("boom.ts:2")) {
    throw new Error(`Test 9 failed: source map should map to boom.ts:2, got stderr: ${r9.stderr}`);
  }

  console.log("--- Test 10: temp dir cleaned up after run ---");
  runTsrCapture([SAMPLE_TS]);
  const stragglers = execSync(`find ${SCRATCH_DIR} -maxdepth 2 -name 'ts-temp-*' -type d`, {encoding: "utf-8"}).trim();
  if (stragglers) {
    throw new Error(`Test 10 failed: leftover temp dirs:\n${stragglers}`);
  }
  const sampleStragglers = execSync(`find ${path.dirname(SAMPLE_TS)} -maxdepth 2 -name 'ts-temp-*' -type d`, {encoding: "utf-8"}).trim();
  if (sampleStragglers) {
    throw new Error(`Test 10 failed: leftover temp dirs near sample:\n${sampleStragglers}`);
  }

  console.log("--- Test 11: tsconfig with jsx unset (would emit .jsx) — must run via override ---");
  const noJsxDir = path.join(SCRATCH_DIR, "no-jsx");
  mkdirSync(noJsxDir, {recursive: true});
  writeFileSync(path.join(noJsxDir, "tsconfig.json"), JSON.stringify({
    compilerOptions: {
      module: "ESNext",
      target: "ESNext",
      moduleResolution: "Bundler",
      skipLibCheck: true,
      strict: false
    }
  }));
  const customJsxFile = path.join(noJsxDir, "custom.tsx");
  writeFileSync(customJsxFile, [
    "/* @jsxFactory h */",
    "function h(tag: string, props: any, ...children: any[]) { return {tag, props, children}; }",
    "const node = <div id=\"x\">hi</div>;",
    'console.log("jsx-factory:", JSON.stringify(node));'
  ].join("\n"));
  const r11 = runTsrCapture([customJsxFile]);
  if (r11.status !== 0) {
    throw new Error(`Test 11 failed: status ${r11.status}, stderr: ${r11.stderr}`);
  }
  if (!r11.stdout.includes('"tag":"div"')) {
    throw new Error(`Test 11 failed: expected tag div in output, got: ${r11.stdout}`);
  }

  console.log("All tests passed!");
} finally {
  rmSync(SCRATCH_DIR, {recursive: true, force: true});
}
