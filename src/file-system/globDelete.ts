import * as fs from "fs";
import * as fse from "fs-extra";
import * as Glob from "glob";
import * as path from "path";

export function globDelete(paths, options) {

    const rootDir = options && options.root ? path.resolve(options.root) : process.cwd();

    paths.forEach(function (query) {

        if (typeof query === "string") {

            Glob.sync(query, {root: rootDir}).forEach(function (file) {

                file = path.resolve(rootDir, file);

                if (fs.existsSync(file)) {

                    const stat = fs.statSync(file);

                    if (stat.isDirectory()) {
                        fse.removeSync(file);
                    } else {
                        fs.unlinkSync(file);
                    }
                }

            });
        }

    });

}