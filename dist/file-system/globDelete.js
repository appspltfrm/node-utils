"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globDelete = globDelete;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const fse = tslib_1.__importStar(require("fs-extra"));
const Glob = tslib_1.__importStar(require("glob"));
const path = tslib_1.__importStar(require("path"));
function globDelete(paths, options) {
    const rootDir = options && options.root ? path.resolve(options.root) : process.cwd();
    paths.forEach(function (query) {
        if (typeof query === "string") {
            Glob.sync(query, { root: rootDir }).forEach(function (file) {
                file = path.resolve(rootDir, file);
                if (fs.existsSync(file)) {
                    const stat = fs.statSync(file);
                    if (stat.isDirectory()) {
                        fse.removeSync(file);
                    }
                    else {
                        fs.unlinkSync(file);
                    }
                }
            });
        }
    });
}
