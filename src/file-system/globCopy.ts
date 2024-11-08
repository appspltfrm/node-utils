import * as fs from "fs";
import * as Glob from "glob";
import * as path from "path";
import {copyFileSync} from "./copyFileSync";
import {createDirs} from "./createDirs";

export function globCopy(source: string, segments: string[], target: string) {

    const sourceDir = path.resolve(source);
    const targetDir = path.resolve(target);

    segments.forEach(function (query) {

        if (typeof query === "string") {

            Glob.sync((query.charAt(0) === "/" ? "" : "/") + query, {root: sourceDir}).forEach((segment) => {

                const sourcePath = path.resolve(sourceDir, segment);
                const targetPath = path.resolve(targetDir, segment.replace(sourceDir + "/", ""));

                const stat = fs.statSync(sourcePath);

                if (stat.isFile()) {
                    createDirs(path.dirname(targetPath));
                    copyFileSync(sourcePath, targetPath);
                }
            });
        }

    });

}