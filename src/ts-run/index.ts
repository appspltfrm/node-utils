#!/usr/bin/env node
import {spawnSync} from "child_process";
import {existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from "fs";
import os from "os";
import path from "path";
import ts from "typescript";

function findPackageRoot(startDir: string): string | undefined {
  let currDir = startDir;
  while (true) {
    if (existsSync(path.join(currDir, "package.json"))) {
      return currDir;
    }
    const parent = path.dirname(currDir);
    if (parent === currDir) {
      return undefined;
    }
    currDir = parent;
  }
}

function findTsConfig(startDir: string, stopDir: string | undefined): string | undefined {
  let currDir = startDir;
  while (true) {
    const tsconfigPath = path.join(currDir, "tsconfig.json");
    if (existsSync(tsconfigPath)) {
      return tsconfigPath;
    }
    if (currDir === stopDir) {
      return undefined;
    }
    const parent = path.dirname(currDir);
    if (parent === currDir) {
      return undefined;
    }
    currDir = parent;
  }
}

async function main() {

  let inputFile: string | undefined;
  let tsconfigParam: string | undefined;
  let noCheck = false;
  const nodeArgs: string[] = [];

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg === "--tsconfig" && i + 1 < process.argv.length) {
      tsconfigParam = process.argv[++i];
    } else if (arg === "--no-check") {
      noCheck = true;
    } else if (!inputFile) {
      inputFile = arg;
    } else {
      nodeArgs.push(arg);
    }
  }

  if (!inputFile) {
    console.error("Usage: tsr <input-ts-file> [--tsconfig <path>] [--no-check] [args...]");
    process.exit(1);
  }

  const absoluteInputFile = path.resolve(inputFile);
  if (!existsSync(absoluteInputFile)) {
    console.error(`tsr: input file not found: ${inputFile}`);
    process.exit(1);
  }

  const outputFileSegments = inputFile.split("/").map((s, i, a) =>
    i === a.length - 1 ? s.replace(/\.tsx?$/, "") : s
  );
  let outputFile: string | undefined;

  const inputDir = path.dirname(absoluteInputFile);
  const packageRoot = findPackageRoot(inputDir);

  // Temp dir is created next to the input on purpose: it keeps `node_modules`
  // resolution and relative imports from the emitted JS identical to the source
  // tree. It's removed in `finally`/on signal so it never lingers.
  const tempDir = mkdtempSync(path.join(inputDir, "ts-temp-"));

  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) {
      return;
    }
    cleanedUp = true;
    try {
      rmSync(tempDir, {recursive: true, force: true});
    } catch {
      // best-effort
    }
  };

  const signalHandlers: Array<[NodeJS.Signals, () => void]> = [];
  for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"] as NodeJS.Signals[]) {
    const handler = () => {
      cleanup();
      const sigNum = os.constants.signals[sig as keyof typeof os.constants.signals] ?? 0;
      process.exit(128 + sigNum);
    };
    signalHandlers.push([sig, handler]);
    process.on(sig, handler);
  }

  let exitCode = 0;
  try {
    // Labeled block lets error branches `break run;` to skip remaining work
    // while still reaching `process.exit(exitCode)` after the outer `finally`.
    // Plain `return` would skip that statement and lose the exit code.
    run: {
      writeFileSync(path.join(tempDir, "package.json"), JSON.stringify({type: "module"}, null, 4));

      const baseTsConfigPath = tsconfigParam
        ? path.resolve(tsconfigParam)
        : findTsConfig(inputDir, packageRoot);

      const compilerOptions: any = {
        outDir: tempDir,
        sourceMap: true,
        noEmit: false,
        declaration: false,
        declarationMap: false,
        plugins: [{transform: "typescript-transform-paths"}]
      };

      if (noCheck) {
        compilerOptions.noCheck = true;
      }

      if (!baseTsConfigPath) {
        Object.assign(compilerOptions, {
          module: "ESNext",
          target: "ESNext",
          moduleResolution: "Node",
          skipLibCheck: true,
          allowJs: true,
          checkJs: false,
          strict: false
        });
      }

      const synthTsConfig = {
        extends: baseTsConfigPath ? baseTsConfigPath : undefined,
        compilerOptions,
        include: [absoluteInputFile],
        exclude: []
      };
      const synthTsConfigPath = path.join(tempDir, "tsconfig.json");
      writeFileSync(synthTsConfigPath, JSON.stringify(synthTsConfig, null, 4));

      const formatHost: ts.FormatDiagnosticsHost = {
        getCanonicalFileName: f => f,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine
      };

      try {
        const configFile = ts.readConfigFile(synthTsConfigPath, ts.sys.readFile);
        if (configFile.error) {
          console.error(ts.formatDiagnosticsWithColorAndContext([configFile.error], formatHost));
          exitCode = 1;
          break run;
        }

        const parsed = ts.parseJsonConfigFileContent(
          configFile.config,
          ts.sys,
          path.dirname(synthTsConfigPath)
        );

        if (parsed.errors.length > 0) {
          console.error(ts.formatDiagnosticsWithColorAndContext(parsed.errors, formatHost));
          exitCode = 1;
          break run;
        }

        // Force JSX into a transforming mode so node can execute the output.
        // With `jsx: "preserve"` (or unset, which defaults to preserve at emit
        // time) tsc emits `.jsx`, which node refuses with ERR_UNKNOWN_FILE_EXTENSION.
        // Also honor a non-standard `@jsxFactory X` pragma — TypeScript only
        // recognizes `@jsx X`, so we lift it into compiler options ourselves.
        const isTransforming = parsed.options.jsx === ts.JsxEmit.React
          || parsed.options.jsx === ts.JsxEmit.ReactJSX
          || parsed.options.jsx === ts.JsxEmit.ReactJSXDev;

        if (!isTransforming) {
          let pragmaJsxFactory: string | undefined;
          try {
            const head = readFileSync(absoluteInputFile, "utf8").slice(0, 2000);
            pragmaJsxFactory = head.match(/@jsxFactory\s+([A-Za-z_$][\w$]*)/)?.[1];
          } catch {
            // best-effort
          }

          if (pragmaJsxFactory) {
            parsed.options.jsx = ts.JsxEmit.React;
            parsed.options.jsxFactory = parsed.options.jsxFactory ?? pragmaJsxFactory;
          } else {
            parsed.options.jsx = parsed.options.jsxImportSource
              ? ts.JsxEmit.ReactJSX
              : ts.JsxEmit.React;
          }
        }

        const emittedFiles: string[] = [];
        const program = ts.createProgram({
          rootNames: parsed.fileNames,
          options: parsed.options
        });

        const emitResult = program.emit(undefined, (fileName, data, writeByteOrderMark) => {
          ts.sys.writeFile(fileName, data, writeByteOrderMark);
          emittedFiles.push(fileName);
        });

        // In --no-check mode skip semantic diagnostics for speed; only emit-time
        // and parser errors are surfaced.
        const diagnostics = noCheck
          ? emitResult.diagnostics
          : ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
        if (diagnostics.length > 0) {
          console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, formatHost));
        }

        if (emitResult.emitSkipped || diagnostics.some(d => d.category === ts.DiagnosticCategory.Error)) {
          console.error("TypeScript compilation failed");
          exitCode = 1;
          break run;
        }

        let outputFileMatchedSegmentsCount = 0;
        for (const filePath of emittedFiles) {
          const segments = filePath.split("/");
          const lastSegment = segments[segments.length - 1];

          const jsExtMatch = lastSegment.match(/^(.*?)\.(jsx?)$/);
          if (!jsExtMatch) {
            continue;
          }

          const normalizedSegments = [...segments.slice(0, -1), jsExtMatch[1]];

          let matchedSegmentsCount = 0;
          for (let i = 1; i <= normalizedSegments.length; i++) {
            if (normalizedSegments[normalizedSegments.length - i] === outputFileSegments[outputFileSegments.length - i]) {
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
      } catch (error) {
        console.error("TypeScript compilation failed:", error);
        exitCode = 1;
        break run;
      }

      if (!outputFile) {
        console.error("tsr: no JS output file matched the input");
        exitCode = 1;
        break run;
      }

      const result = spawnSync(
        "node",
        ["--import", "tsx", "--enable-source-maps", outputFile, ...nodeArgs],
        {stdio: "inherit"}
      );
      if (result.signal) {
        const sigNum = os.constants.signals[result.signal as keyof typeof os.constants.signals] ?? 0;
        exitCode = 128 + sigNum;
      } else {
        exitCode = result.status ?? 1;
      }
    }
  } finally {
    for (const [sig, handler] of signalHandlers) {
      process.removeListener(sig, handler);
    }
    cleanup();
  }

  process.exit(exitCode);
}

await main();
