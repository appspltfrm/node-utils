"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globRename = globRename;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const Glob = tslib_1.__importStar(require("glob"));
const path = tslib_1.__importStar(require("path"));
function globRename(source, matches, find, replace) {
    const sourceDir = source ? path.resolve(source) : process.cwd();
    matches.forEach(function (match) {
        if (typeof match === "string") {
            Glob.sync((match.charAt(0) === "/" ? "" : "/") + match, { root: sourceDir }).forEach((file) => {
                const sourcePath = path.resolve(sourceDir, file);
                const targetPath = path.resolve(sourceDir, file.replace(sourceDir + "/", "").replace(find, replace));
                if (sourcePath != targetPath) {
                    fs.renameSync(sourcePath, targetPath);
                }
            });
        }
    });
}
