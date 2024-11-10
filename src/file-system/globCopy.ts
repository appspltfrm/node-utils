import {statSync} from "fs";
import {sync} from "glob";
import path from "path";
import {copyFileSync} from "./copyFileSync.js";
import {createDirs} from "./createDirs.js";

export function globCopy(source: string, segments: string[], target: string) {

    const sourceDir = path.resolve(source);
    const targetDir = path.resolve(target);

    segments.forEach(function (query) {

        if (typeof query === "string") {

            sync((query.charAt(0) === "/" ? "" : "/") + query, {root: sourceDir}).forEach((segment) => {

                const sourcePath = path.resolve(sourceDir, segment);
                const targetPath = path.resolve(targetDir, segment.replace(sourceDir + "/", ""));

                const stat = statSync(sourcePath);

                if (stat.isFile()) {
                    createDirs(path.dirname(targetPath));
                    copyFileSync(sourcePath, targetPath);
                }
            });
        }

    });

}
