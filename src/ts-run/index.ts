#!/usr/bin/env node
import {execSync, spawnSync} from "child_process";
import {existsSync, mkdtempSync, rmSync, writeFileSync} from "fs";
import path from "path";

function findTsConfig(startDir: string): string | undefined {
  let currDir = startDir;
  while (currDir !== path.parse(currDir).root) {
    const tsconfigPath = path.join(currDir, "tsconfig.json");
    if (existsSync(tsconfigPath)) {
      return tsconfigPath;
    }
    currDir = path.dirname(currDir);
  }
  return undefined;
}

function findPackageRoot(startDir: string): string {
  let currDir = startDir;
  while (currDir !== path.parse(currDir).root) {
    const packageJsonPath = path.join(currDir, "package.json");
    if (existsSync(packageJsonPath)) {
      return currDir;
    }
    currDir = path.dirname(currDir);
  }
  return "/";
}

async function main() {

  let inputFile: string | undefined;
  let tsconfigParam: string | undefined;
  const nodeArgs: string[] = [];

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === "--tsconfig" && i + 1 < process.argv.length) {
      tsconfigParam = process.argv[++i];
    } else if (!inputFile) {
      inputFile = arg;
    } else {
      nodeArgs.push(arg);
    }
  }

  if (!inputFile) {
    console.error("Usage: node tsr <input-ts-file> [--tsconfig <path>] [args...]");
    process.exit(1);
  }

  const outputFileSegments = inputFile.split("/").map((s, i, a) => i === a.length - 1 ? s.replace(/\.ts(x?)$/, ".js") : s);
  let outputFile: string | undefined;

  const absoluteInputFile: string = path.resolve(inputFile);
  const inputDir: string = path.dirname(absoluteInputFile);
  const tempDirPrefix: string = "ts-temp-";

  const tempDir = mkdtempSync(path.join(inputDir, tempDirPrefix));

  try {
    const packageJson = {type: "module"};
    writeFileSync(path.join(tempDir, "package.json"), JSON.stringify(packageJson, null, 4));

    const baseTsConfigPath = tsconfigParam ? path.resolve(tsconfigParam) : findTsConfig(inputDir);
    const packageRoot = findPackageRoot(inputDir);

    const compilerOptions: any = {
      outDir: tempDir,
      rootDir: packageRoot,
      sourceMap: true,
      noEmit: false
    };

    if (!baseTsConfigPath) {
      Object.assign(compilerOptions, {
        declaration: false,
        module: "ESNext",
        target: "ESNext",
        moduleResolution: "Node",
        skipLibCheck: true,
        allowJs: true,
        checkJs: false,
        strict: false
      });
    }

    const tempTsConfig = {
      extends: baseTsConfigPath ? baseTsConfigPath : undefined,
      compilerOptions,
      include: [absoluteInputFile],
      exclude: []
    };
    const tempTsConfigPath = path.join(tempDir, "tsconfig.json");
    writeFileSync(tempTsConfigPath, JSON.stringify(tempTsConfig, null, 4));

    try {
      let outputFileMatchedSegmentsCount = 0;
      const result = execSync(`tsc --project "${tempTsConfigPath}" --listEmittedFiles`, {encoding: "utf-8"}).split("\n");
      for (const r of result) {
        let filePath = r.trim();
        if (filePath.startsWith("TSFILE:")) {
          filePath = filePath.trim().substring(8);

          const segments = filePath.split("/");
          let matchedSegmentsCount = 0;

          for (let i = 1; i <= segments.length; i++) {
            if (segments[segments.length - i] === outputFileSegments[outputFileSegments.length - i]) {
              matchedSegmentsCount++;
            } else {
              break;
            }
          }

          if (matchedSegmentsCount > outputFileMatchedSegmentsCount) {
            outputFileMatchedSegmentsCount = matchedSegmentsCount;
            outputFile = filePath;
          }
        }
      }
    } catch (error) {
      console.error("TypeScript compilation failed:", error);
      return;
    }

    if (!outputFile) {
      throw new Error("No output file found");
    }

    spawnSync("node", [outputFile, ...nodeArgs], {stdio: "inherit"});

  } finally {
    rmSync(tempDir, {recursive: true, force: true});
  }

  process.exit(0);
}

await main();
