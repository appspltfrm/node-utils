"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globDelete = globDelete;
const fs = require("fs");
const fse = require("fs-extra");
const Glob = require("glob");
const path = require("path");
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
