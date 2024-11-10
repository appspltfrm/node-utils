import {renameSync} from "fs";
import {sync} from "glob";
import path from "path";

export function globRename(source: string, matches: string[], find: string, replace: string) {

    const sourceDir = source ? path.resolve(source) : process.cwd();

    matches.forEach(function (match) {

        if (typeof match === "string") {

            sync((match.charAt(0) === "/" ? "" : "/") + match, {root: sourceDir}).forEach((file) => {

                const sourcePath = path.resolve(sourceDir, file);
                const targetPath = path.resolve(sourceDir, file.replace(sourceDir + "/", "").replace(find, replace));

                if (sourcePath != targetPath) {
                    renameSync(sourcePath, targetPath);
                }
            });
        }

    });

}
