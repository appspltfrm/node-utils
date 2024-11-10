import {existsSync, statSync, unlinkSync} from "fs";
import {removeSync} from "fs-extra/esm";
import {sync} from "glob";
import path from "path";

export function globDelete(paths, options) {

    const rootDir = options && options.root ? path.resolve(options.root) : process.cwd();

    paths.forEach(function (query) {

        if (typeof query === "string") {

            sync(query, {root: rootDir}).forEach(function (file) {

                file = path.resolve(rootDir, file);

                if (existsSync(file)) {

                    const stat = statSync(file);

                    if (stat.isDirectory()) {
                        removeSync(file);
                    } else {
                        unlinkSync(file);
                    }
                }

            });
        }

    });

}
